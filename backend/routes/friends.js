const express = require('express');
const router = express.Router();
const pool = require('../db');
const util = require('../util');


router.use(util.isUserAuthenticated);

async function getFriendsList(accountId){
    let rows, _;
    [rows, _] = await pool.execute(
        'SELECT * FROM `friendships` WHERE `friend_a` = ? OR `friend_b` = ?',
        [accountId, accountId]);

    return rows;
}


async function getFriendRequests(accountId) {
    let incoming, outgoing, _;

    [incoming, _] = await pool.execute(
        'SELECT * FROM friend_requests WHERE `requested_id` = ?', [accountId]
    );

    [outgoing, _] = await pool.execute(
        'SELECT * FROM friend_requests WHERE `requester_id` = ?', [accountId]
    );

    return {
        incoming: incoming,
        outgoing: outgoing
    };
}

async function findRequest(fromId, toId) {
    let [rows, fields] = await pool.execute(
        'SELECT * FROM `friend_requests` WHERE `requester_id` = ? AND `requested_id` = ?', [fromId, toId]);

    console.log(rows);

    if(rows.length === 0){
        return undefined;
    }
    else {
        return rows[0];
    }
}


/*
GET /api/friends/

Returns your friends list. Requires being logged in.
*/
router.get("/", async (req, res, next) => {
    let friends;
    try {
      friends = await getFriendsList(req.session.accountId);
    } catch (error) {
        return next(error);
    }
    res.status(200).json(friends);
});

/*
GET /api/friends/requests/

Returns both incoming and outgoing friend requests.  Requires being logged in.
 */
router.get("/requests/", async (req, res, next) => {
    let requests;
    try {
        requests = await getFriendRequests(req.session.accountId);
    } catch (error) {
        return next(error);
    }
    res.status(200).json(requests);
});

/*
POST /api/friends/requests/

Creates a new friend request if possible. Requires being logged in.
*/
router.post("/requests/", async (req, res, next) => {
    let targetId = req.body.targetId;
    console.log(targetId);
    if(targetId === undefined) {
        console.log("targetId is undefined");
        return res.sendStatus(400);
    }

    // Ensure we cannot friend ourselves.
    if(targetId === req.session.accountId){
        console.log("targetId is the same as user");
        return res.sendStatus(400);
    }

    // Check if we already have an outgoing request.
    let request;

    try {
        request = await findRequest(req.session.accountId, targetId);

        if(request){
            res.status(200).json({success: 0, error: "You already have an outgoing request to this user."})
            return next();
        }

    } catch(error) { return next(error); }

    // Check if we already have an incoming request.
    try {
        request = await findRequest(targetId, req.session.accountId);

        if(request){
            res.status(200).json({success: 0, error: "You already have an incoming request to this user."})
            return next();
        }

    } catch(error) { return next(error); }


    // Insert the new request into the database.
    try {
        await pool.execute('INSERT INTO `friend_requests` (requester_id, requested_id) VALUES (?, ?)',
            [req.session.accountId, targetId]);
    } catch(error) { return next(error); }

    res.status(200).json({
        success: 1, error: ""
    });
});

/*
PUT /api/friends/requests/:otherAccountId

Accepts or denies the friend request, where otherAccountId is the other user that sent the request.
Requires being logged in.

*/
router.put("/requests/:otherId", async (req, res, next) => {
    let otherId = req.params.otherId;
    let accepted = req.body.status;
    if(accepted !== 0 && accepted !== 1) {
        return res.sendStatus(400);
    }

    // Check if the friend request has already been accepted or denied.
    try {
        let friend_request = await findRequest(otherId, req.session.accountId);

        if (!friend_request)
            console.log("friend request does not exist");
        else if(friend_request.status !== -1){
            return res.sendStatus(403);
        }

    } catch (error) {
        return next(error);
    }


    try {
        // Update the request.
        await pool.execute(
            'UPDATE `friend_requests` SET `status` = ? WHERE `requester_id` = ? AND `requested_id` = ?',
            [accepted, otherId, req.session.accountId]);

        if(accepted) {
            // Add them to the friends list.

            let friend_a, friend_b; // Ensure that friend_a < friend_b

            if(req.session.accountId < otherId) {
                friend_a = req.session.accountId;
                friend_b = otherId;
            }
            else {
                friend_a = otherId;
                friend_b = req.session.accountId;
            }

            await pool.execute(
                'INSERT INTO `friendships`(friend_a, friend_b) VALUES (?, ?)', [friend_a, friend_b]
            );

        }

    } catch(error) {
        return next(error);
    }

    res.sendStatus(200);
});

/*
DELETE /api/friends/:friendId
 */
router.delete("/:friendId", async (req, res, next) => {
    let userId = req.session.accountId;
    let friendId = req.params.friendId;

    let friend_a;
    let friend_b;
    if(userId < friendId){
        friend_a = userId;
        friend_b = friendId;
    }
    else {
        friend_a = friendId;
        friend_b = userId;
    }

    try {
        await pool.execute(
            'DELETE FROM `friendships` WHERE (`friend_a` = ? AND `friend_b` = ?)',
            [friend_a, friend_b]);

        let [rows, fields] = await pool.execute(
            'SELECT * FROM friend_requests WHERE (`requested_id` = ? AND `requester_id` = ?) OR (`requested_id` = ? AND `requester_id` = ?) LIMIT 1',
            [userId, friendId, friendId, userId]);

        if(rows.length !== 0){
            // Set the friend request status to rejected.
            let req = rows[0];

            await pool.execute(
                'UPDATE friend_requests SET `status` = 0 WHERE (`requested_id` = ? AND `requester_id` = ?)',
                [req.requested_id, req.requester_id]);
        }

    } catch (error) {
        return next(error);
    }



    res.sendStatus(200);
});


/*
GET /api/friends/status/:friendId
 */
router.get("/status/:friendId", async (req, res, next) => {
    let userId = req.session.accountId;
    let friendId = req.params.friendId;

    let rows, _;
    try{
        [rows, _] = await pool.execute(
            'SELECT * FROM friend_requests WHERE (`requested_id` = ? AND `requester_id` = ?) OR (`requested_id` = ? AND `requester_id` = ?) LIMIT 1',
            [userId, friendId, friendId, userId]);
    } catch(error) {
        return next(error);
    }

    if(rows.length === 0) {
        res.sendStatus(404);
    }
    else {
        res.status(200).json(rows[0]);
    }
});

module.exports = router;