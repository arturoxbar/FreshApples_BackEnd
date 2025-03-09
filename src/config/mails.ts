import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });


const emailRegistro = async (email: string, code: string) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.APP_USER,
      pass: process.env.APP_PASSWORD,
    },
  });
  try {
    await transport.sendMail({
      from: process.env.APP_USER,
      to: email,
      subject: "Confirm your account",
      html: `<!DOCTYPE html>
<html
  lang="en"
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:o="urn:schemas-microsoft-com:office"
>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>Verify Your Account</title>
    <style>
      table,
      td,
      div,
      h1,
      p {
        font-family: Arial, sans-serif;
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; background: #121212; color: white">
    <table
      role="presentation"
      style="
        width: 100%;
        border-collapse: collapse;
        border: 0;
        border-spacing: 0;
        background: #121212;
      "
    >
      <tr>
        <td align="center" style="padding: 0">
          <table
            role="presentation"
            style="
              width: 602px;
              border-collapse: collapse;
              border: 1px solid #ffd700;
              border-spacing: 0;
              text-align: left;
            "
          >
            <tr>
              <td align="center" style="padding: 40px 0 30px 0">
                <img
                  src="https://i.postimg.cc/mgCFyVbg/fontboltnew.png"
                  alt=""
                  width="200"
                  style="
                    height: auto;
                    display: block;
                  "
                />
              </td>
            </tr>
            <tr>
              <td
                style="padding: 36px 30px 20px 30px; background-color: #121212"
              >
                <table
                  role="presentation"
                  style="
                    width: 100%;
                    border-collapse: collapse;
                    border: 0;
                    border-spacing: 0;
                  "
                >
                  <tr>
                    <td style="padding: 0; text-align: center">
                      <h1
                        style="
                          font-size: 30px;
                          margin: 0 0 20px 0;
                          color: #ffd700;
                          text-shadow: 2px 2px 4px black;
                        "
                      >
                        Verify your new account
                      </h1>
                      <p style="font-size: 16px; color: white">
                        Use the following Code to verify your account
                      </p>
                      <p style="font-size: 36px; color: red">${code}</p>
                      <br />
                      <p style="margin: 0; font-size: 14px; color: #b3b3b3">
                        If you didn't create this account, please ignore this
                        message.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`,
    });
  } catch (error) {
    console.log(error);
  }
};

const emailReset = async (email: string, code: string) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.APP_USER,
      pass: process.env.APP_PASSWORD,
    },
  });


  try {
    await transport.sendMail({
      from: process.env.APP_USER,
      to: email,
      subject: "Reset your password",
      html: `<!DOCTYPE html>
<html
  lang="en"
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:o="urn:schemas-microsoft-com:office"
>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>Verify Your Account</title>
    <style>
      table,
      td,
      div,
      h1,
      p {
        font-family: Arial, sans-serif;
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; background: #121212; color: white">
    <table
      role="presentation"
      style="
        width: 100%;
        border-collapse: collapse;
        border: 0;
        border-spacing: 0;
        background: #121212;
      "
    >
      <tr>
        <td align="center" style="padding: 0">
          <table
            role="presentation"
            style="
              width: 602px;
              border-collapse: collapse;
              border: 1px solid #ffd700;
              border-spacing: 0;
              text-align: left;
            "
          >
            <tr>
              <td align="center" style="padding: 40px 0 30px 0">
                <img
                  src="https://i.postimg.cc/mgCFyVbg/fontboltnew.png"
                  alt=""
                  width="200"
                  style="
                    height: auto;
                    display: block;
                    filter: drop-shadow(0 0 0.75rem black);
                  "
                />
              </td>
            </tr>
            <tr>
              <td
                style="padding: 36px 30px 20px 30px; background-color: #121212"
              >
                <table
                  role="presentation"
                  style="
                    width: 100%;
                    border-collapse: collapse;
                    border: 0;
                    border-spacing: 0;
                  "
                >
                  <tr>
                    <td style="padding: 0; text-align: center">
                      <h1
                        style="
                          font-size: 30px;
                          margin: 0 0 20px 0;
                          color: #ffd700;
                          text-shadow: 2px 2px 4px black;
                        "
                      >
                        Reset your password
                      </h1>
                      <p style="font-size: 16px; color: white">
                        Use the following Code to verify your account
                      </p>
                      <p style="font-size: 36px; color: red">${code}</p>
                      <br />
                      <p style="margin: 0; font-size: 14px; color: #b3b3b3">
                        If you didn't reset your account password, please change your credentials.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
      `,
    });
  } catch (error) {
    console.log(error);
  }
};

export { emailRegistro, emailReset };
