"use strict";
const port = process.env.PORT || 5000;
const dotenv = require("dotenv").config();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));
const request = require("request");
require("./routes/webhook_verify")(app);
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const SERVER_URL = process.env.SERVER_URL;
const APP_SECRET = process.env.APP_SECRET;

app.listen(port, () => console.log("webhook is listening"));
module.exports = app;
app.get("/page", (req, res, next) => {
  let referer = req.get("Referer");
  console.log(referer);
  if (referer) {
    if (referer.indexOf("www.messenger.com") >= 0) {
      res.setHeader("X-Frame-Options", "ALLOW-FROM https://www.messenger.com/");
    } else if (referer.indexOf("www.facebook.com") >= 0) {
      res.setHeader("X-Frame-Options", "ALLOW-FROM https://www.facebook.com/");
    }
    res.sendFile("/public/page.html", { root: __dirname });
  } else {
    //res.setHeader('X-Frame-Options', 'ALLOW-FROM https://www.messenger.com/');
    res.sendFile("/public/page.html", { root: __dirname });
  }
});
// Handle postback from webview
app.get("/pagepostback", (req, res) => {
  console.log(req.query);
  let body = req.query;
  let { year } = body;
  let response = {
    attachment: {
      type: "image",
      payload: {
        attachment_id: entranceMark[year - 6],
      },
    },
  };
  res
    .status(200)
    .send("Please close this window to return to the conversation thread.");
  callSendAPI(body.psid, response);
});

function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };
  console.log(sender_psid);
  // Send the HTTP request to the Messenger Platform
  request(
    {
      uri: "https://graph.facebook.com/v9.0/me/messages",
      qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      if (!err) {
        console.log(response);
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );
}

var entranceMark = ["468854020612361", "468854020612361", "468854020612361"];

// var classroom = [
//     ["1","303574207338780","303574207338780"],
//     ["2","303574207338780","303574207338780"],
//     ["3","303574207338780","468854020612361"]
// ]
