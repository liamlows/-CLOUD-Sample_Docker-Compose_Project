// For Dynamic Routes
const express = require('express');
const router = express.Router();
const pool = require('./db');

const knex = require('./knex');

const EXCLUDED_TABLES = ["account", ];

function isTableExcluded(tableName) {
    return EXCLUDED_TABLES.includes(tableName);
}

// DEFAULT KEYS FOR THE TABLES
const key = {
    'school': ['school_id'],
    'account': ['account_id'],
    'course_metadata': ['course_meta_id'],
    'courses': ['course_id'],
    'roles': ['role_id'],
    'accounts': ['account_id'],
    'friendships':['friend_a', 'friend_b'],
    'friend_requests':['requester_id', 'requested_id'],
    'announcements': ['announcement_id'],
    'enrollments': ['account_id', 'course_id'],
    'waitlists': ['account_id', 'course_id']
  };
  
  // DEFAULT VALS TO CHANGE FOR THE TABLES

// Processing the JSON object
let joinKeys = function(object, type) {
    // result of the joined keys
    let result = ["", ""];
  
    // returns the array of keys and array of values given a json object
    let [k, v] = getKeyValues(object);
  
    // loop through and push the key value pairs to the string with correct formatting
    for (let i = 0; i < k.length; i++) {
      if (k[i] == 'token') {
        continue;
      }
      if (type == 'get') {
        result[0] = result[0].concat(k[i]).concat('=').concat(v[i]);
        if (i < k.length-1)
          result[0] = result[0].concat(' AND ');
      }
      else if (type == 'post') {
        result[0] = result[0].concat(k[i])
        result[1] = result[1].concat(v[i])
        if (i < k.length-1) {
          result[0] = result[0].concat(',');
          result[1] = result[1].concat(',');
        }
      }
      else if (type == 'put') {
        result[0] = result[0].concat(k[i]).concat('=').concat(v[i]);
        if (i < k.length-1)
          result[0] = result[0].concat(',');
      }
      else if (type == 'delete') {
        result[0] = result[0].concat(k[i]).concat('=').concat(v[i]);
        if (i < k.length-1)
          result[0] = result[0].concat(' AND ');
      }
    }
    return result;
}
  
let getKeyValues = function(object) {
    // get the json key-value pairs and assign it to a variable
    const keys = Object.keys(object);

    // initialization of the key and value lists
    let keyList = [];
    let valueList = [];

    // push all of the keys and values to their lists with correct formatting
    for (let i = 0; i < keys.length; i++) {
        keyList[i] = keys[i];
        valueList[i] = '\''.concat(object[keys[i]]).concat('\'');
    }
    return [keyList, valueList];
}

exports.get = async function(req, res) {
    // get the params from the link
    let table = req.params.table;

    if(isTableExcluded(table)) {
        res.status(403).send();
        return;
    }
    
    let variable = req.params.variable;
    let value = req.params.value;
  
    // get the key-value pairs from the body
    let result = joinKeys(req.body, 'get');
  
    // set the initial query
    let query = 'SELECT * FROM '.concat(table);
  
    // explicit table, explicit variable, and explicit value
    if (value != null)
      query = query.concat(' WHERE ').concat(variable).concat(' = \'').concat(value).concat('\'');
  
    // explicit table, implicit default variable, and explicit value
    else if (variable != null)
      query = query.concat(' WHERE ').concat(key[table][0]).concat(' = \'').concat(variable).concat('\'');
  
    // explicit table, variable and value gotten from body
    else if (table != null)
      if (result[0].length > 0) { query = query.concat(' WHERE ').concat(result[0]); }
  
    // send the query
    let rows, fields;
    [rows, fields] = await pool.execute(query);
    res.json(rows).send();
  };


exports.post = async function(req, res) {
    // get the params from the link
    let table = req.params.table;

    if(isTableExcluded(table)) {
        res.status(403).send();
        return;
    }

    // get the key-value pairs from the body
    let result = joinKeys(req.body, 'post');

    // set the initial query
    let query = 'INSERT INTO '.concat(table).concat(' (').concat(result[0]).concat(') VALUES (').concat(result[1]).concat(')');

    // send the query
    let rows, fields;
    [rows, fields] = await pool.execute(query);
    res.json(rows).send();
}

