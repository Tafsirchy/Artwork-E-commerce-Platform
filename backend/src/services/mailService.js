const transporter = require("../config/mailer");
const { generateInvoice } = require("../utils/invoiceGenerator");

// ─── Shared Layout Wrapper ────────────────────────────────────────────────────
const emailWrapper = (content, accentColor = "#C4A484") => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bristiii Gallery</title>
</head>
<body style="margin:0;padding:0;background-color:#f5f4f0;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f4f0;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background:${accentColor};padding:0;text-align:center;">
              <div style="height:4px;background:${accentColor};"></div>
            </td>
          </tr>
          <tr>
            <td style="background:#1a1a1a;padding:28px 32px;text-align:center;">
              <p style="margin:0;color:${accentColor};font-size:10px;letter-spacing:6px;text-transform:uppercase;font-family:'Helvetica Neue',sans-serif;">Bristiii</p>
              <p style="margin:4px 0 0;color:rgba(255,255,255,0.3);font-size:8px;letter-spacing:4px;text-transform:uppercase;font-family:'Helvetica Neue',sans-serif;">Gallery of Original Art</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="background:#ffffff;padding:40px 32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#1a1a1a;padding:24px 32px;text-align:center;">
              <p style="margin:0;color:rgba(255,255,255,0.3);font-size:9px;letter-spacing:3px;text-transform:uppercase;font-family:'Helvetica Neue',sans-serif;">© 2024 Bristiii · All rights reserved</p>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.2);font-size:9px;font-family:'Helvetica Neue',sans-serif;">You received this email because you have an account with us.</p>
            </td>
          </tr>
          <!-- Bottom accent -->
          <tr><td style="height:4px;background:${accentColor};"></td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// ─── 1. Password Reset Email — Dark, Secure, Minimal ─────────────────────────
