const contactUsTemp = (name, email, message) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; color: #333;">

    <div style="max-width: 600px; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color: #007bff; border-bottom: 2px solid #ddd; padding-bottom: 10px;">New Contact Form Submission</h2>
        
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background: #f9f9f9; padding: 10px; border-left: 4px solid #007bff; font-style: italic;">
            ${message}
        </blockquote>

        <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
        <p style="font-size: 12px; color: #666;">This email was sent from Job Portal website Contact Us form.</p>
    </div>

</body>
</html>


`;
export default contactUsTemp;