exports.put = async function(req, res) {
    // get the params from the link
    let table = req.params.table;

    if(isTableExcluded(table)) {
        res.status(403).send();
        return;
    }
    
    let variable = req.params.variable;
    let value = req.params.value;

    // get the key-value pairs from the body
    let result = joinKeys(req.body, 'put');

    // set the initial query
    let query = 'UPDATE '.concat(table).concat(' SET ').concat(result[0]);

    // check for the params
    if (value != null)
        query = query.concat(' WHERE ').concat(variable).concat(' = ').concat(value);
    else
        query = query.concat(' WHERE ').concat(key[table][0]).concat(' = ').concat(variable);

    // send the query
    let rows, fields;
    [rows, fields] = await pool.execute(query);
    res.json(rows).send();
}

exports.delete = async function(req, res) {
    // get the params from the link
    let table = req.params.table;

    if(isTableExcluded(table)) {
        res.status(403).send();
        return;
    }

    let variable = req.params.variable;
    let value = req.params.value;
  
    // get the key-value pairs from the body
    let result = joinKeys(req.body, 'delete');
  
    // set the initial query
    let query = 'DELETE FROM '.concat(table).concat(' WHERE ')
  
    // check for the params
    if (value != null)
      query = query.concat(variable).concat(' = ').concat(value);
    else if (variable != null)
      query = query.concat(key[table][0]).concat(' = ').concat(variable);
    else if (result[0].length > 0)
      query = query.concat(result[0]);
  
    // send the query
    let rows, fields;
    [rows, fields] = await pool.execute(query);
    res.json(rows).send();
  }

  exports.resetCourses = async (req, res) => {
    const resetCourse = knex('courses').truncate()
    const resetCourseResult = await resetCourse

    const resetMeta = knex('course_metadata').truncate()
    const resetMetaResult = await resetMeta

    const resetSchools = knex('schools').truncate()
    const resetSchoolsResult = await resetSchools
  }

  exports.populateCourses = async (req, res) => {

    const resetSerialSchools = knex.schema.raw('ALTER TABLE schools AUTO_INCREMENT = 1')
    const resetResultSchools = await resetSerialSchools;
    schools = [
      {school_name: 'Southern Methodist University', 
        school_location: 'Dallas, TX', 
        school_logo_url: 'https://www.smu.edu/-/media/Site/DevelopmentExternalAffairs/MarketingCommunications/Logos/athletics/SMUwPony,-d-,RwB,-d-,outline,-d-,WebOnly,-d-,rgb.png?la=en'
      },
      {school_name: 'Harvard University', 
        school_location: 'Boston, MA', 
        school_logo_url: 'https://logos-world.net/wp-content/uploads/2020/12/Harvard-Logo.png'
      },
      {school_name: 'Oxford University', 
        school_location: 'London, UK', 
        school_logo_url: 'http://assets.stickpng.com/images/5842f8afa6515b1e0ad75b2b.png'
      }
    ]
    const schoolQuery = knex('schools').insert(schools);
    const schoolResult = await schoolQuery;

    const resetSerialMeta= knex.schema.raw('ALTER TABLE course_metadata AUTO_INCREMENT = 1')
    const resetResultMeta = await resetSerialMeta;
    metaData = [
      {school_id: 1, 
        course_name: 'Database 1', 
        department: 'Computer Science',
        description: 'Make some cool DBs and stuff!'
      },
      {school_id: 1, 
        course_name: 'GUI 1', 
        department: 'Computer Science',
        description: 'Make some cool GUIs and stuff!'
      },
      {school_id: 1, 
        course_name: 'Biology 101', 
        department: 'Science',
        description: 'Learn about cells and other bio!'
      },
      {school_id: 2, 
        course_name: 'Database 1', 
        department: 'Computer Science',
        description: 'Make some cool DB (but from Harvard)!'
      },
      {school_id: 2, 
        course_name: 'Linear Algebra', 
        department: 'Math',
        description: 'Prepare to cry!'
      },
      {school_id: 3, 
        course_name: 'GUI 1', 
        department: 'Computer Science',
        description: 'Make some cool GUIs - in LONDON!'
      },
      {school_id: 3, 
        course_name: 'Tea Drinking 101', 
        department: 'Social Studies',
        description: 'Yummy scrumptious!'
      }
    ]

    const metadataQuery = knex('course_metadata').insert(metaData);
    const metadataResult = await metadataQuery;

    const resetSerialCourse= knex.schema.raw('ALTER TABLE courses AUTO_INCREMENT = 1')
    const resetResultCourse = await resetSerialCourse;
    courses = [
      {course_meta_id: 1,
        max_seats: 35,
        start_date: '2022-05-3',
        end_date: '2022-12-20',
        canceled: false
      },
      {course_meta_id: 2,
        max_seats: 55,
        start_date: '2022-05-3',
        end_date: '2022-12-20',
        canceled: false
      },
      {course_meta_id: 3,
        max_seats: 35,
        start_date: '2022-05-3',
        end_date: '2022-12-20',
        canceled: false
      },
      {course_meta_id: 4,
        max_seats: 20,
        start_date: '2022-05-4',
        end_date: '2022-12-20',
        canceled: false
      },
      {course_meta_id: 5,
        max_seats: 15,
        start_date: '2022-05-4',
        end_date: '2022-12-20',
        canceled: false
      },
      {course_meta_id: 6,
        max_seats: 100,
        start_date: '2022-05-5',
        end_date: '2022-12-20',
        canceled: false
      },
      {course_meta_id: 7,
        max_seats: 30,
        start_date: '2022-05-3',
        end_date: '2022-12-20',
        canceled: false
      }
    ]

    const courseQuery = knex('courses').insert(courses);
    const courseResult = await courseQuery;
    return courseResult;
  }

  exports.resetAccounts = async(req, res) => {
    const resetRoles = knex('roles').truncate()
    const resetRolesResult = await resetRoles

    const resetAcc = knex('accounts').truncate()
    const resetAccResult = await resetAcc
  }

  exports.populateAccounts = async (req, res) => {
    roles = [
      {
        'role_type': 'student',
        'course_id': 1,
        'school_id': 1
      },
      {
        'role_type': 'ta',
        'course_id': 1,
        'school_id': 1
      },
      {
        'role_type': 'professor',
        'course_id': 1,
        'school_id': 1
      },
      {
        'role_type': 'admin',
        'course_id': 1,
        'school_id': 1
      },
      {
        'role_type': 'student',
        'course_id': 2,
        'school_id': 1
      },
      {
        'role_type': 'ta',
        'course_id': 2,
        'school_id': 1
      },
      {
        'role_type': 'professor',
        'course_id': 2,
        'school_id': 1
      },
      {
        'role_type': 'admin',
        'course_id': 2,
        'school_id': 1
      },
      {
        'role_type': 'student',
        'course_id': 3,
        'school_id': 1
      },
      {
        'role_type': 'ta',
        'course_id': 3,
        'school_id': 1
      },
      {
        'role_type': 'professor',
        'course_id': 3,
        'school_id': 1
      },
      {
        'role_type': 'admin',
        'course_id': 3,
        'school_id': 1
      }
    ]
    const roleQuery = knex('roles').insert(roles);
    const roleQueryResults = await roleQuery;

    accounts = generateAccounts(10);
    const query = knex('accounts').insert(accounts);
    const results = await query;
    
  }


  // ************ DATA GENERATION FUNCTIONS ***************
  function makeRandom(length){
    var result = "";
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

function generateAccounts(amount){
    values = []
    for(var i = 0; i < amount; i++){
        dict = {}
        userName = makeRandom(5)
        password = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
        firstName = makeRandom(5)
        lastName = makeRandom(5)
        email = makeRandom(5) + '@' + makeRandom(3) + '.com'
        school_id = getRandomInt(3) + 1
        role_id = getRandomInt(3) + 1

        dict['username'] = userName
        dict['password'] = password
        dict['first_name'] = firstName
        dict['last_name'] = lastName
        dict['school_id'] = Math.random
        dict['email'] = email
        dict['school_id'] = school_id
        dict['role_id'] = role_id

        values.push(dict)
    }
    return values
}