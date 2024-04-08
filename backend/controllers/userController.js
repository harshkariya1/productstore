const bcrypt = require('bcrypt');
const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');
const jwt = require('jsonwebtoken');
const verifyToken = require('../config/auth')

const generateToken = (user) => {
  const payload = { email: user.email, password: user.password };
  return jwt.sign(payload, 'crud', { expiresIn: '24h' });
};


// Function to register a new user
const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, gender, hobbies, userRole } = req.body;
  let profilePic = null;

  if (req.file) {
    profilePic = req.file.filename;
  }

  try {
    // Validate request body
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }

    // Check if user with the same email already exists
    const existingUser = await sequelize.query(
      "SELECT * FROM users WHERE email = :email",
      {
        replacements: { email },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ error: "User with this email already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const result = await sequelize.query(
      'INSERT INTO users (firstName, lastName, email, password, gender, hobbies, userRole, profile_pic) VALUES (:firstName, :lastName, :email, :hashedPassword, :gender, :hobbies, :userRole, :profile_pic)',
      {
        replacements: {
          firstName,
          lastName,
          email,
          hashedPassword,
          gender,
          hobbies,
          userRole,
          profile_pic: profilePic || null,
        },
        type: Sequelize.QueryTypes.INSERT,
      }
    );

    // Close the database connection
    await sequelize.close();

    res.json({ message: `User created!` });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
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
