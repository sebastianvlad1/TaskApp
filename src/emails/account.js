const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'sebastianbranzas@gmail.com',
        subject: 'Welcome to my Task App!',
        text: `Welcome to the app, ${name}!`
    });
}
const cancelAccount = (email, name) => {
    sgMail.send({
       to: email,
       from: 'sebastianbranzas@gmail.com',
       subject: 'You left Task App',
       text: `Hi ${name} with email: ${email}. Let us know why you left!`
    });
}

module.exports = {
    sendWelcomeEmail,
    cancelAccount
};