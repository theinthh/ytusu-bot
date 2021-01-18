const responseBody = require('./response') 
const request = require('request');

module.exports = function handleMessage(sender_psid,received_message) {
  console.log(received_message.text);
  (received_message.text === 'Get Started') ? 
    (response = responseBody.getStarted) : 
  (received_message.text === 'get started') ?
    ( response = responseBody.getStarted) : 
  (received_message.text === 'Get started') ?
    ( response = responseBody.getStarted) : 
  (received_message.text === "Can you tell me more about this school?") ? 
    ( response = { "text" : "You can start the conversation with the bot by typing \"Get Started\" .Or wait for the admin to reply."}) :
  (received_message.text === "How much does this school cost?") ?
    ( response = { "text" : "You can start the conversation with the bot by typing \"Get Started\" .Or wait for the admin to reply."}) :
  (received_message.text ==="Are you accepting new students?") ?
    ( response = { "text" : "You can start the conversation with the bot by typing \"Get Started\" .Or wait for the admin to reply."}) :
  (received_message.text ===  "Where are you located?") ?
    (response = { "text" : "You can start the conversation with the bot by typing \"Get Started\" .Or wait for the admin to reply."}) :
    (response = { "text" : "If you have any question, the admin will reply soon."})

  callSendAPI(sender_psid,response);
}

function callSendAPI(sender_psid, response){
  let req_body = {
    "recipient" : {
      "id" : sender_psid
    },
    "message": response
  }
  request({
    "uri": "https://graph.facebook.com/v7.0/me/messages",
    "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
    "method" : "POST",
    "json" : req_body
  },(err,res,body) => {
    if(!err){
      console.log('Message sent')
    }
    else {
      console.console.error(("Unable to send message : " + err));
      
    }
  })
}
