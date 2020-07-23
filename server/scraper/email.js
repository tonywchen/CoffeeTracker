const sendmail = require('sendmail')();
const config = require('./configs/config.json');

const info = (subject, html) => {
    if (!subject || !html) {
        return;
    }

    let from = config.email.from;
    let to = config.email.to;
    let fullSubject = `[CoolBeans! Info] ${subject}`;

    return new Promise((resolve, reject) => {
        sendmail({
            from,
            to,
            subject: fullSubject,
            html
        }, function(err, reply) {
            if (err) {
                reject(err);
            } else {
                resolve(reply);
            }
        });
    });
};

const alert = (subject, html) => {
    if (!subject || !html) {
        return;
    }

    let from = config.email.from;
    let to = config.email.to;
    let fullSubject = `[CoolBeans! Alert] ${subject}`;

    return new Promise((resolve, reject) => {
        sendmail({
            from,
            to,
            subject: fullSubject,
            html
        }, function(err, reply) {
            if (err) {
                reject(err);
            } else {
                resolve(reply);
            }
        });
    });
};

module.exports = {
    info,
    alert
};