const sendResetPasswordEmail = async (userEmail, resetToken) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const content = `
      <div style="text-align:center;padding:8px 0 32px;">
        <div style="width:64px;height:64px;border-radius:50%;background:#f5f4f0;border:2px solid #e8e3dc;margin:0 auto 24px;display:flex;align-items:center;justify-content:center;">
          <span style="font-size:28px;line-height:64px;display:block;">🔑</span>
        </div>
        <p style="margin:0 0 4px;color:#9b8a77;font-size:10px;letter-spacing:5px;text-transform:uppercase;font-family:'Helvetica Neue',sans-serif;">Account Security</p>
        <h1 style="margin:8px 0 0;color:#1a1a1a;font-size:28px;font-weight:300;letter-spacing:2px;text-transform:uppercase;">Password Reset</h1>
        <div style="width:40px;height:1px;background:#C4A484;margin:20px auto;"></div>
      </div>

      <p style="color:#555;font-size:15px;line-height:1.8;margin:0 0 12px;font-family:'Helvetica Neue',sans-serif;">
        We received a request to reset the password for your Bristiii account. Click the button below to choose a new password.
      </p>
      <p style="color:#999;font-size:13px;line-height:1.7;margin:0 0 32px;font-family:'Helvetica Neue',sans-serif;">
        If you didn't request this, you can safely ignore this email. Your password will remain unchanged.
      </p>

      <div style="text-align:center;margin:32px 0;">
        <a href="${resetUrl}" style="display:inline-block;background:#1a1a1a;color:#ffffff;padding:16px 40px;text-decoration:none;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-family:'Helvetica Neue',sans-serif;font-weight:bold;">Reset My Password</a>
      </div>

      <div style="background:#f9f8f6;border-left:3px solid #C4A484;padding:16px 20px;margin:24px 0 0;">
        <p style="margin:0;color:#999;font-size:11px;letter-spacing:1px;text-transform:uppercase;font-family:'Helvetica Neue',sans-serif;">⏰ This link expires in <strong style="color:#555;">10 minutes</strong></p>
      </div>

      <p style="color:#bbb;font-size:11px;margin:20px 0 0;font-family:'Helvetica Neue',sans-serif;">
        Or copy this URL into your browser:<br/>
        <span style="color:#C4A484;word-break:break-all;">${resetUrl}</span>
      </p>
    `;

    await transporter.sendMail({
      from: `"Bristiii Gallery" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Reset Your Password — Bristiii Gallery",
      html: emailWrapper(content, "#C4A484"),
    });
  } catch (error) {
    console.error("Password Reset Email Error:", error);
    throw new Error("Email could not be sent");
  }
};

// ─── 2. Welcome Email — Warm, Celebratory, Collector Focused ─────────────────
const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const frontendUrl = process.env.FRONTEND_URL || "https://bristiii-web.vercel.app";
    const content = `
      <div style="text-align:center;padding:8px 0 32px;">
        <div style="font-size:40px;margin-bottom:16px;">🎨</div>
        <p style="margin:0 0 4px;color:#9b8a77;font-size:10px;letter-spacing:5px;text-transform:uppercase;font-family:'Helvetica Neue',sans-serif;">Welcome to the Collection</p>
        <h1 style="margin:8px 0 0;color:#1a1a1a;font-size:28px;font-weight:300;letter-spacing:2px;">Hello, ${userName}!</h1>
        <div style="width:40px;height:1px;background:#8B4513;margin:20px auto;"></div>
      </div>

      <p style="color:#555;font-size:15px;line-height:1.8;margin:0 0 16px;font-family:'Helvetica Neue',sans-serif;">
        Your account is now active. You now have access to our curated collection of original artworks, handpicked from artists around the world.
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
        <tr>
          <td style="padding:6px;width:50%;">
            <div style="background:#f9f8f6;padding:20px;text-align:center;border-top:3px solid #C4A484;">
              <p style="margin:0;font-size:20px;">🖼️</p>
              <p style="margin:8px 0 0;color:#1a1a1a;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-family:'Helvetica Neue',sans-serif;font-weight:bold;">Browse Art</p>
              <p style="margin:4px 0 0;color:#999;font-size:11px;font-family:'Helvetica Neue',sans-serif;">Explore our gallery</p>
            </div>
          </td>
          <td style="padding:6px;width:50%;">
            <div style="background:#f9f8f6;padding:20px;text-align:center;border-top:3px solid #8B4513;">
              <p style="margin:0;font-size:20px;">⭐</p>
              <p style="margin:8px 0 0;color:#1a1a1a;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-family:'Helvetica Neue',sans-serif;font-weight:bold;">Save Favourites</p>
              <p style="margin:4px 0 0;color:#999;font-size:11px;font-family:'Helvetica Neue',sans-serif;">Build your wishlist</p>
            </div>
          </td>
        </tr>
      </table>

      <div style="text-align:center;margin:32px 0;">
        <a href="${frontendUrl}/products" style="display:inline-block;background:#8B4513;color:#ffffff;padding:16px 40px;text-decoration:none;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-family:'Helvetica Neue',sans-serif;font-weight:bold;">Explore the Gallery</a>
      </div>

      <p style="color:#bbb;font-size:12px;text-align:center;margin:24px 0 0;font-family:'Helvetica Neue',sans-serif;font-style:italic;">
        "Art enables us to find ourselves and lose ourselves at the same time."
      </p>
    `;

    await transporter.sendMail({
      from: `"Bristiii Gallery" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Welcome to Bristiii, ${userName}! 🎨`,
      html: emailWrapper(content, "#8B4513"),
    });
  } catch (error) {
    console.error("Welcome Email Error:", error);
    // Non-critical — don't throw
  }
};

// ─── 3. Order Confirmation Email — Premium, Invoice-Focused ──────────────────
const sendOrderConfirmationEmail = async (order, userEmail) => {
  try {
    const invoicePath = await generateInvoice(order);
    const frontendUrl = process.env.FRONTEND_URL || "https://bristiii-web.vercel.app";

    const itemRows = (order.orderItems || []).map(item => `
      <tr>
        <td style="padding:12px 8px;border-bottom:1px solid #f0ede8;font-family:'Helvetica Neue',sans-serif;">
          <span style="color:#1a1a1a;font-size:13px;">${item.title || item.name}</span><br/>
          <span style="color:#999;font-size:11px;">by ${item.artist || item.creator || "Unknown Artist"}</span>
        </td>
        <td style="padding:12px 8px;border-bottom:1px solid #f0ede8;text-align:right;font-family:'Helvetica Neue',sans-serif;">
          <span style="color:#1a1a1a;font-size:13px;font-weight:bold;">$${Number(item.price || 0).toLocaleString()}</span>
        </td>
      </tr>
    `).join("");

    const content = `
      <div style="text-align:center;padding:8px 0 32px;">
        <div style="font-size:40px;margin-bottom:16px;">✅</div>
        <p style="margin:0 0 4px;color:#9b8a77;font-size:10px;letter-spacing:5px;text-transform:uppercase;font-family:'Helvetica Neue',sans-serif;">Order Confirmed</p>
        <h1 style="margin:8px 0 0;color:#1a1a1a;font-size:26px;font-weight:300;letter-spacing:2px;">Your Acquisition is Secured</h1>
        <div style="width:40px;height:1px;background:#2C5F2E;margin:20px auto;"></div>
      </div>

      <p style="color:#555;font-size:15px;line-height:1.8;margin:0 0 24px;font-family:'Helvetica Neue',sans-serif;">
        Thank you for your order. We're preparing your artwork with the utmost care. Your invoice is attached to this email.
      </p>

      <!-- Order Details -->
      <div style="background:#f9f8f6;padding:20px;margin-bottom:24px;border-left:3px solid #2C5F2E;">
        <p style="margin:0 0 4px;color:#999;font-size:10px;letter-spacing:3px;text-transform:uppercase;font-family:'Helvetica Neue',sans-serif;">Order ID</p>
        <p style="margin:0;color:#1a1a1a;font-size:13px;font-family:'Courier New',monospace;">${order._id}</p>
      </div>

      <!-- Items Table -->
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:16px;">
        <tr>
          <th style="padding:10px 8px;background:#1a1a1a;color:#C4A484;font-size:9px;letter-spacing:3px;text-transform:uppercase;text-align:left;font-family:'Helvetica Neue',sans-serif;">Artwork</th>
          <th style="padding:10px 8px;background:#1a1a1a;color:#C4A484;font-size:9px;letter-spacing:3px;text-transform:uppercase;text-align:right;font-family:'Helvetica Neue',sans-serif;">Price</th>
        </tr>
        ${itemRows}
        <tr>
          <td style="padding:16px 8px;font-family:'Helvetica Neue',sans-serif;">
            <strong style="color:#1a1a1a;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Total</strong>
          </td>
          <td style="padding:16px 8px;text-align:right;font-family:'Helvetica Neue',sans-serif;">
            <strong style="color:#2C5F2E;font-size:18px;">$${Number(order.totalPrice || 0).toLocaleString()}</strong>
          </td>
        </tr>
      </table>

      <div style="text-align:center;margin:32px 0;">
        <a href="${frontendUrl}/orders" style="display:inline-block;background:#2C5F2E;color:#ffffff;padding:16px 40px;text-decoration:none;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-family:'Helvetica Neue',sans-serif;font-weight:bold;">View My Orders</a>
      </div>

      <div style="background:#f9f8f6;padding:16px 20px;text-align:center;">
        <p style="margin:0;color:#999;font-size:11px;font-family:'Helvetica Neue',sans-serif;">📎 Your invoice has been attached to this email.</p>
        <p style="margin:6px 0 0;color:#bbb;font-size:11px;font-family:'Helvetica Neue',sans-serif;">Questions? Reply to this email and our team will help you.</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Bristiii Gallery" <${process.env.EMAIL_USER || "no-reply@bristiii.com"}>`,
      to: userEmail,
      subject: `Order Confirmed ✅ — Your Artwork is on its Way`,
      html: emailWrapper(content, "#2C5F2E"),
      attachments: [
        {
          filename: `invoice-${order._id}.pdf`,
          path: invoicePath,
        },
      ],
    });

    console.log(`Order confirmation email sent to ${userEmail}`);
  } catch (error) {
    console.error("Order Confirmation Email Error:", error);
  }
};

module.exports = { sendOrderConfirmationEmail, sendResetPasswordEmail, sendWelcomeEmail };
