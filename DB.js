const sql = require("mssql");
require("dotenv").config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

let counter = 0;

async function connectDB() {
  try {
    let pool = await sql.connect(config);
    counter++;
    console.log("✅ Connected to SQL Server " + counter);
    return pool;
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }
}

module.exports = { sql, connectDB };
