const bcrypt = require('bcrypt');
const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');
const jwt = require('jsonwebtoken');
const verifyToken = require('../config/auth')
const emailvalidator = require("email-validator");

const generateToken = (user) => {
  const payload = { email: user.email, password: user.password, user : user.id, image: user.profilePic };
  return jwt.sign(payload,  process.env.JWT_SECRET, { expiresIn: '24h' });
};


// Function to register a new user
const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, gender, hobbies, } = req.body;
  console.log('Received request body:', req.body); 
  // Check if the file is uploaded
  let profilePic = null;
  if (req.file) {
    profilePic = req.file.filename;
    console.log('Profile picture:', profilePic);
  }

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !gender ||
    !hobbies ||
    !profilePic
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    if (!emailvalidator.validate(email)) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters" });
    }

    // Checking if the user already exists
    const getAuther = await sequelize.query(
      `SELECT * FROM users WHERE email = '${email}'`,
      { type: QueryTypes.SELECT }
    );

    if (getAuther.length) {
      return res.status(400).json({ message: "email already exists" });
    }

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const roleName = "user";
    // Inserting data into the users database

    await sequelize.query(
      `INSERT INTO users (firstName, lastName, email, password, gender, hobbies, roleName, profilePic) VALUES ('${firstName}', '${lastName}', '${email}', '${hashedPassword}', '${gender}', '${hobbies}', '${roleName}', '${profilePic}')`,
      { type: QueryTypes.INSERT }
    );

    const getUser = await sequelize.query(
      `SELECT id FROM users WHERE email = '${email}'`,
      {
        type: QueryTypes.SELECT,
      }
    );

    const userId = getUser[0].userId;

    await sequelize.query(
      `INSERT INTO roles (roleName, userId) VALUES ('${roleName}', '${userId}')`,
      { type: QueryTypes.INSERT }
    );

    return res.status(200).json({ message: "success" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// Function to login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [existingUser] = await sequelize.query('SELECT * FROM users WHERE email = ?',
      { replacements: [email], type: QueryTypes.SELECT });

    if (existingUser) {
      const user = existingUser;
      console.log(user);

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        const token = generateToken(user);
        return res.status(200).send({ message: 'Login success!', token: token });
      } else {
        return res.status(401).send({ message: 'Incorrect password!' });
      }
    } else {
      return res.status(404).send({ message: 'Email not found! Sign up!' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'Error in login check api!',
      error
    });
  }
};

// Function to get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(`userId: ${userId}`);
    const user = await sequelize.query(
      'SELECT * FROM users WHERE id = ?', {
      replacements: [userId],
      type: sequelize.QueryTypes.SELECT
    })

    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user[0]);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getImage = async (req, res) => {
}

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getImage
};
