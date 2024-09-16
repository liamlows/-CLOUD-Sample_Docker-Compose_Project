const express = require('express');
const router = express.Router();
const pool = require('../db');
const secret = 'not-a-secret';
const crypto = require('crypto');
const util = require('../util');
const {getUsernameFromId, isUserAuthenticated} = require("../util");
const {uploadImage} = require("../s3");

/* TODO

PUT /users/:username/student
    Sets the student ID on the account.

PUT /users/:username/role
    Assigns role ID for the account.

GET /users/:username/status

 */


async function findRoleById(roleId) {
    let rows, fields;

    [rows, fields] = await pool.execute('SELECT * FROM `roles` WHERE `role_id` = ?',
        [roleId, ]);

    if(rows.length){
        return rows[0];
    }
    else {
        return undefined;
    }
}

async function findRole(roleType, schoolId, courseId){
    let rows, fields;

    if(schoolId && courseId){
        [rows, fields] = await pool.execute('SELECT * FROM `roles` WHERE `role_type` = ? AND `school_id` = ? AND `course_id` = ?',
            [roleType, schoolId, courseId]);
    }
    else if(schoolId) {
        [rows, fields] = await pool.execute('SELECT * FROM `roles` WHERE `role_type` = ? AND `school_id` = ? AND `course_id` IS NULL',
            [roleType, schoolId,]);
    }
    else if(courseId) {
        console.log("Must specify school when using course ID for role.");
        return [];
    }
    else {
        [rows, fields] = await pool.execute('SELECT * FROM `roles` WHERE `role_type` = ? AND `school_id` IS NULL AND `course_id` IS NULL',
            [roleType, ]);
    }

    return rows;
}

async function getGlobalAdminRole(){
    let roles = await findRole(util.ADMIN_ROLE_TYPE, null, null);
    if (!roles.length) {
        await createRole(util.ADMIN_ROLE_TYPE, null, null);
        roles = await findRole(util.ADMIN_ROLE_TYPE, null, null);
    }

    return roles[0]["role_id"];
}

async function createRole(roleType, schoolId, courseId){
    try{
        await pool.execute('INSERT INTO `roles`(role_type, course_id, school_id) VALUES (? ? ?)',
            [roleType, courseId, schoolId]);
    } catch(error){
        return false;
    }

    return true;
}


async function setStatusOnline(username) {
    await pool.execute('UPDATE `accounts` SET `last_logged_in` = ?, `logged_in` = 1 WHERE `username` = ?',
        [new Date(), username]);
}

async function setStatusOffline(username) {
    await pool.execute('UPDATE `accounts` SET `logged_in` = 0 WHERE `username` = ?',
        [username]);
}

// POST /account/register
router.post("/api/account/register", async (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;

    // Check for required parameters
    if(username === undefined || password === undefined){
        return res.sendStatus(400);
    }

    // Optional parameters
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let schoolId = undefined; // req.body.schoolId;
    let roleId;

    if (firstName === undefined){
        firstName = "";
    }
    if(lastName === undefined) {
        lastName = "";
    }

    if(schoolId === undefined) {
        schoolId = null;
    }

    if(schoolId === null){
        try {
            roleId = await getGlobalAdminRole();
        } catch(error) {
            return next(error);
        }
    }

    // Hash password
    const hash = crypto
        .createHmac("sha256", secret)
        .update(password)
        .digest("hex");

    // Query DB for an already existing account
    let rows, fields;
    try{
        [rows, fields] = await pool.execute('SELECT * FROM `accounts` WHERE `username` = ?', [username]);
    } catch(error){
        return next(error);
    }

    if(rows.length !== 0){
        // Account already exists.
        res.status(200).json({success: 0, error: "An account already exists with that username."});
        return next();
    }

    if(schoolId !== null){
        // Check if school exists
        try{
            [rows, fields] = await pool.execute('SELECT * FROM `school` WHERE `school_id` = ?', [schoolId]);
        } catch(error){
            return next(error);
        }

        // School does not exist
        if(rows.length === 0){
            res.status(200).json({success: 0, error: `School with ID ${schoolId} does not exist.`});
            return next();
        }
    }

    // Insert new account into DB
    try {
        await pool.execute('INSERT INTO `accounts`(username, password, first_name, last_name, school_id, role_id) VALUES (?, ?, ?, ?, ?, ?)',
            [username, hash, firstName, lastName, schoolId, roleId]);
    } catch (error) {
        return next(error);
    }

    res.status(200).json({success: 1, error: ""});
});


