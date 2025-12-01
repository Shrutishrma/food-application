require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const { storage } = require("./config/cloudinary");
const upload = multer({ storage });
const app = express();

// CORS middleware
const allowedOrigins = [
    "http://localhost:5173",
    "https://foodiee-application.netlify.app"
];

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Requested-With, Accept"
    );

    if (req.method === "OPTIONS") return res.sendStatus(200);
    next();
});

app.use(express.json());

// Root test route
app.get("/", (req, res) => {
    res.send("Foodie Backend is Running 🚀");
});

// DATABASE CONNECTION + SSL FIX
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync(path.join(__dirname, "config", "ca.pem")),
    },
    enableKeepAlive: true
});


// GET all dishes
app.get("/dishes", (req, res) => {
    db.query("SELECT * FROM dishes", (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
});

// Get single dish
app.get("/dishes/:id", (req, res) => {
    db.query("SELECT * FROM dishes WHERE id = ?", [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        if (!data.length) return res.status(404).json({ message: "Dish not found" });
        res.json(data[0]);
    });
});

// CREATE dish — Cloudinary
app.post("/create", upload.single("image"), (req, res) => {
    const { name, price, description } = req.body;
    const image_url = req.file?.path || null;

    const sql = "INSERT INTO dishes (`name`, `price`, `description`, `image_url`) VALUES (?)";
    const values = [name, price, description, image_url];

    db.query(sql, [values], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json({ id: results.insertId, message: "Dish added successfully!" });
    });
});

// UPDATE dish
app.put("/update/:id", upload.single("image"), (req, res) => {
    const { name, price, description } = req.body;
    const newImage = req.file?.path || null;

    db.query("SELECT image_url FROM dishes WHERE id = ?", [req.params.id], (err, rows) => {
        if (err) return res.status(500).json(err);
        if (!rows.length) return res.status(404).json({ message: "Dish not found" });

        const finalImage = newImage || rows[0].image_url;

        const sql = "UPDATE dishes SET name=?, price=?, description=?, image_url=? WHERE id=?";
        db.query(sql, [name, price, description, finalImage, req.params.id], (err2) => {
            if (err2) return res.status(500).json(err2);
            res.json({ success: true, message: "Dish updated successfully!" });
        });
    });
});

// DELETE dish
app.delete("/delete/:id", (req, res) => {
    db.query("DELETE FROM dishes WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true, message: "Dish deleted" });
    });
});

// FEEDBACK
app.post("/feedback", (req, res) => {
    const sql = "INSERT INTO feedback (`name`, `email`, `message`) VALUES (?)";
    const values = [req.body.name, req.body.email, req.body.message];

    db.query(sql, [values], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ status: "success", message: "Feedback received!" });
    });
});

// START SERVER
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
