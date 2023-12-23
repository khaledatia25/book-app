const express = require("express");
const userController = require("../controller/userController");
const router = express.Router();

router.get("/users", userController.getUserList);
router.post("/users/save", userController.saveUser);

module.exports = router;
