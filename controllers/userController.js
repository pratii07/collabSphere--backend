const User = require("../models/userSchema");

// Signup Controller
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const newUser = new User({
      name,
      email,
      password,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error("Error hai signup me", err);
    res.status(500).json({ error: "server error" });
  }
};

// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.password !== password)
      return res.status(400).json({ message: "Invalid password" });

    res.status(200).json({ message: "Login successful", user });
    
  } catch (err) {
    console.error("Error hai login me", err);
    res.status(500).json({ error: "server error" });
  }
};

// Get All Users Controller
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name email"); // only return name + email
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users", err);
    res.status(500).json({ error: "server error" });
  }
};