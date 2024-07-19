const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const https = require("https");

// require('../../models/UserModel')
// require('../../models/GroupModel')
// require('../../models/TeamModel')

// const socket = require('../../socket');
const socket = require('../../socket');

// const config = require('./config');
const config = require('./config');

const startService = (app, isHttps, port, router, hasLog = false) => {
  if (!app) {
    console.log("App is empty");
    return;
  }
  // Start the server
  let server = null;
  if (isHttps) {
    server = https
      .createServer(
        {
          key: fs.readFileSync(__dirname + "/../_main/_https/privatekey.pem"),
          cert: fs.readFileSync(__dirname + "/../_main/_https/certificate.pem"),
        },
        app
      )
      .listen(port);
    console.log(`HTTPS server is running on port ${port}.`);
  } else {
    server = app.listen(port);
    console.log(`HTTP server is running on port ${port}.`);
  }

  // app settings
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false, limit: "5mb" })); // Parses urlencoded bodies
  app.use(bodyParser.json({ limit: "5mb" })); // Send JSON responses
  app.use(fileUpload());
  // if (hasLog) {
  //   app.use(logger("dev")); // Log requests to API using morgan
  // }
  // Enable CORS from client-side
  app.use((req, res, next) => {
    let origin = req.headers.origin;
    if (config.allowed_origin.indexOf(origin) >= 0) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.header(
      "Access-Control-Allow-Methods",
      "PUT, GET, POST, DELETE, OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials"
    );
    res.header("Access-Control-Allow-Credentials", "true");
    next();
  });

  if (router) {
    router(app);
  }

  return server;
};

const mongoDBConnect = (mongoCallback) => {
  mongoose
    .connect('mongodb://127.0.0.1:27017/sacco', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then((ret) => {
      console.log("MongoDB Connected!");
      if (mongoCallback) {
        mongoCallback();
      }
    })
    .catch((ret) => {
      console.log("MongoDB failed!", ret);
      if (config.db_reconnect_time) {
        setTimeout(() => {
          this.mongoDBConnect(mongoCallback);
        }, config.db_reconnect_time);
      }
    });
};

mongoDBConnect(null);


const server = startService(express(), false, config.port, require('./router'), false);

const io = require('socket.io')(server, {
  cors: {
    origin: '*'
  }
})

socket(io);

module.exports = server;

