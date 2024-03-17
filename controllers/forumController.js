const Forum = require("../models/Forum");

exports.createForumPost = async (req, res) => {
  try {
    const newForum = new Forum(req.body); // Corrected variable name
    const savedForum = await newForum.save(); // Corrected variable name
    res.status(201).json(savedForum);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Get all forum posts
exports.getAllForumPosts = async (req, res) => {
  try {
    const forumPosts = await Forum.find().sort({ createdAt: -1 });
    res.json(forumPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single forum post
exports.getForumPost = async (req, res) => {
  try {
    const forumPost = await Forum.findById(req.params.id);
    if (!forumPost) {
      return res.status(404).json({ message: "Forum post not found" });
    }
    res.json(forumPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a forum post
exports.updateForumPost = async (req, res) => {
  try {
    const updatedForumPost = await Forum.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedForumPost) {
      return res.status(404).json({ message: "Forum post not found" });
    }
    res.json(updatedForumPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a forum post
exports.deleteForumPost = async (req, res) => {
  try {
    const deletedForumPost = await Forum.findByIdAndDelete(req.params.id);
    if (!deletedForumPost) {
      return res.status(404).json({ message: "Forum post not found" });
    }
    res.json({ message: "Forum post deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
