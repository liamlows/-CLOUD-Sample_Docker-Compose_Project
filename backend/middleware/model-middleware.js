
const connectToDatabase = require('../models/database-helpers.js');
const User = require('../models/users');
const Bid = require('../models/bid');
const Contract = require('../models/contract');
const Land = require('../models/land');
const Review = require('../models/review');

/**
 * This middleware function is meant to be registered BEFORE the route handlers (see index.js)
 * This sets up a connection to the database. We modify the request object by tacking on the
 * models and disconnect function. Any FUTURE middleware / route handler thus has access to
 * those models / disconnect function by virtue of the fact that the request object is the same
 * one through the whole chain
 */
const createModelsMiddleware = async (req, res, next) => {
    console.log('Creating models in middleware');
    const { DBQuery, disconnect } = await connectToDatabase();
    req.models = {

        bid: new Bid(DBQuery, disconnect),
        contract: new Contract(DBQuery, disconnect),
        land: new Land(DBQuery, disconnect),
        review: new Review(DBQuery, disconnect),
        user: new User(DBQuery, disconnect)

    }
    req.disconnect = disconnect;
    next();
}

const disconnectFromDatababaseMiddleware = (req, res, next) => {
    console.log('Disconnecting from the database');
    req.disconnect();
    next();
}

const disconnectFromDatababaseMiddleware = (req, res, next) => {
    console.log('Disconnecting from the database');
    req.disconnect();
    next();
}

module.exports = {
    createModelsMiddleware,
    disconnectFromDatababaseMiddleware
}