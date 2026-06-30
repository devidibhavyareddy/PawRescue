import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const isGmail = (email) => {
  return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(
    email.trim()
  );
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!isGmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please register with a valid Gmail address",
      });
    }

    const passwordPattern =
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

    if (!passwordPattern.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long and include letters and numbers",
      });
    }

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(
        user._id,
        user.role
      ),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (
      user &&
      (await bcrypt.compare(
        password,
        user.password
      ))
    ) {
      return res.status(200).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(
          user._id,
          user.role
        ),
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProfile = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.user.id
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};