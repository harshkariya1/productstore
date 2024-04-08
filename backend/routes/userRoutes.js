const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const cors = require('cors');


const { registerUser, loginUser, getUserProfile, getImage } = userController; 

// Register a new user
router.post('/users/register', registerUser);
router.use(cors({
    origin: [
      'http://localhost:3000'
    ],
    credentials: true
  }));
// Login
router.post('/users/login', loginUser);

// Get user profile by id
router.get('/users/profile/:id', getUserProfile);

// Update user profile
router.put('/users/editProfile/:id', getImage);
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// In your route:
router .post("/register", upload.single("profilePic"), registerUser);
module.exports = router;
