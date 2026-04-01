const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Note = require("../models/Note");

const TEST_JWT_SECRET = "test-jwt-secret-for-testing";

const createTestUser = async (overrides = {}) => {
  const defaults = {
    name: "Test User",
    email: "test@example.com",
    password: await bcrypt.hash("password123", 4),
  };
  return User.create({ ...defaults, ...overrides });
};

const generateTestToken = (userId) =>
  jwt.sign({ userId: userId.toString() }, TEST_JWT_SECRET, {
    expiresIn: "1d",
  });

const createTestNote = async (userId, overrides = {}) => {
  const defaults = {
    title: "Test Note",
    content: "<p>Test content</p>",
    color: "yellow",
    userId,
  };
  return Note.create({ ...defaults, ...overrides });
};

module.exports = {
  TEST_JWT_SECRET,
  createTestUser,
  generateTestToken,
  createTestNote,
};
