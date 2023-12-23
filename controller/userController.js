const queries = require("../db/quiries");
const dbConnection = require("../db/connection");
const util = require("../util/utility");
const Logger = require("../services/loggerService");
const auditService = require("../audit/auditService");
const auditAction = require("../audit/auditActions");
const bcrypt = require("bcryptjs");
const logger = new Logger("userController");

exports.getUserList = async (req, res) => {
  try {
    const UserListQuery = queries.queryList.GET_USER_LIST_QUERY;
    const result = await dbConnection.query(UserListQuery);
    logger.info("return user list", result.rows);
    auditService.prepareAduit(
      auditAction.auditAction.GET_USER_LIST,
      result.rows,
      null,
      "postman",
      util.dateFormat()
    );
    return res.status(200).send(JSON.stringify(result.rows));
  } catch (e) {
    console.log(e);
    auditService.prepareAduit(
      auditAction.auditAction.GET_BOOK_LIST,
      null,
      JSON.stringify({ e }),
      "postman",
      util.dateFormat()
    );
    return res.status(500).send({ error: "Failed to list Users" });
  }
};

exports.saveUser = async (req, res) => {
  try {
    const createdBy = "admin";
    const createdOn = new Date();

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const fullname = req.body.fullname;
    const userTypeCode = req.body.userTypeCode;

    if (!username || !password || !email || !userTypeCode || !fullname) {
      return res.status(500).send({
        error:
          "username, password, email, user type, and fullname must be provided",
      });
    }
    const isUserExistQuery = queries.queryList.IS_USER_EXIST_QUERY;
    const result = await dbConnection.query(isUserExistQuery, [
      username,
      email,
    ]);
    if (result.rows[0].count !== 0) {
      return res.status(500).send({
        error: "User alread exist",
      });
    }
    /* validation */
    // valid email
    // username and email not exitst
    // validate password strength

    const hashedPassword = await bcrypt.hash(password, 10);
    const values = [
      username,
      hashedPassword,
      email,
      userTypeCode,
      fullname,
      createdOn,
      createdBy,
    ];
    const saveUserQuery = queries.queryList.SAVE_USER_QUERY;
    await dbConnection.query(saveUserQuery, values);
    return res.status(201).send("User Added Successfully.");
  } catch (e) {
    console.log(e);
    return res.status(500).send({ error: "Failed to Add User" });
  }
};
