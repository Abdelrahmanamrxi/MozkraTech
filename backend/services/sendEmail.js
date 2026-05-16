
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
    from: `"MozakraTech" <${process.env.EMAIL}>`,  // ✅ fixed missing opening quote
    to: to || "mohamedislamdado100@gmail.com",
    subject: sub || "Hello",
    html: html || "<b>Hello world?</b>",
  });

  return info.accepted.length > 0;
};

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
  <body style="margin:0;padding:0;background:#f3eff9;font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
      <tr>
        <td align="center">
          <table width="580" cellpadding="0" cellspacing="0"
            style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e8e2f0;">

            <!-- Header -->
            <tr>
              <td style="background:#1a1630;padding:32px 36px;text-align:center;">
                <div style="display:inline-block;background:rgba(144,103,198,0.25);
                            border:1px solid rgba(144,103,198,0.4);padding:5px 16px;
                            border-radius:50px;margin-bottom:14px;">
                  <span style="color:#c4a8f0;font-size:11px;letter-spacing:2px;
                               text-transform:uppercase;font-weight:500;">
                    Upcoming Session
                  </span>
                </div>
                <div style="font-size:36px;margin-bottom:8px;">⏰</div>
                <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:500;">
                  You're on in 30 minutes!
                </h1>
                <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:8px 0 0;">
                  Get ready — your session is starting soon
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:28px 32px;">
                <p style="color:#666;font-size:14px;line-height:1.7;margin:0 0 20px;">
                  Hey there! Just a heads-up — your session is starting very soon.
                  Make sure you're all set and ready to go!
                </p>

                <!-- Session card -->
                <table width="100%" cellpadding="0" cellspacing="0"
                  style="border:1px solid #e0d9ec;border-radius:12px;
                         border-left:3px solid #9067c6;margin-bottom:20px;">
                  <tr>
                    <td style="padding:20px 20px 20px 18px;">

                      <p style="margin:0 0 4px;font-size:16px;font-weight:600;color:#1a1630;">
                        ${session.name}
                      </p>
                      <p style="margin:0 0 16px;font-size:12px;color:#999;">
                        Session starting soon
                      </p>

                      <!-- Start -->
                      <table cellpadding="0" cellspacing="0" style="margin-bottom:10px;">
                        <tr>
                          <td style="padding-right:10px;vertical-align:middle;">
                            <span style="background:#ede5fa;color:#7a55b0;border-radius:4px;
                                         padding:3px 10px;font-size:11px;font-weight:500;
                                         text-transform:uppercase;letter-spacing:0.5px;
                                         display:inline-block;min-width:56px;text-align:center;">
                              Start
                            </span>
                          </td>
                          <td style="color:#555;font-size:13px;vertical-align:middle;">
                            ${startTime}
                          </td>
                        </tr>
                      </table>

                      <!-- End -->
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding-right:10px;vertical-align:middle;">
                            <span style="background:#e8e2f0;color:#5c4d7a;border-radius:4px;
                                         padding:3px 10px;font-size:11px;font-weight:500;
                                         text-transform:uppercase;letter-spacing:0.5px;
                                         display:inline-block;min-width:56px;text-align:center;">
                              End
                            </span>
                          </td>
                          <td style="color:#888;font-size:13px;vertical-align:middle;">
                            ${endTime}
                          </td>
                        </tr>
                      </table>

                    </td>
                  </tr>
                </table>

                <p style="color:#aaa;font-size:12px;margin:20px 0 0;line-height:1.7;">
                  If you need to reschedule, please do so at least 15 minutes before the session starts.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f7f5fa;padding:16px 32px;
                          border-top:1px solid #ebe6f2;text-align:center;">
                <p style="margin:0;color:#aaa;font-size:12px;line-height:1.8;">
                  © MozkraTech · Stay productive 🚀
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



