//importing modules
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

//function to send email to the user
const sendingMail = async ({ from, to, subject, text, name, verifiedCode }) => {
    try {
        const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>NodeMailer Email Template</title>
        <style>
          .container {
            width: 100%;
            height: 100%;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .email {
            width: 80%;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
          }
          .email-header {
            background-color: #333;
            color: #fff;
            padding: 20px;
            text-align: center;
          }
          .email-body {
            padding: 20px;
          }
          .email-footer {
            background-color: #333;
            color: #fff;
            padding: 20px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="email">
            <div class="email-header">
              <h1>NourBook App</h1>
            </div>
            <div class="email-body">
            <p>Hello, ${name} your Verification code is <span style="color: blue;">${verifiedCode}</span></p>
            </div>
            <div class="email-footer">
              <p>please enter the verifiedCode in the page on browser before the time gone </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
        let mailOptions = {
            from,
            to,
            subject,
            html,
        };
        //asign createTransport method in nodemailer to a variable
        //service: to determine which email platform to use
        //auth contains the senders email and password which are all saved in the .env

        const Transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.email,
                pass: process.env.emailpassword,
            },
        });

        //return the Transporter variable which has the sendMail method to send the mail
        //which is within the mailOptions
        return await Transporter.sendMail(mailOptions);
    } catch (error) {
        throw new CustomError(
            LOGIN_ERROR,
            "SomeThing went wrong !!! i didnt send email yet",
            StatusCodes.BAD_REQUEST
        );
    }
};

export default sendingMail;
