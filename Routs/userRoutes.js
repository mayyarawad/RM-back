const express = require("express");
const {
  signIn,
  register,
  getAllUsers,
} = require("../Controllers/userController");
const router = express.Router();

// User Registration Route
router.post("/signin", signIn);
router.get("/getUsers", getAllUsers);
router.post("/register", register);
// router.post("/AddLounge", AddLounge);s


module.exports = router;
