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
    let id = req.params.id;
    if (!id) {
      return res.json({ message: 'Id is required' });
    }
    let product = await Product.findById(id);
    return res.json({ product });
  } catch (err) {
    return res.json({
      message: 'Product not found',
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
    if (!desProduct) {
      return res.status(400).json({
        isSuccess: false,
        error: {
          message: 'Description is required field'
        }
      });
    }
    if (!price) {
      return res.status(400).json({
        isSuccess: false,
        error: {
          message: 'Price is required field'
        }
      });
    }
    if (!category) {
      return res.status(400).json({
        isSuccess: false,
        error: {
          message: 'Category is required field'
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
    await product.save();
    return res.json({
      isSuccess: true,
      product
    })
  } catch (err) {
    return res.status(400).json({
      isSuccess: false,
      message: err.message
    });
  };
};

// update info user
ProductController.updateProduct = async (req, res) => {
  try {
    let id = req.params.id;
    let { name, desProduct, price, category } = req.body;
    if (!name) {
      return res.json({ message: 'Name is required !' });
    }
    if (!desProduct) {
      return res.json({ message: 'Description is required !' });
    }
    if (!price) {
      return res.json({ message: 'Price is required !' });
    }
    if (!category) {
      return res.json({ message: 'Category is required !' });
    }
    await Product.findByIdAndUpdate(id, req.body);
    return res.json({
      isSuccess: true,
      user: req.body
    })
  } catch (err) {
    return res.json({
      isSuccess: false,
      error: err
    });
  }
};
// delete user
ProductController.deleteProduct = async (req, res) => {
  try {
    let id = req.params.id;
    if (!id) {
      return res.json({ message: 'Id is required!' });
    }
    await Product.findByIdAndDelete(id);
    return res.json({ isSuccess: true });ƒ
  } catch (err) {
    return res.json({
      isSuccess: false,
      error: err.message
    })
  }
};

export default ProductController;
