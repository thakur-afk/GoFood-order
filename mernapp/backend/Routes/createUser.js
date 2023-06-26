const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { json } = require("react-router-dom");

router.post(
  "/createuser",
  [
    body("email").isEmail(),
    body("name").isLength({ min: 5 }),
    body("password", "incorecrt password").isLength({ min: 5 }),
  ],

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const setpassword = bcrypt.hashSync(req.body.password, salt);

    try {
      await User.create({
        name: req.body.name,
        password: setpassword,
        email: req.body.email,
        location: req.body.location,
      });
      res.json({ success: true });
    } catch (error) {
      console.log(error);
    }
  }
);

router.post(
  "/loginuser",
  [
    body("email").isEmail(),
    body("password", "incorecrt password").isLength({ min: 5 }),
  ],

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let email = req.body.email;

    try {
      let userData = await User.findOne({ email });

      if (!userData) {
        return res.status(400).json({ errors: "try correct credentials" });
      }

      const validpasscheck = bcrypt.compareSync(
        req.body.password,
        userData.password
      );
      if (!validpasscheck) {
        return res.status(400).json({ errors: "wrong password" });
      }

      let token = jwt.sign(
        { user: { id: userData.id } },
        "secretkeyappearshere"
      );

      return res.status(200).json({
        success: true,
        authToken: token,
      });
    } catch (error) {
      console.log(error);

      res.json({ success: false });
    }
  }
);
module.exports = router;
