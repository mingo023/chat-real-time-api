import Product from '../models/product';
import { set } from 'mongoose';

const ProductController = {};

// get all users from database
ProductController.getAll = async (req, res) => {
  try {
    await Product.find().sort('-dateAdded').exec((err, product) => {
      if (err) {
        res.status(500).send(err);
      }
      return res.json({
        product,
      });
    });
  } catch (err) {
    return res.status(400).json({
      isSuccess: false,
      message: err.message
    });
  }
};

// get user by first name
ProductController.getProduct = async (req, res) => {
  try {
    let productName = req.params.name;
    let product = await Product.find({ name: productName });
    if (!productName) {
      return res.json({ message: 'Username is required' });
    }
    return res.json({ product });
  } catch (err) {
    return res.json({
      message:  'Product not found',
      error: err
    });
  };
};

// add new user to database
ProductController.addProduct = async (req, res) => {
  try {
    // get properties of user 
    const { name, desProduct, price, category } = req.body;
    // validate email 
    if (!name) {
      return res.status(400).json({
        isSuccess: false,
        error: {
          message: 'Name is required field'
        }
      });
    }
    // create new user
    const product = new Product({
      name, 
      desProduct,
      price,
      category
    });
    // save user to db
    await product.save((err, product) => {
      if (err) {
        return res.json({ message: 'Can not save product to db' });
      }
      return res.json({
        isSuccess: true,
        product
      });
    });
  } catch (err) {
    return res.status(400).json({
      isSuccess: false,
      message: err.message
    });
  }
};

// update info user
ProductController.updateProduct = async (req, res) => {
  try {
    let productName = req.params.name;
    let nameUpdate = req.body.name;
    let product = await Product.find({ name: productName });

    if (product.length) {
      await Product.updateMany({ name: productName }, { name: nameUpdate });
      return res.json({ message: 'Successful' });
    }
    return res.json({ message: 'Can not find product to update' });
  } catch (err) {
    return res.json({
      message: 'Can not update info of product',
      error: err
    });
  }
};
// delete user
ProductController.deleteProduct = async (req, res) => {
  try {
    let productName = req.params.name;
    await Product.findOneAndDelete({ name: productName }, (err) => {
      if (err) {
        return res.json({ message: err });
      }
      return res.json({ message: 'Successful!' });
    });
  } catch (err) {
    return res.json({
      message: 'Can not delete product',
      error: err
    })
  }
};

export default ProductController;
