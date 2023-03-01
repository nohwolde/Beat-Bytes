import express from "express";
import cors from "cors";
import morgan from "morgan";
import axios from "axios";
import mongoose from "mongoose";

var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
class SoundCloudScraper {
  constructor() {
    this.getHtmlFromUrl = (url) =>
      __awaiter(this, void 0, void 0, function* () {
        const response = yield axios(url);
        return response.data;
      });
  }
}

const app = express();

app.use(
  cors({
    allowedHeaders: "*",
    allowMethods: "*",
    origin: "*",
    accessControlAllowOrigin: "*",
  }),
  morgan("dev")
);
app.use(express.json());

const mongoURI =
  "mongodb+srv://nohwolde:Injeralord01@cluster0.yo2uwa5.mongodb.net/test";
// Connect to MongoDB
mongoose.connect(mongoURI);

const mongoDB = mongoose.connection;

mongoDB.on("connected", function () {
  console.log("mongoose connected to " + mongoURI);
});

mongoDB.on("disconnected", function () {
  console.log("mongoose disconnected ");
});

const Schema = mongoose.Schema;

const userSchema = Schema({
  userID: { type: String, required: true, unique: true },
  playlists: { type: Array },
  profilePhoto: { type: String, required: true },
});

const User = mongoDB.model("users", userSchema);

app.post("/db/user/login_or_create", (req, res) => {
  User.findOne({ userID: req.body.userID }, (err, user) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    if (user == null) {
      let newUser = new User(req.body);
      newUser.save();
      res.json(newUser);
      console.log(newUser);
    } else {
      res.json(user);
      console.log(user);
    }
  });
});

app.get("/db/user/addToPlaylist", (req, res) => {
  User.findOne({ userID: req.body.userID }).then((user) => {
    res.json(user);
    console.log(user);
  });
});

app.get("/db/user/getPlaylists", (req, res) => {
  User.findOne({ userID: req.body.userID }, {}).then((user) =>
    res.json(user.playlists)
  );
});

const soundScrape = new SoundCloudScraper();
app.get("/*", async function (req, res) {
  if (req.url.startsWith("/db")) {
    User.findOne({ userID: req.body.userID }, (err, user) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      }
      if (user == null) {
        let newUser = new User(req.body);
        newUser.save();
        res.json(newUser);
        console.log(newUser);
      } else {
        res.json(user);
        console.log(user);
      }
    });
  }
  const results = await soundScrape.getHtmlFromUrl(
    `https://soundcloud.com${req.url}`
  );
  res.send(await results);
  console.log(await results);
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
