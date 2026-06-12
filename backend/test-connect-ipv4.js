const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');

// Force IPv4-first resolution
try {
  dns.setDefaultResultOrder('ipv4first');
  console.log("Set default DNS result order to IPv4 first.");
} catch (error) {
  console.warn("Could not set default result order:", error);
}

// Override DNS servers
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (error) {
  console.warn('[MongoDB] Warning: Could not set custom DNS servers:', error);
}

dotenv.config();

const uri = process.env.MONGODB_URI;
console.log("URI to connect:", uri);

console.log("Connecting to MongoDB Atlas...");
mongoose.connect(uri)
  .then(() => {
    console.log("SUCCESS: Connected successfully via Mongoose using IPv4 first!");
    process.exit(0);
  })
  .catch(err => {
    console.error("FAILED to connect via Mongoose:", err);
    process.exit(1);
  });
