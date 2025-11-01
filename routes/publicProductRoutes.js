import express from 'express'
import client from '../config.js';
const myDB = client.db("Olx-clone");
const Products = myDB.collection("products");
const router = express.Router()


router.get('/getproducts', async (req, res) => {
  const allProducts = Products.find({ status: true, isDeleted: false, deletedAt: null })
  const response = await allProducts.toArray()
  console.log(response)
  if (response.length > 0) {
    return res.send(response)

  } else {
    return res.send({
      status: 0,
      message: 'No products found'
    })
  }
})
export default router;
router.get('/getSelectedProducts', async (req, res) => {
  try {
    
    const {page, limit,category} = req.query;
     const filter = { status: true, isDeleted: false, deletedAt: null };

     if (category && category.trim() !== '') {
      filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalProduct = await Products.countDocuments(filter)
    const totalPages = Math.ceil(totalProduct/parseInt(limit))
    const response = await Products.find(filter).skip(skip).limit(parseInt(limit)).toArray()
    console.log(response)
    console.log("Category from frontend:", category)
console.log("Mongo filter:", filter)
    if (response.length > 0) {
      return res.send(
      {
        data:response,
        totalPages: totalPages,
        currentPage: page,
        totalProduct: totalProduct
      }
      )
  
    } else {
      return res.send({
        status: 0,
        message: 'No products found'
      })
    }
  }
    catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send({ message: "Internal server error" });
  }
  })