export const sendTaskReminder = async ({ to, subject, task }) => {
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL, pass: process.env.PASSWORD },
  });

  const dueDate = new Date(task.dueDate).toLocaleString("en-US", {
    weekday: "long", year: "numeric", month: "long",
    day: "numeric", hour: "2-digit", minute: "2-digit",
  });

  const priority = {
    high:   { bg: "#fde8e8", color: "#a32d2d", label: "High"   },
    medium: { bg: "#fef3e2", color: "#854f0b", label: "Medium" },
    low:    { bg: "#eaf3de", color: "#3b6d11", label: "Low"    },
  }[task.priority?.toLowerCase()] ?? { bg: "#ede5fa", color: "#7a55b0", label: task.priority };

  const html = `
  <!DOCTYPE html>
  <html>
  <body style="margin:0;padding:0;background:#f3eff9;font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
      <tr>
        <td align="center">
          <table width="580" cellpadding="0" cellspacing="0"
            style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e8e2f0;">

            <!-- Header -->
            <tr>
              <td style="background:#1a1630;padding:32px 36px;text-align:center;">
                <div style="display:inline-block;background:rgba(144,103,198,0.25);
                            border:1px solid rgba(144,103,198,0.4);padding:5px 16px;
                            border-radius:50px;margin-bottom:14px;">
                  <span style="color:#c4a8f0;font-size:11px;letter-spacing:2px;
                               text-transform:uppercase;font-weight:500;">
                    Task Reminder
                  </span>
                </div>
                <div style="font-size:36px;margin-bottom:8px;">📋</div>
                <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:500;">
                  Task due tomorrow
                </h1>
                <p style="color:rgba(255,255,255,0.5);font-size:13px;margin:8px 0 0;">
                  Don't let it slip through the cracks
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:28px 32px;">
                <p style="color:#666;font-size:14px;line-height:1.7;margin:0 0 20px;">
                  Hey there — just a quick heads-up. You have a task due tomorrow.
                  Make sure to get it wrapped up on time!
                </p>

                <!-- Task card -->
                <table width="100%" cellpadding="0" cellspacing="0"
                  style="border:1px solid #e0d9ec;border-radius:12px;
                         border-left:3px solid #9067c6;margin-bottom:20px;">
                  <tr>
                    <td style="padding:20px 20px 20px 18px;">

                      <p style="margin:0 0 4px;font-size:16px;font-weight:600;color:#1a1630;">
                        ${task.name}
                      </p>

                      <!-- Due Date -->
                      <table cellpadding="0" cellspacing="0" style="margin:16px 0 10px;">
                        <tr>
                          <td style="padding-right:10px;vertical-align:middle;">
                            <span style="background:#ede5fa;color:#7a55b0;border-radius:4px;
                                         padding:3px 10px;font-size:11px;font-weight:500;
                                         text-transform:uppercase;letter-spacing:0.5px;
                                         display:inline-block;min-width:72px;text-align:center;">
                              Due date
                            </span>
                          </td>
                          <td style="color:#555;font-size:13px;vertical-align:middle;">
                            ${dueDate}
                          </td>
                        </tr>
                      </table>

                      <!-- Priority -->
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding-right:10px;vertical-align:middle;">
                            <span style="background:#ede5fa;color:#7a55b0;border-radius:4px;
                                         padding:3px 10px;font-size:11px;font-weight:500;
                                         text-transform:uppercase;letter-spacing:0.5px;
                                         display:inline-block;min-width:72px;text-align:center;">
                              Priority
                            </span>
                          </td>
                          <td style="vertical-align:middle;">
                            <span style="background:${priority.bg};color:${priority.color};
                                         border-radius:4px;padding:3px 12px;
                                         font-size:12px;font-weight:500;">
                              ${priority.label}
                            </span>
                          </td>
                        </tr>
                      </table>

                    </td>
                  </tr>
                </table>

                <p style="color:#aaa;font-size:12px;margin:20px 0 0;line-height:1.7;">
                  Stay on top of your work and keep up the great momentum!
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f7f5fa;padding:16px 32px;
                          border-top:1px solid #ebe6f2;text-align:center;">
                <p style="margin:0;color:#aaa;font-size:12px;line-height:1.8;">
                  © MozkraTech · Stay productive 🚀
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

  const emailSent = await transport.sendMail({
    from: `"MozakraTech" <${process.env.EMAIL}>`,
    to,
    subject,
    html,
  });

  return emailSent;
};