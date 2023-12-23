const express = require("express");
const loginController = require("../controller/loginController");
const router = express.Router();
const jwtUtill = require("../util/jwtUtil");

router.post("/login/signin", loginController.signIn);
router.get(
  "/login/profile/:userId",
  jwtUtill.verifyToken(["user"]),
  loginController.getUserProfile
);

module.exports = router;
