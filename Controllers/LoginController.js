const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../Model/UserModel");
const dotenv = require("dotenv");
const expressAsyncHandler = require("express-async-handler");
dotenv.config({ path: "./.env" });

// Create a new user
const createUser = expressAsyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  // Check if the user already exists in the database
  const existingUser = Users.filter((user) => user.email === email);
  console.log(existingUser.length);
  if (existingUser.length !== 0) {
    return res.status(400).json({ message: "User already exists" });
  }

  // const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: Users.length + 1,
    email,
    password,
    role,
  };

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
