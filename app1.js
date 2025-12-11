const {
  messagesCheck,
  statusCheck,
  textMesssgeCheck
} = require('./utils/messageValidation');

const { sendTextMessage, sendTypingIndicator } = require('../util/apiHandler');


// Import Express.js
const express = require('express');

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set port and verify_token
const port = process.env.PORT || 3000;
const verifyToken = process.env.VERIFY_TOKEN;

// Route for GET requests
app.get('/', (req, res) => {
  const { 'hub.mode': mode, 'hub.challenge': challenge, 'hub.verify_token': token } = req.query;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WEBHOOK VERIFIED');
    res.status(200).send(challenge);
  } else {
    res.status(403).end();
  }
});

// Route for POST requests
app.post('/', async (req, res) => {
    console.log('# Listening Webhook event #');

  const bodyParam = req.body;
  console.log(JSON.stringify(bodyParam, null, 2));

  if (!bodyParam.object) {
    console.log('# not required webhook event! #');
    res.sendStatus(404);
    return;
  }

  try {
    //# Handle message events
    if (messagesCheck(bodyParam)) {
      console.log('# message event #');

      const phonNoId = bodyParam.entry[0].changes[0].value.metadata.phone_number_id;
      const phoneNo = bodyParam.entry[0].changes[0].value.messages[0].from;
      const messageId = bodyParam.entry[0].changes[0].value.messages[0].id;

      console.log('phone number id: ' + phonNoId);
      console.log('from number: ' + phoneNo);
      console.log('message id: ' + messageId);

      await sendTypingIndicator(messageId);

      //# Your business logic
      if (textMesssgeCheck(bodyParam)) {
        const userMessage =
          bodyParam.entry[0].changes[0].value.messages[0].text.body;

        if (await sendTextMessage(phoneNo, userMessage)) {
          console.log('message sent successfully');
        }
      } else {
        if (await sendTextMessage(phoneNo, 'Please send text message')) {
          console.log('message sent successfully');
        }
      }

      res.sendStatus(200);
      return;
    }

    //# Handle message status events
    if (statusCheck(bodyParam)) {
      console.log('# message status event check #');
      res.sendStatus(200);
      return;
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('Error processing webhook:', err);
    res.sendStatus(500);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`\nListening on port ${port}\n`);
});