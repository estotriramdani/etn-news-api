const express = require("express");

const router = express.Router();
const { getAllProducts, createProduct } = require("../controllers/products");

router.post("/product", createProduct);

router.get("/products", getAllProducts);

module.exports = router;
