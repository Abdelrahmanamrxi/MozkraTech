
import { sub } from 'date-fns';
import nodemailer from 'nodemailer';




export const sendEmail = async (to, sub, html) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });
        const info = await transporter.sendMail({
            from: `MozakraTech" <${process.env.EMAIL}>`,
            to: to? to : "mohamedislamdado100@gmail.com",
            subject: sub? sub : "Hello",
 /*            text: "Hello world?", */
            html: html? html : "<b>Hello world?</b>",
        });

    // console.log("Message sent:", info);
    if (info.accepted.length) {
        return true;
    } else {
        return false;
    }
}

export const sendSessionReminder = async ({ to, subject, session }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const startTime = new Date(session.startTime).toLocaleString("en-US", {
    weekday: "long", year: "numeric", month: "long",
    day: "numeric", hour: "2-digit", minute: "2-digit",
  });

  const endTime = new Date(session.endTime).toLocaleString("en-US", {
    hour: "2-digit", minute: "2-digit",
  });

  const html = `
  <!DOCTYPE html>
  <html>
  <body style="margin:0;padding:0;background-color:#f0ebf8;font-family:'Segoe UI',Arial,sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0"
            style="background:#ffffff;border-radius:16px;overflow:hidden;
                   box-shadow:0 4px 24px rgba(144,103,198,0.12);">

            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg,#242038 0%,#9067c6 100%);
                          padding:36px 40px;text-align:center;">
                <div style="background:rgba(255,255,255,0.15);display:inline-block;
                            padding:10px 20px;border-radius:50px;margin-bottom:16px;">
                  <span style="color:#fff;font-size:13px;letter-spacing:2px;
                               text-transform:uppercase;font-weight:600;">
                    Upcoming Session
                  </span>
                </div>
                <h1 style="color:#FFFFFF;margin:0;font-size:28px;font-weight:700;">
                  ⏰ You're on in 30 minutes!
                </h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:36px 40px;">
<p style="color:#555555;font-size:16px;line-height:1.6;margin:0 0 24px;">
  Hey there! Just a heads-up — your session is starting soon.
  Make sure you're ready to go!
</p>
<table width="100%" cellpadding="0" cellspacing="0"
  style="background:#000000;
         border-radius:12px;border-left:4px solid #9067c6;
         margin-bottom:28px;">
  <tr>
    <td style="padding:24px 28px;">

      <p style="margin:0 0 16px;font-size:20px;font-weight:700;color:#ffffff;">
        ${session.name}
      </p>

      <!-- Time row -->
      <table cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
        <tr>
          <td style="padding-right:10px;">
            <span style="background:#9067c6;color:#fff;border-radius:6px;
                         padding:4px 10px;font-size:12px;font-weight:600;">
              START
            </span>
          </td>
          <td style="color:#ffffff;font-size:15px;font-weight:500;">  <!-- ✅ white -->
            ${startTime}
          </td>
        </tr>
      </table>

      <table cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding-right:10px;">
            <span style="background:#cac4ce;color:#242038;border-radius:6px;
                         padding:4px 14px;font-size:12px;font-weight:600;">
              END
            </span>
          </td>
          <td style="color:#cccccc;font-size:15px;">  <!-- ✅ light grey -->
            ${endTime}
          </td>
        </tr>
      </table>

    </td>
  </tr>
</table>
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding-right:10px;">
                            <span style="background:#cac4ce;color:#242038;border-radius:6px;
                                         padding:4px 14px;font-size:12px;font-weight:600;">
                              END
                            </span>
                          </td>
                          <td style="color:#555;font-size:15px;">
                            ${endTime}
                          </td>
                        </tr>
                      </table>

                    </td>
                  </tr>
                </table>

                <!-- CTA -->
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="border-radius:10px;overflow:hidden;">
                    
                    </td>
                  </tr>
                </table>

                <p style="color:#999;font-size:13px;margin:24px 0 0;line-height:1.6;">
                  If you need to reschedule, please do so at least 15 minutes before the session starts.
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f7f5fa;padding:20px 40px;
                          border-top:1px solid #ebe6f2;text-align:center;">
                <p style="margin:0;color:#aaa;font-size:12px;line-height:1.8;">
                  © MozkraTech · Stay productive 🚀<br>
           
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>

  </body>
  </html>
  `;

  const emailSent = await transporter.sendMail({
    from: `"MozakraTech" <${process.env.EMAIL}>`,
    to,
    subject,
    html,
  });

  return emailSent;
};