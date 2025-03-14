/**
 * Sends an email using PostmarkApp API.
 *
 * @param {Object} emailOptions - An object with the email data.
 * @returns {Promise<Object>} - A response object containing the status code and message.
 *
 * @throws {Error} If there is an issue with the API request or JSON parsing.
 *
 * @example
 * const emailOptions = {
 *     from: "sender@example.com",
 *     to: "recipient@example.com",
 *     subject: "Hello",
 *     textBody: "This is a plain text email",
 *     htmlBody: "<p>This is an HTML email</p>",
 *     messageStream: "outbound"
 *  };
 *
 * pmaEmail(emailOptions)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
const pmaEmail = async function (emailOptions) {
  try {
    const {
      from,
      to,
      subject,
      textBody,
      htmlBody,
      messageStream = "outbound",
    } = emailOptions;

    // Validación estricta de los campos
    if (!from || !to || !subject || (!textBody?.trim() && !htmlBody?.trim())) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required fields" }),
      };
    }

    // Verificar que la variable de entorno está definida
    if (!process.env.EMAILS_SECRET) {
      console.error("EMAILS_SECRET is not set in environment variables.");
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Email configuration error" }),
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
        From: from.trim(),
        To: to.trim(),
        Subject: subject.trim(),
        TextBody: textBody?.trim() || "",
        HtmlBody: htmlBody?.trim() || "",
        MessageStream: messageStream.trim(),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Postmark Error:", errorData);
      return {
        statusCode: response.status,
        body: {
          message: errorData.Message || "Error sending email",
        },
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
