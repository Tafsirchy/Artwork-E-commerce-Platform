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

module.exports = { sendOrderConfirmationEmail };
