const express = require('express');
const router = express.Router();
const pool = require('../db');
const {isUserAuthenticated, getAccountById, getCourseById} = require("../util");

router.use(isUserAuthenticated);


/*
GET /api/waitlist/:course-id/
    Gets all students in the wait list for the specified course ID.
*/
router.get("/:course_id", async (req, res, next) => {
    let rows, fields;
    try{
        [rows, fields] = await pool.execute('SELECT * FROM `waitlists` WHERE course_id = ? ORDER BY timestamp',
            [req.params.course_id]);
    } catch(error){
        return next(error);
    }

    res.status(200).json(rows);
});



/*
POST /api/waitlist/:course-id/
    Adds the specified account to the wait list for the specified course ID.
*/

router.post("/:course_id", async (req, res, next) => {
    let course = await getCourseById(req.params.course_id);
    if(course === undefined) {
        res.status(404).json("Invalid courseId");
        return;
    }

    let accountId = req.body.accountId;
    if(accountId === undefined) {
        res.status(400).json("Missing accountId");
        return;
    }

    let account = await getAccountById(accountId);

    if(account === undefined) {
        res.status(400).json("Invalid accountId");
        return;
    }

    let rows, fields;
    try{
        [rows, fields]  = await pool.execute("INSERT INTO `waitlists`(account_id, course_id) VALUES (?, ?)",
            [accountId, req.params.course_id]);
    } catch(error){
        return next(error);
    }

    res.status(200).json(rows);
});

/*
DELETE /api/waitlist/:course-id/:account-id/
 */

router.delete("/:course_id/:account_id", async (req, res, next) => {
    try{
        await pool.execute(
            "DELETE FROM `waitlists` WHERE `course_id` = ? AND `account_id` = ?",
            [req.params.course_id, req.params.account_id]);
    } catch(error) {
        return next(error);
    }

    res.status(200).json();
});

module.exports = router;

