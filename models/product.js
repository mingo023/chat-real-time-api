import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let productSchema = new Schema({
  name: String,
  desProduct: String,
  price: Number,
  category: String
});

let Product = mongoose.model('Product', productSchema);

export default Product;