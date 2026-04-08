export const html = ({ code, message } = {}) => {
  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style type="text/css">
        body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1a1625; color: #ffffff; }
        .container { width: 100%; max-width: 600px; margin: auto; background-color: #241e35; border-radius: 15px; overflow: hidden; margin-top: 20px; border: 1px solid #3d345a; }
        .header { background: linear-gradient(135deg, #6b46c1 0%, #3d345a 100%); padding: 30px; text-align: center; }
        .content { padding: 40px; text-align: center; }
        .footer { background-color: #1a1625; padding: 20px; text-align: center; border-top: 1px solid #3d345a; }
        .logo-text { font-size: 24px; font-weight: bold; color: #ffffff; letter-spacing: 1px; }
        .logo-accent { color: #a78bfa; }
        .code-box { background-color: rgba(167, 139, 250, 0.1); border: 2px dashed #a78bfa; border-radius: 10px; padding: 20px; margin: 30px 0; font-size: 32px; font-weight: bold; color: #a78bfa; letter-spacing: 5px; }
        h1 { margin: 0; font-size: 22px; color: #ffffff; }
        p { color: #b7b4c7; line-height: 1.6; }
        .social-icons img { filter: brightness(0) invert(1); opacity: 0.7; margin: 0 10px; transition: 0.3s; }
        .social-icons img:hover { opacity: 1; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo-text">Mozkra<span class="logo-accent">Tech</span></div>
        </div>
        <div class="content">
            <h1>${message}</h1>
            <p>Welcome to your learning journey! Please use the verification code below to secure your account and start tracking your progress.</p>
            
            <div class="code-box">${code}</div>
            
            <p>If you didn't request this code, you can safely ignore this email.</p>
        </div>
        <div class="footer">
            <p style="font-size: 12px; margin-bottom: 15px;">Stay in touch with MozakraTech</p>
            <div class="social-icons">
                <a href="${process.env.facebookLink}"><img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="30"></a>
                <a href="${process.env.instegram}"><img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="30"></a>
                <a href="${process.env.twitterLink}"><img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="30"></a>
            </div>
            <p style="font-size: 10px; margin-top: 20px;">&copy; 2026 MozakraTech. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
};
