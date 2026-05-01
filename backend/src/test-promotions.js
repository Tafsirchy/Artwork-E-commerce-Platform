const Promotion = require('./models/Promotion');
const mongoose = require('mongoose');
require('dotenv').config();

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");
  try {
    const promotions = await Promotion.find({});
    console.log("Found promotions:", promotions.length);
    console.log(JSON.stringify(promotions, null, 2));
  } catch (e) {
    console.error("Error fetching promotions:", e.message);
  } finally {
    await mongoose.disconnect();
  }
}

test();
