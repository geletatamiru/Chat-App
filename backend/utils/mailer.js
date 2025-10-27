const {Resend} = require('resend')
const {VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE} = require('../utils/emailTemplates');

const resend = new Resend(process.env.RESEND_API_KEY)

async function sendVerificationEmail(to, subject, verificationToken) {
  try {
    const {data} = await resend.emails.send({
      from: `onboarding@resend.dev`, // sender
      to,                                            // recipient
      subject,                                       // subject line
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
    });
    if(data)
      console.log("Email sent:", data?.to);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
}

async function sendVerificationSuccessEmail(to, subject, username){
  try {
    const {data} = await resend.emails.send({
      from: `onboarding@resend.dev`, // sender
      to,                                            // recipient
      subject,                                       // subject line
      html: WELCOME_EMAIL_TEMPLATE.replace(/{name}/g, username)
                                  .replace(/{appName}/g, 'ArifChat'),
    })
    if(data)
      console.log("Email sent:", data?.to);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
}

async function sendResetPasswordEmail(to, subject, username, resetUrl){
  try {
    const {data} = await resend.emails.send({
      from: `onboarding@resend.dev`, // sender
      to,                                            // recipient
      subject,                                       // subject line
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(/{name}/g, username)
                                           .replace(/{resetURL}/g, resetUrl),
    })
    if(data)
      console.log("Email sent:", data?.to);
    
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
}

async function sendResetSuccessEmail(to, subject){
  try {
    const {data} = await resend.emails.send({
      from: `onboarding@resend.dev`, // sender
      to,                                            // recipient
      subject,                                       // subject line
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    })
    if(data)
      console.log("Email sent:", data?.to);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
}
module.exports = {sendVerificationEmail, sendVerificationSuccessEmail, sendResetPasswordEmail, sendResetSuccessEmail};
