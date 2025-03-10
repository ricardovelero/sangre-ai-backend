/**
 * Sends an email using PostmarkApp API.
 *
 * @param {Object} event - The event object containing the request data.
 * @param {string} event.body - The JSON stringified request body.
 * @returns {Promise<Object>} - A response object containing the status code and message.
 *
 * @throws {Error} If there is an issue with the API request or JSON parsing.
 *
 * @example
 * const event = {
 *   body: JSON.stringify({
 *     from: "sender@example.com",
 *     to: "recipient@example.com",
 *     subject: "Hello",
 *     textBody: "This is a plain text email",
 *     htmlBody: "<p>This is an HTML email</p>",
 *     messageStream: "outbound"
 *   })
 * };
 *
 * pmaEmail(event)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
const pmaEmail = async function (event) {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Payload required" }),
      };
    }

    let parsedBody;
    try {
      parsedBody = JSON.parse(event.body);
    } catch (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid JSON payload" }),
      };
    }

    const {
      from,
      to,
      subject,
      textBody,
      htmlBody,
      messageStream = "outbound",
    } = parsedBody;

    // Validate required fields
    if (!from || !to || !subject || (!textBody && !htmlBody)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required fields" }),
      };
    }

    const response = await fetch("https://api.postmarkapp.com/email", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": process.env.EMAILS_SECRET,
      },
      method: "POST",
      body: JSON.stringify({
        From: from,
        To: to,
        Subject: subject,
        TextBody: textBody,
        HtmlBody: htmlBody,
        MessageStream: messageStream,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Postmark Error:", errorData);
      return {
        statusCode: response.status,
        body: JSON.stringify({ message: errorData.Message }),
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Email sent successfully",
        postmarkResponse: data,
      }),
    };
  } catch (error) {
    console.error("Error in pmaEmail:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal server error",
        error: error.message,
      }),
    };
  }
};

module.exports = { pmaEmail };
