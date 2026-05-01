const { MongoClient } = require('mongodb');

async function test() {
  const uri = "mongodb://useproxynow_db_user:OkNsy7Ftms9Co5Iq@ac-t04igfo-shard-00-00.thctv2s.mongodb.net:27017,ac-t04igfo-shard-00-01.thctv2s.mongodb.net:27017,ac-t04igfo-shard-00-02.thctv2s.mongodb.net:27017/bristiii?ssl=true&authSource=admin&retryWrites=true&w=majority";
  console.log("Testing connection to Standard URI...");
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected successfully!");
  } catch (e) {
    console.error("Connection failed:", e.message);
  } finally {
    await client.close();
  }
}

test();
