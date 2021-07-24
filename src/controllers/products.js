const createProduct = (req, res, next) => {
  const name = req.body.name;
  const price = req.body.price;

  res.json({
    message: "Product was created",
    data: {
      id: 1,
      name: name,
      price: price,
    },
  });
  next();
};

const getAllProducts = (req, res, next) => {
  res.json({
    message: "Get All Products success",
    data: [
      {
        id: 1,
        name: "Sari Gandum",
        price: 8000,
      },
    ],
  });
  next();
};

module.exports = { createProduct, getAllProducts };
