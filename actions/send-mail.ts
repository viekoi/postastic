"use server";
import nodeMailer, { Transporter } from "nodemailer";

interface EmailOption {
  email: string;
  subject: string;
  data: {
    name:string,
    confirmLink:string
  };
}

export const  sendMail = async (options: EmailOption) => {
  const transporter: Transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const { email, subject, data } = options;

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject,
    html: `<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>POSTASTIC ACTIVE EMAIL</title>
        <style type="text/css">
            /* Base  */
    
            body {
                margin: 0;
                padding: 0;
                min-width: 100%;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.5;
                background-color: #FAFAFA;
                color: #222222;
            }
            a{
                color: #000;
                text-decoration: none;
            }
            h1{
                font-size: 24px;
                font-weight: 700;
                line-height: 1.25;
                margin-top: 0;
                margin-bottom: 15px;
                text-align: center;
            }
            p{
                margin-top: 0;
                margin-bottom: 24px;
            }
            table td{
                vertical-align: top;
            }
            /* Layout */
            .email-wrapper  {
                max-width: 600;
                margin: 0 auto;
            }
            .email-header {
                background-color: #0080f3;
                padding: 24px;
                color: #ffffff;
            }
            .email-body {
                padding: 24px;
                background-color: #ffffff;
            }
            .email-footer {
                padding: 24px;
                background-color: #f6f6f6;
            }
            /* Button  */
    
            .button {
                display: inline-block;
                background-color: #0070f3;
                color: #ffffff;
                font-size: 16px;
                font-weight: 700;
                text-align: center;
                text-decoration: none;
                padding: 12px 24px;
                border-radius: 4px;
            }
        </style>
    </head>
    <body>
        <div class="email-wrapper">
            <div class="email-header">
                <h1>Welcome to POSTASTIC</h1>
            </div>
            <div class="email-body">
                <p>Hello ${data.name}</p>
                <p>Thanks you for registering with LMS. To activate your account, please use the following activation code</p>
                <h2>${data.confirmLink}</h2>
                <p>Please enter this code on the activation page within the next 5 minutes</p>
                <p>If you this not register for a Becodemy account , please ignore this email</p>
            </div>
            <div class="email-footer">
                <p>If you have any question, please dont hestiate to contact us at <a href="mailto:khoinguyenviet1807@gmail.com">supporer@email.com</a></p>
            </div>
        </div>
    </body>
    </html>`,
  };

  await transporter.sendMail(mailOptions)
};
