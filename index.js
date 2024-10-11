import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const mongoURI = "mongodb://localhost:27017/test";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((error) => console.log("MongoDB connection error:", error));

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: true },
});

const User = mongoose.model("User", userSchema);

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

app.get("/api/users", async (req, res) => {
    try {
      const users = await User.find(); // Fetch all users from MongoDB
      res.status(200).json({ message: "Fetching all users", data: users });
    } catch (error) {
      res.status(500).json({ message: "An error occurred", error: error.message });
    }
  });

app.post("/api/users", async (req, res) => {
    try {
      const { name, email, age } = req.body;
      const newUser = new User({ name, email, age });
      await newUser.save();
      res.status(201).json({ message: "New user created!", data: newUser });
    } catch (error) {
      res.status(500).json({ message: "An error occurred", error: error.message });
    }
  });

app.put("/api/users/:id", async (req, res) => {
    try {
      const userId = req.params.id;
      const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
      if (updatedUser) {
        res.status(200).json({ message: `Updating user ${userId}`, data: updatedUser });
      } else {
        res.status(404).json({ message: `User with ID ${userId} not found` });
      }
    } catch (error) {
      res.status(500).json({ message: "An error occurred", error: error.message });
    }
  });

app.delete("/api/users/:id", async (req, res) => {
    try {
      const userId = req.params.id;
      const deletedUser = await User.findByIdAndDelete(userId);
      if (deletedUser) {
        res.status(200).json({ message: `Deleting user ${userId}`, deletedUser });
      } else {
        res.status(404).json({ message: `User with ID ${userId} not found` });
      }
    } catch (error) {
      res.status(500).json({ message: "An error occurred", error: error.message });
    }
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
