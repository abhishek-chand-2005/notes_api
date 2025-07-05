const express = require('express' );
const mongoose = require("mongoose");
const Note = require("./models/Note");

const app = express();
const PORT = process.env.PORT || 3000;

require("dotenv").config();
mongoose.connect(process.env.MONGO_URI)

app.use(express.json());

let notes = [];


// GET: all notes
app.get("/notes", async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

// POST: create note
app.post("/notes", async (req, res) => {
  try {
    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


app.get('/notes', (req, res)=>{
    res.json(notes);
});
 

// DELETE: delete note
app.delete("/notes/:id", async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// PATCH: update note
app.patch("/notes/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// ✅ Schema to store login data
const LoginSchema = new mongoose.Schema({
    email: String,
    password: String,
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Login = mongoose.model("Login", LoginSchema);

// ✅ Route to save login form data
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const newLogin = new Login({ email, password });
        await newLogin.save();
        res.json({ message: 'Login data saved ✅' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '❌ Failed to save login data' });
    }
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection failed:", err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});