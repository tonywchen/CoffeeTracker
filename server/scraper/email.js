const sendmail = require('sendmail')();
const configs = require('./configs/configs.json');

const info = (subject, html) => {
    if (!subject || !html) {
        return;
    }

    let from = configs.email.from;
    let to = configs.email.to;
    let fullSubject = '[CoolBeans! Info] `${subject}`';

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

    let from = configs.email.from;
    let to = configs.email.to;
    let fullSubject = '[CoolBeans! Alert] `${subject}`';

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