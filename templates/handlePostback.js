const request = require("request");
const responseBody = require("./response");

module.exports = function handlePostback(sender_psid, received_postback) {
  console.log(received_postback);
  let payload = received_postback.payload;
  payload === "Can you tell me more about this school?"
    ? (response = {
        text:
          "It is an Engineering school located in Myanmar.The university offers 14 main modules for undergraduate course.",
      })
    : payload === "Get Started"
    ? (response = responseBody.getStarted)
    : payload === "show academic plan"
    ? //  (response = responseBody.chooseExamOrClass) :
      //(response = responseBody.showWebView) :
      (response = setYearAndMajor(sender_psid))
    : payload === "show upcoming events"
    ? (response = { text: "Here is upcoming events" })
    : (response = { text: "Wait for the admin to reply" });
  callSendAPI(sender_psid, response);
};

function callSendAPI(sender_psid, response) {
  let req_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };
  request(
    {
      uri: "https://graph.facebook.com/v9.0/me/messages",
      qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
      method: "POST",
      json: req_body,
    },
    (err, res, body) => {
      if (!err) {
        console.log(response);
      } else {
        console.error("Unable to send message : " + err);
      }
    }
  );
}

function setYearAndMajor(sender_psid) {
  response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "button",
        text: "What do you want to ask for?",
        buttons: [
          {
            type: "web_url",
            url: "https://ytusu-bot.herokuapp.com/page",
            webview_height_ratio: "full",
            title: "Select",
            messenger_extensions: true,
          },
        ],
      },
    },
  };
  return response;
}
