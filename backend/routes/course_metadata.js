const express = require('express');
const router = express.Router();
const pool = require('../db');
const {isUserAuthenticated, isUserAdmin, getSchoolById, validateBody,
    parseWeekFlags, validateDates, validateTimes, getCourseById} = require("../util");
const {log} = require("@rama41222/node-logger");

router.use(isUserAuthenticated);

/* TODO: Implement the following
PUT /courses/metadata/
    Updates an existing course metadata entry. Requires an admin/professor role.

 */

/*
GET  /api/course-metadata/
 */
router.get("/", async (req, res, next) => {
    let rows, fields;
    try{
        [rows, fields] = await pool.execute('SELECT * FROM `course_metadata`');
    } catch(error){
        return next(error);
    }
    res.status(200).json(rows);
});

/*
POST /api/course-metadata/
    Adds a new course metadata entry. Requires an admin/professor role.
 */
router.post("/", async (req, res, next) => {
    let requiredBody = {
        schoolId: req.body.schoolId,
        courseName: req.body.courseName,
        department: req.body.department,
        description: req.body.description,
    };

    let maxLengths = {
        courseName: 255,
        department: 255,
        description: 1000,
    };

    let optionalBody = {
        // professorId: req.body.professorId,
    };

    let body;
    try{
        body = validateBody(requiredBody, optionalBody, maxLengths);
    } catch(error) {
        res.status(400).json({error: error});
        return;
    }

    let school = await getSchoolById(body.schoolId);

    if(school === undefined){
        res.status(400).json({error: "Invalid school Id"});
        return;
    }

    let [result, _] = await pool.execute('INSERT INTO `course_metadata`(school_id, course_name, department, description) VALUES (?, ?, ?, ?)');

    res.status(200).json({metadataId: result.insertId});
});


module.exports = router;