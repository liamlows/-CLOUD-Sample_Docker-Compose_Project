const pool = require("./db");

const STUDENT_ROLE_TYPE = 'student';
const TA_ROLE_TYPE = 'ta';
const PROFESSOR_ROLE_TYPE = 'professor';
const ADMIN_ROLE_TYPE = 'admin';

exports.STUDENT_ROLE_TYPE = STUDENT_ROLE_TYPE;
exports.TA_ROLE_TYPE = TA_ROLE_TYPE;
exports.PROFESSOR_ROLE_TYPE = PROFESSOR_ROLE_TYPE;
exports.ADMIN_ROLE_TYPE = ADMIN_ROLE_TYPE;


async function isUserAuthenticated(req, res, next){
    if(req.session.username){
        return next();
    }
    else{
        res.sendStatus(401);
    }
}

async function isUserAdmin(req, res, next) {
    if(req.session.roleType === "admin") {
        return next();
    }
    else {
        res.sendStatus(403);
    }
}


async function getById(tableName, keyName, key) {
    let rows, fields;
    try{
        [rows, fields] = await pool.execute(`SELECT * FROM ${tableName} WHERE ${keyName} = ? LIMIT 1`, [key]);
    } catch(error){
        return undefined;
    }

    if(rows.length === 0)
        return undefined;

    return rows[0];
}

exports.getSchoolById = async (schoolId) => getById("schools", "school_id", schoolId);
exports.getCourseMetadataById = async (metadataId) => getById("course_metadata", "course_meta_id", metadataId);
exports.getCourseById = async (courseId) => getById("courses", "course_id", courseId);
exports.getAccountById = async (accountId) => getById("accounts", "account_id", accountId);
exports.getNotificationById = async (notificationId) => getById("notifications", "notification_id", notificationId);
exports.getRoleById = async (roleId) => getById("roles", "role_id", roleId);


exports.isUserAuthenticated = isUserAuthenticated;
exports.isUserAdmin = isUserAdmin;


exports.getUsernameFromId = async (accountId) => {
    try {
        let [rows, fields] = await pool.execute(
            'SELECT username FROM `accounts` WHERE account_id = ? LIMIT 1', [accountId]);

        if(rows.length) {
            return rows[0].username;
        }
        else {
            return undefined;
        }

    } catch(error) {
        return undefined;
    }
}


exports.validateBody = (requiredBody, optionalBody={}, maxLengths={}) => {
    for (const property in requiredBody) {
        console.log(property + "  " + requiredBody[property]);
        if(requiredBody[property] === undefined){
            throw `Missing ${property} in request.`;
        }
    }

    for (const property in optionalBody) {
        if(optionalBody[property] === undefined) {
            if(property in maxLengths){
                optionalBody[property] = "";
            }
            else {
                optionalBody[property] = null;
            }
        }
    }


    let body = {
        ...requiredBody,
        ...optionalBody
    };

    for(const property in body) {
        if(maxLengths[property] === undefined)
            continue;

        if(typeof body[property] !== "string"){
            throw `Field ${property} must be a string.`;
        }

        if(body[property].length >= maxLengths[property]){
            throw `Field ${property} is too long. Must be less than ${maxLengths[property]} characters.`;
        }
    }

    return body;
};


// bit 0: MON
// ....
// bit 8: REMOTE
const DAYS = ["MON", "TUES", "WED", "THR", "FRI", "SAT", "SUN", "REMOTE"];

exports.parseWeekFlags = (course) => {
    course.days = [];

    for(let i = 0; i < DAYS.length; i++){
        // check each bit
        if(course.week_flags & (1 << i)){
            course.days.push(DAYS[i]);
        }
    }
}

const dateRegex = /[0-9]{4}-[0-9]{2}-[0-9]{2}( [0-9]{2}:[0-9]{2}:([0-9]{2})?)?/
const timeRegex = /([0-9]{2}):([0-9]{2}):([0-9]{2})?/

exports.validateDates = (dates) => {
    for(const property in dates) {
        if(!dates[property].match(dateRegex))
            throw `Field ${property} is not valid datetime string.`;
    }
}

exports.validateTimes = (times) => {
    for(const property in times) {
        if(!times[property].match(timeRegex))
            throw `Field ${property} is not valid time string.`;
    }
}
