const express = require('express');
const router = express.Router();
const pool = require('../db');
const {isUserAuthenticated, isUserAdmin, getSchoolById, validateBody,
    parseWeekFlags, validateDates, validateTimes, getCourseById, getCourseMetadataById
} = require("../util");
const {log} = require("@rama41222/node-logger");

router.use(isUserAuthenticated);

/*
TODO:
    DELETE /api/courses/:course_id
*/

/*
GET /api/courses/
    Gets all courses.
 */
router.get("/", async (req, res, next) => {
    let rows, fields;
    try{
        [rows, fields] = await pool.execute(
            'SELECT * FROM `courses` LEFT JOIN `course_metadata` ON `courses`.course_meta_id = `course_metadata`.course_meta_id');
    } catch(error){
        return next(error);
    }

    rows.forEach(parseWeekFlags);
    res.status(200).json(rows);
});

/*
GET /api/courses/:course-id
    Gets a course by ID, includes metadata
*/
router.get("/:course_id", async (req, res, next) => {
    let courseId = req.params.course_id;
    let course = await getCourseById(courseId);

    if(course === undefined){
        res.status(404).json("Course not found");
        return;
    }
    parseWeekFlags(course);

    let metadata = await getCourseMetadataById(course.course_meta_id);
    if(metadata === undefined) {
        res.status(500).json("Could not find metadata.");
    }

    course = {...course, ...metadata};

    let role_users, _, enrollments;

    [role_users, _] = await pool.execute(
        "SELECT first_name, last_name, role_type, account_id FROM `accounts` LEFT JOIN `roles` ON `roles`.role_id = `accounts`.role_id WHERE `roles`.course_id = ?",
        [courseId]);

    [enrollments, _] = await pool.execute(
        "SELECT * FROM `enrollments` WHERE `enrollments`.course_id = ?",
        [courseId]
    );

    course.tas = role_users.filter(user => user.role_type === "ta");
    course.professors = role_users.filter(user => user.role_type === "professor");
    course.num_enrollments = enrollments.length;

    res.status(200).json(course);
});

/*
POST /api/courses/
    Adds a new course. Requires an admin/professor role.
*/
router.post("/", async (req, res, next) => {
    let requiredBody = {
        metadataId: req.body.metadataId,
        maxSeats: req.body.maxSeats,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        weekFlags: req.body.weekFlags,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
    };

    let optionalBody = {
        cancelled: false,
    };

    let maxLengths = {};

    let body;
    try{
        body = validateBody(requiredBody, optionalBody, maxLengths);
        validateDates({
            startDate: body.startDate, endDate: body.endDate});
        validateTimes({
            startTime: body.startTime, endTime: body.endTime});
    } catch(error) {
        res.status(400).json({error: error});
        return;
    }

    let [result, _] = await pool.execute('INSERT INTO `courses`(school_id, course_name, department, description) VALUES (?, ?, ?, ?)');

    res.status(200).json({courseId: result.insertId});
});


module.exports = router;