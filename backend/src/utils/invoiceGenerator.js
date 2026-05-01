const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInvoice = (order) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      
      const invoicesDir = path.join(__dirname, "../../invoices");
      if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true });
      }

      const invoicePath = path.join(invoicesDir, `invoice-${order._id}.pdf`);
      const stream = fs.createWriteStream(invoicePath);
      doc.pipe(stream);

      // Draw Border
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke("#C8A96A");
      doc.rect(25, 25, doc.page.width - 50, doc.page.height - 50).stroke("#C8A96A");

      // Header Art
      doc.fillColor("#1A1A1A").fontSize(26).text("BRISTIII", { align: "center", characterSpacing: 5 });
      doc.fontSize(10).text("PRIVATE ARCHIVE & GALLERY", { align: "center", characterSpacing: 3 }).moveDown(2);

      // Certificate Label
      doc.fillColor("#C8A96A").fontSize(14).text("CERTIFICATE OF ACQUISITION", { align: "center", characterSpacing: 2 }).moveDown(2);

      // Order Info Section
      doc.fillColor("#1A1A1A").fontSize(10);
      doc.text(`REGISTRATION ID: #${order._id.toUpperCase()}`, 50, 180);
      doc.text(`ACQUISITION DATE: ${new Date(order.createdAt).toLocaleDateString()}`, 50, 195);
      
      doc.moveTo(50, 215).lineTo(doc.page.width - 50, 215).stroke("#EEE");

      // Customer Info
      doc.text("CONSIGNED TO:", 50, 235, { characterSpacing: 1 });
      doc.fontSize(12).text(order.shippingAddress.address.toUpperCase(), 50, 255);
      doc.fontSize(10).text(`${order.shippingAddress.city}, ${order.shippingAddress.country}`.toUpperCase(), 50, 275);
      doc.moveDown(3);

      // Table Header
      let y = 320;
      doc.fontSize(9).fillColor("#999").text("MASTERPIECE TITLE", 50, y, { characterSpacing: 1 });
      doc.text("QTY", 350, y);
      doc.text("INVESTMENT", 450, y);
      
      doc.moveTo(50, y + 15).lineTo(doc.page.width - 50, y + 15).stroke("#C8A96A");
      y += 30;
      
      // Items
      order.orderItems.forEach(item => {
        doc.fillColor("#1A1A1A").fontSize(11);
        doc.text(item.title.toUpperCase(), 50, y, { width: 280 });
        doc.text(item.quantity.toString(), 350, y);
        doc.text(`$${item.price.toFixed(2)}`, 450, y);
        y += 35;
      });

      // Total Section
      doc.moveTo(300, y).lineTo(doc.page.width - 50, y).stroke("#EEE");
      y += 20;
      doc.fontSize(14).fillColor("#1A1A1A").text("TOTAL INVESTMENT", 300, y);
      doc.fillColor("#C8A96A").text(`$${order.totalPrice.toFixed(2)}`, 450, y);

      // Authenticity Seal (Bottom Right)
      const sealY = doc.page.height - 150;
      doc.circle(doc.page.width - 100, sealY, 40).stroke("#C8A96A");
      doc.fontSize(8).fillColor("#C8A96A").text("CURATOR'S EYE", doc.page.width - 135, sealY - 5, { align: "center", width: 70 });
      doc.text("VERIFIED", doc.page.width - 135, sealY + 5, { align: "center", width: 70 });

      // Footer
      doc.fontSize(8).fillColor("#999").text("THIS DOCUMENT SERVES AS AN OFFICIAL RECORD OF OWNERSHIP WITHIN THE BRISTIII ARCHIVES.", 50, doc.page.height - 60, { align: "center", width: doc.page.width - 100 });

      doc.end();

      stream.on("finish", () => {
        resolve(invoicePath);
      });
      stream.on("error", (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generateInvoice };
