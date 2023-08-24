const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const port = 8080;
const cors = require("cors");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const User = require("./models/User");
const authRoutes = require("./routes/auth");

app.use(cors());
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://Abhay1509:" +
      process.env.MONGO_PASSWORD +
      "@cluster0.jrxhu4d.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((x) => {
    console.log("Connected to mongo");
  })
  .catch((err) => {
    console.log("Error", err);
  });

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "SecretKey";

passport.use(
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findOne({ id: jwt_payload.sub }).exec();
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

app.get("/", (req, res) => {
  res.send("Hello");
});
app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log("App is running on port" + port);
});
