const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateInvoice = (order) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        margin: 50,
        size: 'A4'
      });
      
      const invoicesDir = path.join(__dirname, "../../invoices");
      if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true });
      }

      const invoicePath = path.join(invoicesDir, `invoice-${order._id}.pdf`);
      const stream = fs.createWriteStream(invoicePath);
      doc.pipe(stream);

      // --- HEADER ---
      doc.fillColor("#1A1A1A")
         .fontSize(28)
         .font("Helvetica-Bold")
         .text("BRISTIII", { align: "center" });
      
      doc.fontSize(8)
         .font("Helvetica")
         .fillColor("#999999")
         .text("A MODERN ART ARCHIVE", { align: "center", characterSpacing: 4 })
         .moveDown(4);

      // --- INFO BLOCK ---
      const infoY = 160;
      
      // Left: Invoice Details
      doc.fillColor("#1A1A1A")
         .fontSize(8)
         .font("Helvetica-Bold")
         .text("ACQUISITION RECORD", 50, infoY);
      
      doc.font("Helvetica")
         .fillColor("#666666")
         .text(`ID: #${order._id.toString().toUpperCase()}`, 50, infoY + 15)
         .text(`DATE: ${new Date(order.createdAt).toLocaleDateString()}`, 50, infoY + 28);

      // Right: Collector Details
      doc.fillColor("#1A1A1A")
         .font("Helvetica-Bold")
         .text("COLLECTOR", 350, infoY);
      
      doc.font("Helvetica")
         .fillColor("#666666")
         .text(order.shippingAddress.address, 350, infoY + 15, { width: 180 })
         .text(`${order.shippingAddress.city}, ${order.shippingAddress.country}`, 350, doc.y + 2);

      doc.moveDown(6);

      // --- TABLE ---
      let currentY = 280;
      
      // Table Header Line
      doc.strokeColor("#1A1A1A")
         .lineWidth(1)
         .moveTo(50, currentY)
         .lineTo(550, currentY)
         .stroke();

      doc.fillColor("#1A1A1A")
         .font("Helvetica-Bold")
         .fontSize(8)
         .text("ARTWORK", 60, currentY + 10)
         .text("QTY", 400, currentY + 10, { width: 30, align: 'center' })
         .text("PRICE", 450, currentY + 10, { width: 90, align: 'right' });

      currentY += 35;

      // Table Content
      order.orderItems.forEach((item) => {
        doc.fillColor("#1A1A1A")
           .font("Helvetica")
           .fontSize(10)
           .text(item.title || item.name, 60, currentY);
        
        doc.fontSize(9)
           .text(item.quantity.toString(), 400, currentY, { width: 30, align: 'center' });
        
        doc.text(`$${item.price.toFixed(2)}`, 450, currentY, { width: 90, align: 'right' });

        currentY += 30;
        
        // Subtle divider
        doc.strokeColor("#EEEEEE")
           .lineWidth(0.5)
           .moveTo(50, currentY - 5)
           .lineTo(550, currentY - 5)
           .stroke();
      });

      // --- SUMMARY ---
      currentY += 20;
      doc.fillColor("#666666")
         .font("Helvetica")
         .fontSize(9)
         .text("TOTAL INVESTMENT", 350, currentY, { align: "right", width: 90 });
      
      doc.fillColor("#1A1A1A")
         .font("Helvetica-Bold")
         .fontSize(16)
         .text(`$${order.totalPrice.toFixed(2)}`, 450, currentY - 5, { align: "right", width: 90 });

      // --- FOOTER ---
      doc.fillColor("#CCCCCC")
         .fontSize(7)
         .font("Helvetica")
         .text("OFFICIAL ARCHIVE DOCUMENT • BRISTIII ART GALLERY", 50, 780, { align: "center", width: 500 });

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
