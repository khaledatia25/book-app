const queries = require("../db/quiries");
const dbConnection = require("../db/connection");
const util = require("../util/utility");
const Logger = require("../services/loggerService");
const auditService = require("../audit/auditService");
const validationUtil = require("../util/validation");
const auditAction = require("../audit/auditActions");
const jwtUtil = require("../util/jwtUtil");
const bcrypt = require("bcryptjs");
const logger = new Logger("loginController");
exports.getUserProfile = async (req, res) => {
  try {
    const user = req.user;
    // const UserListQuery = queries.queryList.GET_USER_LIST_QUERY;
    // const result = await dbConnection.query(UserListQuery);
    // logger.info("return user list", result.rows);
    // auditService.prepareAduit(
    //   auditAction.auditAction.GET_USER_LIST,
    //   result.rows,
    //   null,
    //   "postman",
    //   util.dateFormat()
    // );
    return res.status(200).send(JSON.stringify(user));
  } catch (e) {
    console.log(e);

    return res.status(500).send({ error: "Failed to get user" });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    // validate that username, password not empty
    if (!username || !password) {
      return res
        .status(500)
        .send({ error: "username and password cannot be empty" });
    }

    // get user by username
    const userLoginQuery = queries.queryList.LOGIN_QUERY;
    const result = await dbConnection.query(userLoginQuery, [username]);
    const dbResponse = result.rows[0];
    if (!dbResponse) {
      logger.info(`User: ["${username}] not exists`);
      return res.status(401).send({ error: "Invalid username or password" });
    }

    //compare passwords
    if (!validationUtil.comparePasswords(password, dbResponse.password)) {
      logger.info(`User: ["${username}] used invalid password`);

      return res.status(401).send({ error: "Invalid username or password" });
    }

    // get user roles
    const userRoles = await this.getUserRoles(dbResponse.user_id);

    // generate token
    const token = jwtUtil.generateToken(
      dbResponse.user_id,
      dbResponse.username,
      dbResponse.email,
      dbResponse.full_name,
      userRoles,
      dbResponse.user_type_code
    );
    return res.status(200).send(JSON.stringify(token));
  } catch (e) {
    logger.error(" Failed to login " + JSON.stringify(e));
    return res.status(500).send({ error: "failed to login" });
  }
};

exports.getUserRoles = async (id) => {
  try {
    return res.JSON({ roles: "[user]" });
  } catch (e) {}
};
