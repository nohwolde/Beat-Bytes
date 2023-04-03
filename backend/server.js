import express from "express";
import cors from "cors";
import morgan from "morgan";
import axios from "axios";
import mongoose, { Model, Schema } from "mongoose";
import fetch from "node-fetch";
import ytSearch from "youtube-search";
import JSSoup from "jssoup";
import cheerio from "cheerio";
import googleIt from "google-it";

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
app.use(express.static("public"));

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

const userSchema = mongoose.Schema({
  id: { type: String, required: true, unique: true },
  playlists: [
    {
      name: String,
      platform: { type: String, required: true, default: "Beatbytes" },
      id: String,
      images: [{ type: String }],
      owner: { link: String },
      playlist: [
        {
          item: Object,
          platform: String,
          title: { type: String, required: false },
          artist: { type: String, required: false },
          pic: { type: String, required: false },
          link: { type: String, required: false },
          id: { type: String, required: false },
        },
      ],
      description: String,
      uri: String,
    },
  ],
  profilePhoto: { type: String, required: true, default: "" },
});

userSchema.methods.createPlaylist = function (playlist) {
  this.playlists.push({ ...playlist, id: new mongoose.Types.ObjectId() });
  return this.save();
};

userSchema.methods.addToPlaylist = function (playlistID, song) {
  const playlist = this.playlists.find((p) => p.id === playlistID);
  if (playlist) {
    playlist.playlist.push(song);
    return this.save();
  }
};

userSchema.methods.removeFromPlaylist = function (playlistID, songID) {
  const playlist = this.playlists.find((p) => p.id === playlistID);
  if (playlist) {
    playlist.playlist = playlist.playlist.filter(
      (song) => song.item.id !== songID
    );
    return this.save();
  }
};

userSchema.methods.removePlaylist = function (playlistID) {
  this.playlists = this.playlists.filter(
    (playlist) => playlist.id !== playlistID
  );
  return this.save();
};

const User = mongoDB.model("User", userSchema, "users");

app.post("/db/user/login_or_create", (req, res) => {
  User.findOne({ id: req.body.id }, (err, user) => {
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

app.post("/db/user/addToPlaylist", (req, res) => {
  User.findOne({ id: req.body.id }, async (err, user) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      await user.addToPlaylist(req.body.playlistID, req.body.song);
    }
  });
});

app.post("/db/user/createPlaylist", async (req, res) => {
  try {
    const user = await User.findOne({ id: req.body.id });
    if (user) {
      await user.createPlaylist(req.body.playlist);
      res.send(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.get("/db/user/getUser", async (req, res) => {
  try {
    const userId = req.query.id;
    console.log("Requested user ID:", userId);

    const user = await User.findOne({ id: userId });

    if (user) {
      console.log("Found user:", user);
      res.json(user);
    } else {
      console.log("User not found");
      res.json(null);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.post("/db/user/removePlaylist", async (req, res) => {
  try {
    const userId = req.body.userId;
    const playlistId = req.body.playlistId;

    const user = await User.findOne({ id: userId });

    if (user) {
      await user.removePlaylist(playlistId);
      res.json(user);
    } else {
      console.log("User not found");
      res.json(null);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.post("/db/user/removeFromPlaylist", async (req, res) => {
  try {
    const userID = req.body.userID;
    const playlistID = req.body.playlistID;
    const songID = req.body.songID;
    console.log("Requested user ID:", userID);
    console.log("Requested playlist ID:", playlistID);
    console.log("Requested song ID:", songID);

    const user = await User.findOne({ id: userID });

    if (user) {
      await user.removeFromPlaylist(playlistID, songID);
      res.json(user);
    } else {
      console.log("User not found");
      res.json(null);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

const opts = {
  maxResults: 50,
  key: "AIzaSyA1AZNcvUFb9Cz8eF075CeLJAW4mIq_G7s",
  type: "video",
};

app.post("/yt/search", async (req, res) => {
  const query = req.body.query;
  await ytSearch(query, opts, (err, results) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else res.send(results);
  });
});

app.post("/spotify/search", async (req, res) => {
  console.log("Searching on Spotify...");
  const query = req.body.query;
  console.log("Query:", query);
  const searchQuery = `${query} site:open.spotify.com/track/`;
  console.log("Searching for tracks:", searchQuery);

  try {
    const googleResults = await googleIt({
      query: searchQuery,
      limit: 50,
      "only-urls": true,
    });
    const spotifyUrls = googleResults.map((result) => result.link);

    res.json(spotifyUrls);
  } catch (error) {
    console.error("Error searching for tracks:", error);
    res.sendStatus(500);
  }
});

const soundScrape = new SoundCloudScraper();
app.post("/sc/search", async function (req, res) {
  const query = req.body.query;
  const url = `https://soundcloud.com/search/sounds?q=${query}`;
  console.log("URL:", url);
  const results = await soundScrape.getHtmlFromUrl(url);
  res.send(await results);
  console.log(await results);
});

app.post("/sc/track", async function (req, res) {
  const trackId = req.body.trackID;
  console.log("Track ID:", trackId);
  const results = await soundScrape.getHtmlFromUrl(
    `https://soundcloud.com${trackId}`
  );
  res.send(await results);
  // console.log(await results);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
