const express = require('express');
const router = express.Router();
const pool = require('../db');

const {getSchoolById, validateBody} = require('../util');
const {log} = require("@rama41222/node-logger");

const logger = log({ console: true, file: false, label: "schools api" });

// GET /schools/
// Gets all schools in the database.
router.get("/", async (req, res, next) => {
    let rows, fields;
    try{
        [rows, fields] = await pool.execute('SELECT * FROM `schools`');
    } catch(error){
        return next(error);
    }

    res.status(200).json(rows).send();
});

// POST /schools/
// Adds a new school to the database. Requires an admin role.
router.post("/", async (req, res, next) => {
    let requiredBody = {
        schoolName: req.body.schoolName,
    };

    let optionalBody = {
        schoolLocation: req.body.schoolLocation,
        schoolLogoUrl: req.body.schoolLogoUrl,
    };

    let maxLengths = {
        schoolName: 255,
        schoolLocation: 255,
        schoolLogoUrl: 511,
    };

    let body;
    try{
        body = validateBody(requiredBody, optionalBody, maxLengths);
    } catch(error) {
        res.status(400).json({error: error});
        return;
    }

    let [result, _] = await pool.execute('INSERT INTO `schools`(school_name, school_location, school_logo_url) VALUES (?, ?, ?)',
        [body.schoolName, body.schoolLocation, body.schoolLogoUrl]);

    res.status(200).json({schoolId: result.insertId});

});


// GET /schools/:id
// Gets a school by ID.
router.get("/:id", async (req, res, next) => {
   let school = await getSchoolById(req.params.id);

    if(school !== undefined){
        res.status(200).json(school);
    }
    else{
        res.status(404).send();
    }
});

// PUT /schools/:id
// Updates an existing school in the database. Requires an admin role.
router.put("/:id", async (req, res, next) => {
    let optionalBody = {
        schoolName: req.body.schoolName,
        schoolLocation: req.body.schoolLocation,
        schoolLogoUrl: req.body.schoolLogoUrl,
    };

    let maxLengths = {
        schoolName: 255,
        schoolLocation: 255,
        schoolLogoUrl: 511,
    };

    let body;
    try{
        body = validateBody({}, optionalBody, maxLengths);
    } catch(error) {
        res.status(400).json({error: error});
        return;
    }

    await pool.execute(
        'UPDATE `schools` SET `school_name` = ?, `school_location` = ?, `school_logo_url` = ? WHERE `school_id` = ?',
        [body.schoolName, body.schoolLocation, body.schoolLogoUrl, req.params.id]);

    res.status(200).json();
});

module.exports = router;