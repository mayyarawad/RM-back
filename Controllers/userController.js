const { connectDB } = require("../DB.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sql = require("mssql");
require("dotenv").config();

// Sign IN Controller
// hello from the backend meroooo
// hello hammody you are my boss

async function signIn(req, res) {
  try {
    const { username, password } = req.body;

    const pool = await connectDB();

    const result = await pool
      .request()
      .input("Username", username)
      .query("SELECT * FROM Users WHERE Username = @Username");

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = result.recordset[0];

    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const roleMap = {
      1: { name: "Super Admin", key: process.env.SUPER_KEY },
      5: { name: "Service Admin", key: process.env.SERVICE_KEY },
      7: { name: "Booking Manager", key: process.env.BOOKING_KEY },
      9: { name: "Customer", key: process.env.CUSTOMERS_KEY },
      default: { name: "Guest", key: process.env.GUESTS_KEY },
    };

    const roleInfo = roleMap[user.Role] || roleMap.default;

    const payload = {
      id: user.ID,
      username: user.username,
      role: user.Role,
    };

    const token = jwt.sign(payload, roleInfo.key, { expiresIn: "1h" });

    res.json({
      message: "Login successful",
      token,
      expiresIn: "1h",
      user: {
        id: user.ID,
        username: user.username,
        role: user.Role,
        roleName: roleInfo.name,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error signing in", error: err.message });
  }
}

// get all users

async function getAllUsers(req, res) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({ message: "No token provided" });
  }
  
  try {
    const token = authorization.split(" ")[1];
    jwt.verify(token, process.env.SUPER_KEY);
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM Users");
    res.json(result.recordset);
  } catch (err) { 
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
}

// Registrition Controller

async function register(req, res) {
  try {
    const {
      First_Name,
      Last_Name,
      Username,
      Password,
      Phone,
      Mobile,
      Email,
      Address,
      Role,
      Status,
      ID_number,
      Profile_Picture,
      ID_Picture,
    } = req.body;

    const pool = await connectDB();

    const checkUser = await pool
      .request()
      .input("Username", sql.VarChar, Username)
      .query("SELECT * FROM Users WHERE Username = @Username");

    if (checkUser.recordset.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    await pool
      .request()
      .input("First_Name", sql.VarChar, First_Name)
      .input("Last_Name", sql.VarChar, Last_Name)
      .input("Username", sql.VarChar, Username)
      .input("Password", sql.VarChar, hashedPassword)
      .input("Phone", sql.VarChar, Phone)
      .input("Mobile", sql.VarChar, Mobile)
      .input("Email", sql.VarChar, Email)
      .input("Address", sql.VarChar, Address)
      .input("Role", sql.Int, Role)
      .input("Status", sql.Int, Status)
      .input("ID_number", sql.VarChar, ID_number)
      .input("Profile_Picture", sql.VarChar, Profile_Picture)
      .input("ID_Picture", sql.VarChar, ID_Picture)
      .query(
        `INSERT INTO Users 
          (First_Name, Last_Name, Username, Password, Phone, Mobile, Email, Address, Role, Status, ID_number, Profile_Picture, ID_Picture) 
         VALUES 
          (@First_Name, @Last_Name, @Username, @Password, @Phone, @Mobile, @Email, @Address, @Role, @Status, @ID_number, @Profile_Picture, @ID_Picture)`
      );

    const newUserResult = await pool
      .request()
      .input("Username", sql.VarChar, Username)
      .query("SELECT * FROM Users WHERE Username = @Username");

    const user = newUserResult.recordset[0];

    const roleMap = {
      1: { name: "Super Admin", key: process.env.SUPER_KEY },
      5: { name: "Service Admin", key: process.env.SERVICE_KEY },
      7: { name: "Booking Manager", key: process.env.BOOKING_KEY },
      9: { name: "Customer", key: process.env.CUSTOMERS_KEY },
      default: { name: "Guest", key: process.env.GUESTS_KEY },
    };

    const roleInfo = roleMap[user.Role] || roleMap.default;

    const payload = {
      id: user.ID,
      username: user.Username,
      role: user.Role,
    };

    const token = jwt.sign(payload, roleInfo.key, { expiresIn: "1h" });

    res.json({
      message: "Login successful",
      token,
      expiresIn: "1h",
      user: {
        id: user.ID,
        username: user.Username,
        role: user.Role,
        roleName: roleInfo.name,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
}

async function roleCheck(req, res) {
  const auth = req.headers.authorization;
  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.SERVICE_KEY);
    res.json({ message: "valid token", decoded });
  } catch (err) {
    res.status(401).json({ message: "invalid token", err });
  }
}

module.exports = { signIn, register, getAllUsers };
