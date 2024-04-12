const { QueryTypes } = require('sequelize');
const { sequelize } = require('../config/database');



const createProduct = async (req, res) => {
  try {
    const { name, description, categoryId, price, images } = req.body;

    const result = await sequelize.query(
      'INSERT INTO product (name, description, categoryId, price, images) VALUES (?, ?, ?, ?, ?)',
      {
        replacements: [name, description, categoryId, price, images],
        type: QueryTypes.INSERT
      }
    );

    res.json({ message: 'Product created!', id: result[0] });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to get all products
const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const offset = (page - 1) * pageSize;

    const products = await sequelize.query(
      `SELECT * FROM product LIMIT ${pageSize} OFFSET ${offset}`,
      { type: QueryTypes.SELECT }
    );
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Function to get a specific product by ID
const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log(productId);
    const product = await sequelize.query(
      'SELECT * FROM product WHERE productId = ?',
      { replacements: [productId], type: QueryTypes.SELECT }
    );
    if (product.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to update a product


// const updateProduct = async (req, res) => {
//   // Destructure product details from the request body
//   const { productName, productDesc, price, categoryId} = req.body;

//   // Get productId from the request parameters
//   const { productId } = req.params;

//   const images = req.files
//     ? req.files.map((file) => file.filename)
//     : null;

   
//   // Get userId from the request user object
//   const { id } = req.user;

//   console.log(req.body);
//   const createdby = id

//   // Validate required fields
//   if (!productName ||!productDesc ||!price ||!categoryId) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   try {
//     // Check if the product exists
//     const product = await product.findOne({
//       where: {
//         productId,
//         createdby,
//       },
//     });

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // Find or create category
//     const category = await category.findOne({
//       where: {
//         categoryId,
//         createdby,
//       },
//     });

//     let categoryIdToUse = category?.categoryId;

//     // Create new category if not found
//     if (!categoryIdToUse) {
//       const newCategory = await category.create({
//         categoryname: categoryname,
//         createdby,
//       });
//       categoryIdToUse = newCategory.categoryId;
//     }

//     // Update product
//     await product.update(
//       {
//         name: productName,
//         description: productDesc,
//         categoryId: categoryIdToUse,
//         price: price,
//         images: JSON.stringify(images),
//       },
//       {
//         where: {
//           productId: productId,
//           createdby: createdby,
//         },
//       }
//     );

//     return res.status(200).json({ message: "success" });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

const updateProduct = async (req, res) => {

  console.log("Update Controller")
  //Get the product details from the request
  const { productName, productDesc, productPrice, categoryName } = req.body;
  
  // Get product images from the request
  const images = req.files
    ? req.files.map((file) => file.filename)
    : null;

  //Get the productId from the request
  const { productId } = req.params;

  //Get the userId from the request


   console.log(req.body);
     const createdBy = req.user.user;
     console.log(req.user);

  console.log("createdBy", createdBy);

  //Get the role of the user from  the request
  const userRole = req.user.roleName;

  if (!productId|| !productName || !productDesc || !productPrice || !categoryName || !images ) {
    console.log("here");
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    console.log("try");
    const [product] = await sequelize.query(
      `SELECT * FROM product WHERE productId = :productId`,
      {
        replacements: { productId },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    console.log("product", product);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (userRole !== "admin" && product.createdBy !== createdBy) {
      console.log(userRole);
      return res.status(403).json({ message: "Not Authorized" });
    }

    // Find or create category
    const [category] = await sequelize.query(
      `SELECT categoryId FROM category WHERE categoryname = :categoryName AND createdBy = :createdBy`,
      {
        replacements: { categoryName, createdBy },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // let categoryId = category?.categoryId;

    // Create new category if not found
    // if (!categoryId) {
    //   const [newCategory] = await sequelize.query(
    //     `INSERT INTO category (categoryName, createdBy) VALUES (:categoryName, :createdBy) RETURNING categoryId`,
    //     {
    //       replacements: { categoryName, createdBy },
    //       type: sequelize.QueryTypes.INSERT,
    //     }
    //   );
    //   categoryId = newCategory?.categoryId;
    // }

    // Update product
    await sequelize.query(
      console.log("qurey")
      `UPDATE product SET name = :productName, description = :productDesc, price = :productPrice, images = :images WHERE productId = :productId`,
      {
        replacements: {
          productName,
          productDesc,
          productPrice,
          images: JSON.stringify(images),
          productId,
        },
        type: sequelize.QueryTypes.UPDATE,
        
      }
    );

    return res.status(200).json({ message: "success" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



// Function to delete a product
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    console.log(productId );
    await sequelize.query(
      'DELETE FROM product WHERE productId = ?',
      { replacements: [productId], type: QueryTypes.DELETE }
    );
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const searchProducts = async (req, res) => {
  try {
    const { name } = req.query;
    console.log(name);
    if (!name) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const products = await sequelize.query(
      `SELECT p.*, c.categoryName AS categoryName
       FROM product p
       LEFT JOIN category c ON p.categoryId = c.id
       WHERE LOWER(p.name) LIKE :query
         OR LOWER(p.description) LIKE :query
         OR CAST(p.categoryId AS CHAR) LIKE :query
         OR CAST(p.price AS CHAR) LIKE :query`,
      {
        replacements: { query: `%${name.toLowerCase()}%` },
        type: QueryTypes.SELECT,
      }
    );

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, searchProducts };