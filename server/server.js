const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const noteSchema = new mongoose.Schema({
    title: String,
    content: String,
    date: String,
    email: String
});

const Note = mongoose.model("Note", noteSchema);

// CREATE NOTE
app.post("/notes", async (req, res) => {

    console.log(req.body);

    try {
        const note = new Note(req.body);
        await note.save();
        res.status(201).json(note);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// GET NOTES
app.get("/notes/:email", async (req, res) => {

    try {

        const notes = await Note.find({
            email: req.params.email
        });

        res.json(notes);

    } catch(err) {

        res.status(500).json({
            error: err.message
        });

    }
});

// DELETE NOTE
app.delete("/notes/:id", async (req, res) => {

    try {

        await Note.findByIdAndDelete(req.params.id);

        res.json({
            message: "Note deleted"
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

const User = mongoose.model("User", userSchema);


// SIGNUP
app.post("/signup", async (req, res) => {
    console.log("Signup Request:", req.body);

    try {

        const existingUser = await User.findOne({
            email: req.body.email
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const user = new User(req.body);

        await user.save();

        res.status(201).json({
            message: "Signup successful"
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

// LOGIN
app.post("/login", async (req, res) => {

    try {

        const user = await User.findOne({
            email: req.body.email,
            password: req.body.password
        });

        if (!user) {

            return res.status(401).json({
                message: "Invalid credentials"
            });

        }

        res.json({
            message: "Login successful"
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});


// GET PROFILE
app.get("/profile/:email", async (req, res) => {

    try {

        const user = await User.findOne({
            email: req.params.email
        });

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        res.json(user);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

app.get("/test", (req, res) => {
    res.send("Backend working");
});

// UPDATE NOTE
app.put("/notes/:id", async (req, res) => {

    try {

        const updatedNote = await Note.findByIdAndUpdate(

            req.params.id,

            req.body,

            { new: true }

        );

        res.json(updatedNote);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

app.listen(5001, () => {
    console.log("Server running on port 5001");
});