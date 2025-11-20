import express from "express";
import mongoose from "mongoose";
import Post from "./models/Post.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Could not connect to MongoDB", err));
    
app.get("/posts", async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        res.status(500).json("Error fetching posts");
    }
});


app.post("/addpost", async (req, res) => {
    try {
        const { title, content } = req.body;
        const newPost = new Post({ title, content });
        await newPost.save();
        res.status(201).send("Post added successfully");
    } catch (error) {
        res.status(500).send("Error adding post");
    }
});

app.delete("/deletepost/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPost = await Post.findByIdAndDelete(id);
        if (!deletedPost) return res.json("Post not found");
        res.json({ message: "Post deleted successfully", deletedPost });
    } catch (error) {
        res.status(500).json("Error deleting post");
    }
});

app.patch("/post/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        res.json({ message: "Post updated successfully", updatedPost });
    } catch (error) {
        res.status(500).json("Error updating post");
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});