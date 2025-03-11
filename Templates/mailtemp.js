const mailverfytemp = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      .header {
        background-color: #4caf50;
        color: #ffffff;
        text-align: center;
        padding: 20px 0;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
      }
      .content {
        padding: 20px;
        color: #333333;
        line-height: 1.6;
      }
      .content p {
        margin: 0 0 20px;
      }
      .btn {
        display: inline-block;
        padding: 10px 20px;
        background-color: #4caf50;
        color: #fffcfc;
        text-decoration: none;
        border-radius: 4px;
        font-size: 16px;
        font-weight: bold;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #808080;
        margin-top: 20px;
        padding: 10px 20px;
      }
        .ii a[href] {
    color: #fffcfc;
}
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Verify Your Email</h1>
      </div>
      <div class="content">
        <p>Hi,</p>
        <p>
          Thank you for registering with us. Please verify your email address by
          clicking the button below:
        </p>
        <p style="text-align: center">
          <a href={Link} class="btn">Verify Email</a>
        </p>
        <p>
          If you did not create an account, you can safely ignore this email.
        </p>
      </div>
      <div class="footer">
      <p>
    Copyright 2025 | All rights reserved
    </p>
      </div>
    </div>
  </body>
</html>


`;

const resetpasswordtemp = `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 50px auto; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); padding: 20px;">
            <div style="text-align: center; border-bottom: 2px solid #f4f4f4; padding-bottom: 15px;">
                <h1 style="margin: 0; color: #333;">Reset Password</h1>
            </div>
            <div style="padding: 20px; line-height: 1.6;">
                <p>Hi,</p>
                <p>
                    You have requested to reset your password. Your One Time Password (OTP) is:
                </p>
                <p style="text-align: center; font-size: 24px; font-weight: bold; color: #007BFF;">
                    {OTP}
                </p>
                <p>
                    If you did not request a password reset, you can safely ignore this email.
                </p>
            </div>
            <div style="text-align: center; margin-top: 20px; border-top: 2px solid #f4f4f4; padding-top: 15px;">
                <p style="font-size: 12px; color: #888;">
                    Copyright 2025 | All rights reserved
                </p>
            </div>
        </div>
    </body>
</html>`;

export { mailverfytemp, resetpasswordtemp };
