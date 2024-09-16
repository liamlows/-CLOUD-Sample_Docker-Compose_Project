const express = require('express');
const router = express.Router();
const pool = require('../db');
const {isUserAuthenticated, getNotificationById, validateBody, getCourseById} = require("../util");

router.use(isUserAuthenticated);


/*
GET /api/notifications/
Gets all notifications for the current user.
 */
router.get("/", async (req, res, next) => {
    let rows, fields;
    try {
        [rows, fields] = await pool.execute('SELECT * FROM notifications WHERE `recipient` = ?',
            [req.session.accountId])
    } catch(error) {
        return next(error);
    }

    res.status(200).json(rows);
});

/*
POST /api/notifications/
Allows a privileged user to post a notification
to everyone in the specified course.
*/
router.post("/", async (req, res, next) => {
    let requiredBody = {
        title: req.body.title,
        body: req.body.body,
        course: req.body.course,
    }

    let maxLengths = {
        title: 500,
        body: 1000,
    };

    let body;
    try{
        body = validateBody(requiredBody, {}, maxLengths);
    } catch(error) {
        res.status(400).json({error: error})
        return;
    }

    let course = await getCourseById(body.course);
    if (course === undefined){
        res.status(400).json({error: "Invalid course"});
        return;
    }

    // Get all the students in the course.
    let enrollments, _;
    try{
        [enrollments, _] = await pool.execute(
            'SELECT account_id FROM enrollments WHERE course_id = ?',
            [req.body.course]);
    } catch (error) {
        return next(error);
    }

    let sender = req.session.accountId;
    let error = undefined;

    await Promise.all(enrollments.map(async enrollment => {
        let recipient = enrollment.account_id;
        try {
            await pool.execute(
                'INSERT INTO notifications(sender, recipient, title, body, course) VALUES (?, ?, ?, ?, ?)',
                [sender, recipient, body.title, body.body, body.course]
            );
        } catch(e) {
            error = e;
        }
    }));

    if(error){
        return next(error);
    }

    res.status(200).json({num_recipients: enrollments.length});


})

/*
DELETE /api/notifications/:notification_id
*/
router.delete("/:notification_id", async (req, res, next) => {
    try{
        await pool.execute('DELETE FROM `notifications` WHERE `recipient` = ? AND `notification_id` = ?',
            [req.session.accountId, req.params.notification_id]);
    } catch(error){
        return next(error);
    }
    res.status(200).send();
});


module.exports = router;
