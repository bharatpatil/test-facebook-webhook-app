import axios  from 'axios';

const token=process.env.TOKEN;
const version=process.env.VERSION;
const phone_no_id=process.env.PHONE_NO_ID;

//mark as read and typing indicator
export async function sendTypingIndicator(messageId) {
  try {
    await axios.post(`https://graph.facebook.com/${version}/${phone_no_id}/messages?access_token=${token}`, {
      messaging_product: "whatsapp",
      status: "read",
      message_id: messageId,
      typing_indicator: {
        type: "text"
      }
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return true;
  } catch (error) {
    console.error("Error sending typing indicator:", error);
    return false;
  }
}

//# This is for sending Text Messages
export async function sendTextMessage(to,msg){
    try {
        // Make the Axios request to send the message
        await axios.post(`https://graph.facebook.com/${version}/${phone_no_id}/messages?access_token=${token}`, {
            messaging_product: "whatsapp",
            to: to,
            text:{
                body:""+msg
            }
        }, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        // If the request is successful, return true
        return true;
    } catch (error) {
        // If an error occurs, log it and return false
        if (error.response) {
      // Meta API responded with an error
      console.error("Meta API error:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data // Meta usually returns a clear JSON error
      });
    } else if (error.request) {
      // Request was made but no response
      console.error("No response received from Meta API:", error.request);
    } else {
      // Something went wrong setting up the request
      console.error("Axios setup error:", error.message);
    }


        return false;
    }
}


//# This is for sending Text Messages
export async function sendMarkAsRead(MsgId) {
    try {
        // Make the Axios request to send the message
        await axios.post(`https://graph.facebook.com/${version}/${phone_no_id}/messages?access_token=${token}`, {
            messaging_product: "whatsapp",
            status: "read",
            message_id: MsgId
            }, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        // If the request is successful, return true
        return true;
    } catch (error) {
        // If an error occurs, log it and return false
        console.error("Error sending message:", error);
        return false;
    }
}
