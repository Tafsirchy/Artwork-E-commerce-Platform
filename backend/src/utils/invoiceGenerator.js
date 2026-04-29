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

      // Header
      doc.fontSize(20).text("Bristiii Art Gallery", { align: "center" });
      doc.fontSize(10).text("Invoice", { align: "center" }).moveDown();

      // Order Info
      doc.text(`Order ID: ${order._id}`);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
      doc.moveDown();

      // Customer Info
      doc.text(`Customer Address: ${order.shippingAddress.address}`);
      doc.text(`Location: ${order.shippingAddress.city}, ${order.shippingAddress.country}`);
      doc.moveDown();

      // Table Header
      doc.fontSize(12).text("Items:");
      let y = doc.y + 10;
      doc.text("Title", 50, y);
      doc.text("Qty", 300, y);
      doc.text("Price", 400, y);
      
      y += 20;
      
      // Items
      order.orderItems.forEach(item => {
        doc.fontSize(10);
        doc.text(item.title, 50, y);
        doc.text(item.quantity.toString(), 300, y);
        doc.text(`$${item.price.toFixed(2)}`, 400, y);
        y += 20;
      });

      doc.moveDown();
      y += 20;
      doc.fontSize(14).text(`Total: $${order.totalPrice.toFixed(2)}`, 400, y);

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
