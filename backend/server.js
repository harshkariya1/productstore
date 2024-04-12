const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const { sequelize, testConnection } = require('./config/database');
const cors = require('cors');
const path=  require("path") 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


app.use("/assets", express.static(path.join(__dirname, "/public/assets/profilePics/")))
// Test the database connection
testConnection()
  .then(() => {
    // Routes
    app.use('/api', userRoutes);
    app.use('/api', categoryRoutes);
    app.use('/api', productRoutes);

    
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('Something went wrong!');
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to start server:', err);
  });
