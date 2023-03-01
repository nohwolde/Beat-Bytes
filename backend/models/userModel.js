import mongoose from "mongoose";

const userSchema = {
  userID: String,
  playlists: Array,
  profilePhoto: String,
};

const User = mongoose.model("User", userSchema);

export default User;
