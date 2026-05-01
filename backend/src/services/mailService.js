const transporter = require("../config/mailer");
const { generateInvoice } = require("../utils/invoiceGenerator");

const sendOrderConfirmationEmail = async (order, userEmail) => {
  try {
    const invoicePath = await generateInvoice(order);

    const mailOptions = {
      from: `"Bristiii Gallery" <${process.env.EMAIL_USER || 'no-reply@bristiii.com'}>`,
      to: userEmail,
      subject: `Order Confirmation - ${order._id}`,
      text: `Thank you for your order! Your invoice is attached.`,
      attachments: [
        {
          filename: `invoice-${order._id}.pdf`,
          path: invoicePath,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    
    console.log(`Email sent successfully to ${userEmail}`);
  } catch (error) {
    console.error("Email Sending Error:", error);
  }
};

const sendResetPasswordEmail = async (userEmail, resetToken) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const mailOptions = {
      from: `"Bristiii Gallery" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: 'Outfit', sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #eee;">
          <h2 style="color: #1a1a1a; text-transform: uppercase; letter-spacing: 2px;">Identity Recovery</h2>
          <p style="color: #666; line-height: 1.6;">We received a request to reset the password for your Bristiii account. If this wasn't you, please ignore this email.</p>
          <div style="margin: 40px 0;">
            <a href="${resetUrl}" style="background-color: #1a1a1a; color: #fff; padding: 15px 30px; text-decoration: none; text-transform: uppercase; font-size: 12px; letter-spacing: 2px; font-weight: bold;">Reset Password</a>
          </div>
          <p style="color: #999; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">The link will expire in 10 minutes.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email Sending Error:", error);
    throw new Error("Email could not be sent");
  }
};

module.exports = { sendOrderConfirmationEmail, sendResetPasswordEmail };
