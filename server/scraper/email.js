const sendmail = require('sendmail')();
const config = require('./configs/config.json');

const info = (subject, html) => {
    if (!subject || !html) {
        return;
    }

    let from = config.email.from;
    let to = config.email.to;
    let fullSubject = `[CoolBeans! Info] ${subject}`;

    sendmail({
        from,
        to,
        subject: fullSubject,
        html
    }, function(err, reply) {
        console.log(err && err.stack);
        console.dir(reply);
    });
};

const alert = (subject, html) => {
    if (!subject || !html) {
        return;
    }

    let from = config.email.from;
    let to = config.email.to;
    let fullSubject = `[CoolBeans! Alert] ${subject}`;

    sendmail({
        from,
        to,
        subject: fullSubject,
        html
    }, function(err, reply) {
        console.log(err && err.stack);
        console.dir(reply);
    });
};

module.exports = {
    info,
    alert
};