const sendgrid = require('@sendgrid/mail');
const config = require('./configs/config.json');

const sendgridApiKey = config.email.sendgridApiKey;
sendgrid.setApiKey(sendgridApiKey);

const info = async (subject, html) => {
    if (!sendgridApiKey || !subject || !html) {
        return;
    }

    let from = config.email.from;
    let to = config.email.to;
    let fullSubject = `[CoolBeans! Info] ${subject}`;

    const msg = {
        from,
        to,
        subject: fullSubject,
        text: html,
        html: html
    };

    try {
        await sendgrid.send(msg);
    } catch (e) {
        console.error(e.response.body);
    }
};

const alert = async (subject, html) => {
    if (!sendgridApiKey || !subject || !html) {
        return;
    }

    let from = config.email.from;
    let to = config.email.to;
    let fullSubject = `[CoolBeans! Alert] ${subject}`;

    const msg = {
        from,
        to,
        subject: fullSubject,
        text: html,
        html: html
    };

    try {
        await sendgrid.send(msg);
    } catch (e) {
        console.error(e.response.body);
    }
};

module.exports = {
    info,
    alert
};