// POST /account/login
router.post("/api/account/login", async (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;

    // Check for required parameters
    if(username === undefined || password === undefined){
        return res.sendStatus(400);
    }

    // Hash password
    const hash = crypto
        .createHmac("sha256", secret)
        .update(password)
        .digest("hex");

    // Query DB for credentials
    let rows, fields;
    try{
        [rows, fields] = await pool.execute('SELECT * FROM `accounts` WHERE `username` = ? AND `password` = ?',
            [username, hash]);
    } catch(error){
        return next(error);
    }

    res.status(200);

    if(rows.length === 0){
        res.json({success: 0, error: "Invalid credentials."}).send();
        return next();
    }
    else if(rows.length > 1){
        res.json({success: 0, error: "Multiple accounts with same credentials"}).send();
        return next();
    }

    let user = rows[0];
    let accountId = user.account_id ? user.account_id : -1;
    let roleType = "";

    if(user.role_id) {
        let role = findRoleById(user.role_id);
        if(role)
            roleType = role.role_type;
    }

    // This initializes the login session.
    req.session.accountId = user.account_id;
    req.session.username = username;
    req.session.roleType = roleType;
    res.cookie('username', username);
    res.cookie('roleType', roleType);
    res.cookie('accountId', accountId);

    try {
        await setStatusOnline(username);
    } catch(error) {
        return next(error);
    }

    res.json({success: 1, error: "", username: username, account_id: user.account_id});
});


// GET /account/logout
router.get("/api/account/logout", async (req, res, next) => {
    // Clear the login session.

    let username = req.session.username;

    res.cookie('username', "");

    try {
        await setStatusOffline(username);
    } catch(error) {
        return next(error);
    }

    req.session.destroy((err) => {
        if(err) return next(err);
        res.sendStatus(200);
    });
});


router.get("/api/username/:id", async (req, res, next) => {
    let accountId = parseInt(req.params.id);

    if(isNaN(accountId)){
        return res.sendStatus(404);
    }

    let username = await getUsernameFromId(accountId);

    if(username === undefined) {
        return res.sendStatus(404);
    }
    res.status(200).json({accountId: accountId, username: username});
});



router.get("/api/users/:account_id", async (req, res, next) => {
    // Query DB for user

    let rows, fields;
    try{
        [rows, fields] = await pool.execute(
            'SELECT username, first_name, last_name, account_id FROM `accounts` WHERE `account_id` = ?',
            [req.params.account_id]);
    } catch(error){
        return next(error);
    }

    if(rows.length === 0){
        return res.sendStatus(404);
    }

    let user = rows[0];
    res.status(200).json(user);
});

router.get("/api/users/", async (req, res, next) => {
    // Query DB for user
    let rows, fields;
    try{
        [rows, fields] = await pool.execute('SELECT username, first_name, last_name, account_id FROM `accounts`');
    } catch(error){
        return next(error);
    }

    res.status(200).json(rows);
});


router.put("/api/account", async(req, res, next) => {
    logger.info(`Got put request for profile. ${JSON.stringify(req.files)}`);
    res.status(200).json(req.files);
});

router.get("/api/users/:account_id/status/", async (req, res, next) => {
    // Query DB for user
    let rows, fields;
    try{
        [rows, fields] = await pool.execute(
            'SELECT username, last_logged_in, logged_in FROM `accounts` WHERE `account_id` = ?',
            [req.params.account_id]);
    } catch(error){
        return next(error);
    }

    if(rows.length === 0){
        return res.sendStatus(404);
    }

    let user = rows[0];
    res.status(200).json(user);
});


router.post("/api/account/pfp", isUserAuthenticated, async (req, res, next)=> {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    if(req.files.profilePic === undefined){
        return res.status(400).send("No profile picture uploaded.");
    }

    let profilePic = req.files.profilePic;
    let extension = profilePic.name.split('.').pop();
    let filepath = `images/${req.session.accountId}.${extension}`
    let uploadPath = `${__dirname}/../public/${filepath}`;
    try {
        let data = await uploadImage(req.session.accountId, profilePic, extension);
        logger.info("Uploaded profile picture to:" + data.Location);
        await pool.execute(
            'UPDATE `accounts` SET `pfp_url` = ? WHERE `account_id` = ?',
            [data.Location, req.session.accountId]);
    } catch(error) {
        return next(error);
    }

    res.status(200).send('File was sucessfully uploaded.');
})


module.exports = router;
