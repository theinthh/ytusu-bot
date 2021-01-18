const handleMessage = require('../templates/handleMessage');
const handlePostback = require('../templates/handlePostback')

module.exports = function(app) {
    
app.post("/webhook", (req, res) => {
  let body = req.body;
  if (body.object === "page") {

    body.entry.forEach((entry) => {
      let webhook_event = entry.messaging[0];
      let sender_psid = webhook_event.sender.id;
      console.log('Sender PSID: ' + sender_psid);
    
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);        
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });
    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});

app.get("/webhook", (req, res) => {
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];
  if (mode && token) {
    if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
      console.log("Webhook verfied");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
})
}

