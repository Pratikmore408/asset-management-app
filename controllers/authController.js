import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import { generateToken } from "../config/jwt.js";

// Signup controller
export const signup = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      username,
      password: hashedPassword, // Save the hashed password
      email,
    });

    await user.save();

    const token = generateToken(user);
    res.json({ message: "User created successfully", token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login controller
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
