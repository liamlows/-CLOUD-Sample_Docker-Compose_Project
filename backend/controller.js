// For Dynamic Routes
const express = require('express');
const router = express.Router();
const pool = require('./db');

const EXCLUDED_TABLES = ["account", ];


function isTableExcluded(tableName) {
    return EXCLUDED_TABLES.includes(tableName);
}

// DEFAULT KEYS FOR THE TABLES
const key = {
    'school': ['school_id'],
    'account': ['account_id']
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