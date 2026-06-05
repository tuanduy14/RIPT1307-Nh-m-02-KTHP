"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resend_1 = require("resend");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
async function sendMail(opts) {
    return resend.emails.send({
        from: 'onboarding@resend.dev',
        to: opts.to,
        subject: opts.subject,
        text: opts.text,
    });
}
exports.default = sendMail;
