const nodemailer = require('nodemailer');
const {VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE} = require('../utils/emailTemplates');
const transporter = nodemailer.createTransport({
  service: "Yahoo",  
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});

async function sendVerificationEmail(to, subject, verificationToken) {
  try {
    const info = await transporter.sendMail({
      from: `"ArifChat" <${process.env.EMAIL_USER}>`, // sender
      to,                                            // recipient
      subject,                                       // subject line
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
      category: "Email Verification"                                           
    });
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
}

async function sendVerificationSuccessEmail(to, subject, username){
  try {
    const info = await transporter.sendMail({
      from: `"ArifChat" <${process.env.EMAIL_USER}>`, // sender
      to,                                            // recipient
      subject,                                       // subject line
      html: WELCOME_EMAIL_TEMPLATE.replace(/{name}/g, username)
                                  .replace(/{appName}/g, 'ArifChat'),
      category: "Email Verification"    
    })
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
}

async function sendResetPasswordEmail(to, subject, username, resetUrl){
  try {
    const info = await transporter.sendMail({
      from: `"ArifChat" <${process.env.EMAIL_USER}>`, // sender
      to,                                            // recipient
      subject,                                       // subject line
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(/{name}/g, username)
                                           .replace(/{resetURL}/g, resetUrl),
      category: "Reset Password"    
    })
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
}

async function sendResetSuccessEmail(to, subject){
  try {
    const info = await transporter.sendMail({
      from: `"ArifChat" <${process.env.EMAIL_USER}>`, // sender
      to,                                            // recipient
      subject,                                       // subject line
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Reset Password Successful"    
    })
    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
}
module.exports = {sendVerificationEmail, sendVerificationSuccessEmail, sendResetPasswordEmail, sendResetSuccessEmail};
