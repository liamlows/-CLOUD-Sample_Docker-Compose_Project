const express = require('express');
const router = express.Router();
const pool = require('../db');

/* TODO:

GET /roles/
    Gets all course roles.

POST /roles/
    Adds a new course role.

GET /roles/:role-id/
    Gets the role with the specified role ID.

GET /roles/:role-id/users/
    Gets all accounts with the specified role ID.

 */

module.exports = router;
