const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../Model/UserModel");
const dotenv = require("dotenv");
const expressAsyncHandler = require("express-async-handler");
dotenv.config({ path: "./.env" });

// Create a new user
const createUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if the user already exists in the database
  const existingUser = await Users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user instance
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  // Save the user to the database
  Users.push(newUser);

  res.status(201).json({ message: "User created successfully" });
});

//get users
const getUsers = expressAsyncHandler(async (req, res) => {
  const users = await Users.find();
  res.status(200).json(users);
});

// Login route
const loginUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists in the database
  const user = Users.find((user) => user.email === email);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Compare the provided password with the hashed password in the database
  const isPasswordValid = password === user.password;
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate a JSON Web Token (JWT) for authentication
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);

  // Return the token to the client
  res.json({ user: user, token: token });
});

const verifyUser = expressAsyncHandler(async (req, res) => {
  // Get the token from the request headers
  const { token } = req.body;
  let isValid = false;

  if (!token) {
    res.json({ isValid });
  } else {
    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    // Find the user based on the decoded token

    if (await User.findById(decoded.userId)) {
      isValid = true;
    }

    res.json({ isValid });
  }
});

module.exports = { getUsers, createUser, loginUser, verifyUser };
