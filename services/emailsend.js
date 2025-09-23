const { Resend } = require('resend');

async function sendemail(Url, email, firstName, lastName) {

  const resend = new Resend(process.env.RESEND_EMAIL_API_KEY);
  const emailTemplate = `
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9fafb;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 40px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #6d74fc;
            margin-top: 0;
        }
        p {
            color: #555;
        }
        .reset-link a {
            font-size: 18px;
            font-weight: bold;
            color: #6d74fc; /* Your primary text color */
            text-decoration: none;
        }
        .reset-link a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Password Reset Request</h1>
        <p>Hi ${firstName} ${lastName},</p>
        <p>We received a request to reset your password. Click the link below to reset your password:</p>
        <p class="reset-link"><a href="${Url}">Reset Password</a></p>
        <p>If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
        <p>Thank you,</p>
        <p>UniRide</p>
    </div>
</body>
</html>
`;

  await resend.emails.send({
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: 'Password Reset Request',
    html: emailTemplate
  });
}
module.exports = { sendemail };