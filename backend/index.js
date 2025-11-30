// const express = require('express');
// const mysql = require('mysql2');
// const cors = require('cors');
// const multer = require('multer');
// const path = require('path');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // SERVE STATIC IMAGES
// app.use('/images', express.static('images'));

// // Database Connection
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'oshodhara', // Your Password
//     database: 'food_app'
// });

// db.connect(err => {
//     if (err) console.log('DB Error: ' + err);
//     else console.log('Connected to MySQL');
// });

// // Multer Configuration (For Image Uploads)
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'images') 
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname))
//     }
// })

// const upload = multer({ storage: storage });

// // --- ROUTES ---

// // 1. GET ALL DISHES
// app.get('/dishes', (req, res) => {
//     const sql = "SELECT * FROM dishes";
//     db.query(sql, (err, data) => {
//         if(err) return res.json(err);
//         return res.json(data);
//     });
// });

// // 2. CREATE DISH
// app.post('/create', upload.single('image'), (req, res) => {
//     const sql = "INSERT INTO dishes (`name`, `price`, `description`, `image_url`) VALUES (?)";
//     const image_filename = req.file ? req.file.filename : ""; 

//     const values = [
//         req.body.name, 
//         req.body.price, 
//         req.body.description, 
//         image_filename 
//     ];

//     db.query(sql, [values], (err, data) => {
//         if(err) return res.json("Error");
//         return res.json(data);
//     });
// });

// // 3. DELETE DISH
// app.delete('/delete/:id', (req, res) => {
//     const sql = "DELETE FROM dishes WHERE id = ?";
//     db.query(sql, [req.params.id], (err, data) => {
//         if(err) return res.json(err);
//         return res.json(data);
//     });
// });

// // 4. FEEDBACK ROUTE (New)
// app.post('/feedback', (req, res) => {
//     const sql = "INSERT INTO feedback (`name`, `email`, `message`) VALUES (?)";
//     const values = [req.body.name, req.body.email, req.body.message];

//     db.query(sql, [values], (err, data) => {
//         if(err) return res.json("Error");
//         return res.json({status: "Success", message: "Feedback received!"});
//     });
// });

// // --- START SERVER (Only once at the bottom) ---
// app.listen(8081, () => {
//     console.log("Backend running on 8081");
// });


require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// --- CREATE IMAGES FOLDER IF DOESN'T EXIST (IMPORTANT for Render) ---
const imagesDir = path.join(__dirname, "images");
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
}

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN || "*"
}));
app.use(express.json());

// Serve static images
app.use("/images", express.static(imagesDir));

// DB CONNECTION (Render environment variables)
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: true }
});


db.connect(err => {
    if (err) {
        console.log(" DB Connection Error:", err);
    } else {
        console.log("Connected to MySQL");
    }
});

// Multer (file upload)
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, imagesDir),
    filename: (req, file, cb) =>
        cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// --- ROUTES ---

// GET all dishes
app.get("/dishes", (req, res) => {
    db.query("SELECT * FROM dishes", (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
});

// GET one dish
app.get("/dishes/:id", (req, res) => {
    db.query("SELECT * FROM dishes WHERE id = ?", [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        if (!data.length) return res.status(404).json({ message: "Not found" });
        res.json(data[0]);
    });
});

// CREATE dish
app.post("/create", upload.single("image"), (req, res) => {
    const sql =
        "INSERT INTO dishes (`name`, `price`, `description`, `image_url`) VALUES (?)";

    const imageName = req.file ? req.file.filename : "";

    const values = [
        req.body.name,
        req.body.price,
        req.body.description,
        imageName,
    ];

    db.query(sql, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        res.json({ id: data.insertId });
    });
});

// UPDATE dish
app.put("/update/:id", upload.single("image"), (req, res) => {
    const getSql = "SELECT image_url FROM dishes WHERE id = ?";
    db.query(getSql, [req.params.id], (err, rows) => {
        if (err) return res.status(500).json(err);
        if (!rows.length) return res.status(404).json({ message: "Not found" });

        const oldImage = rows[0].image_url;
        const newImage = req.file ? req.file.filename : oldImage;

        const updateSql =
            "UPDATE dishes SET name=?, price=?, description=?, image_url=? WHERE id=?";
        const values = [
            req.body.name,
            req.body.price,
            req.body.description,
            newImage,
            req.params.id,
        ];

        db.query(updateSql, values, (err2, data2) => {
            if (err2) return res.status(500).json(err2);
            res.json({ affectedRows: data2.affectedRows });
        });
    });
});

// DELETE dish
app.delete("/delete/:id", (req, res) => {
    db.query("DELETE FROM dishes WHERE id = ?", [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        res.json({ affectedRows: data.affectedRows });
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
app.listen(PORT, () => {
    console.log(" Backend running on port " + PORT);
});
