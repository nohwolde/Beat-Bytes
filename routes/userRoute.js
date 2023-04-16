const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

router.route("/login_or_create").post((req, res) => {
  User.findOne({ userID: req.body.userID }, (err, user) => {
    if (user == null) {
      let newUser = new User(req.body);
      newUser.save((err, savedUser) => {
        if (err) {
          console.log(err);
          return res.sendStatus(500);
        } else {
          req.session.user = savedUser;
          return res.json(savedUser);
        }
      });
    } else {
      req.session.user = user;
      return res.json(user);
    }
  });
  // const userID = req.body.userID;
  // const playlists = req.body.playlists;
  // const profilePhoto = req.body.profilePhoto;
  // const newUser = new User({ userID, playlists, profilePhoto });
  // newUser.save();
});

router.route("/getUser").post((req, res) => {
  User.findOne({ userID: req.body.userID }).then((user) => res.json(user));
});

router.route("/getPlaylists").post((req, res) => {
  User.findOne({ userID: req.body.userID }, {}).then((user) =>
    res.json(user.playlists)
  );
});

module.exports = router;
