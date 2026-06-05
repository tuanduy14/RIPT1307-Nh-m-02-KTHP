"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resend_1 = require("resend");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
async function sendMail(opts) {
    console.log('[sendMail] Sending to:', opts.to, '| Subject:', opts.subject);
    try {
        const result = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: opts.to,
            subject: opts.subject,
            text: opts.text,
        });
        console.log('[sendMail] Result:', JSON.stringify(result));
        return result;
    }
    catch (e) {
        console.error('[sendMail] Error:', e);
        throw e;
    }
}
exports.default = sendMail;
