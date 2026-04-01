const nodemailer = require("nodemailer");

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

const sendEmail = async ({ to, subject, html }) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Notes App" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};

const buildResetEmailHtml = (userName, resetUrl) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;box-shadow:0 1px 3px rgba(0,0,0,.1);padding:40px;">
          <tr>
            <td style="text-align:center;padding-bottom:24px;">
              <h1 style="margin:0;font-size:24px;color:#111827;">Reset Your Password</h1>
            </td>
          </tr>
          <tr>
            <td style="font-size:15px;color:#4b5563;line-height:1.6;padding-bottom:24px;">
              Hi <strong>${userName}</strong>,<br><br>
              We received a request to reset your password. Click the button below to choose a new password. This link expires in <strong>1 hour</strong>.
            </td>
          </tr>
          <tr>
            <td style="text-align:center;padding-bottom:24px;">
              <a href="${resetUrl}" style="display:inline-block;padding:12px 32px;background:#111827;color:#fff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">
                Reset Password
              </a>
            </td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#9ca3af;line-height:1.5;">
              If you didn't request this, you can safely ignore this email. Your password will remain unchanged.<br><br>
              If the button doesn't work, copy and paste this URL:<br>
              <a href="${resetUrl}" style="color:#3b82f6;word-break:break-all;">${resetUrl}</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

module.exports = { sendEmail, buildResetEmailHtml };
