knex = require("../db/knex");
const bcrypt = require("bcrypt");

const USER_TABLE = "User";

const createNewUser = async (username, password) => {
    const hashedPassword = bcrypt.hashSync(password, 10);

    const query = knex(USER_TABLE).insert({username, password: hashedPassword});
    const result = await query;

    return result;
};

const findUserByUsername = async (username) => {
    const query = knex(USER_TABLE).where({username});
    const result = await query;
    return result;
};

const authenticateUser = async (username, password) => {
    const users = await findUserByUsername(username);
    if (users.length === 0) {
        console.error(`No users matched the username ${username}`);
        return false;
    }
    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    return validPassword;
};

module.exports = {
    createNewUser,
    findUserByUsername,
    authenticateUser
};