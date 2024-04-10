const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const cors = require('cors');
const multer = require("multer");
const fileHandleMiddleware = require('../middlewares/fileHandleMiddleware');



const { registerUser, loginUser, getUserProfile, getImage } = userController; 

// Register a new user
// router.post('/users/register', registerUser);
router.use(cors({
    origin: [
      'http://localhost:3000'
    ],
    credentials: true
  }));
// Login
router.post('/users/login', loginUser);
router.post(
  "/register/user",
  fileHandleMiddleware.single("profilePic"),
  registerUser
);

// Get user profile by id
router.get('/users/profile/:id', getUserProfile);

// Update user profile
router.put('/users/editProfile/:id', getImage);

// In your route:
module.exports = router;
