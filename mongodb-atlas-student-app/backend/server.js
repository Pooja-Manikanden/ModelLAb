
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const studentSchema = new mongoose.Schema({
    name: String,
    registerNumber: String,
    department: String
});

const Student = mongoose.model("Student", studentSchema);

app.get("/", (req, res) => {
    res.send("MongoDB Atlas Student App is running!");
});

app.post("/students", async (req, res) => {
    try {
        const student = await Student.create(req.body);
        res.status(201).json(student);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get("/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Atlas connected successfully!");
        app.listen(5000, () => {
            console.log("Server running at http://localhost:5000");
        });
    })
    .catch(error => {
        console.log("MongoDB connection failed:", error.message);
    });
