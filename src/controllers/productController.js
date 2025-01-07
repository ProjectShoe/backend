const { MESSAGE } = require("../utils/constants");
const db = require("../models/index");
const Product = db.products;

exports.addProduct = async (req, res) => {
  try {
    const { name, price, description, quantity, code, type } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null; // Đường dẫn ảnh

    if (!name || !price || !description || !quantity) {
      res.status(400).json({
        status: "ERR",
        message: MESSAGE.THE_INPUT_IS_REQUIRED,
      });
    }

    const existingProduct = await Product.findOne({ name });

    if (existingProduct) {
      return res.status(400).json({
        status: "ERR",
        message: "Product already exists",
      });
    } else {
      const newProduct = await Product.create({
        name,
        price,
        description,
        quantity,
        image,
        code,
        type
      });
      res.status(200).json({
        status: "OK",
        message: "AddProducts successfully!",
        data: newProduct,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "AddProduct failed",
      error: error.message,
    });
  }
};

exports.UpdateProduct = async (req, res) => {
  try {
    const { name, price, description, quantity, type, code } = req.body;

    const product = await Product.findById(req.params.id);
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image || product.image; // Đường dẫn ảnh
    // if (name) {
    //   const nameProduct = await Product.findOne({ name });
    //   if (nameProduct && nameProduct._id.toString() !== req.params.id) {
    //     return res.status(400).json({
    //       status: "ERR",
    //       message: "Name already exists",
    //     });
    //   }
    // }

    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: name || product?.name,
        price: price || product?.price,
        description: description || product?.description,
        quantity: quantity || product?.quantity,
        image: image || product?.image,
        code: code || product?.code,
        type: type || product?.type,
      },
      { new: true, runValidators: true }
    );

    if (!updateProduct) {
      return res.status(400).json({
        status: "ERR",
        message: "Product not found",
      });
    }

    return res.status(200).json({
      status: "OK",
      message: "Update product successfully",
      data: updateProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "UpdateProduct failed",
      error: error.message,
    });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const deleteProduct = await Product.findByIdAndSoftDelete(req.params.id);

    if (!deleteProduct) {
      return res.status(404).json({
        status: "ERR",
        message: "Product not found",
      });
    }
    res.status(200).json({
      status: "OK",
      message: "Delete Product successfully",
      data: deleteProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: "DeleteProduct failed",
      error: error.message,
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const getProduct = await Product.findById(req.params.id);

    if (!getProduct) {
      return res.status(404).json({
        status: "ERR",
        message: "Product not found",
      });
    }
    res.status(200).json({
      status: "OK",
      message: "GetProduct successfully",
      data: getProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: "GetProduct failed",
      error: error.message,
    });
  }
};

exports.getAllProduct = async (req, res) => {
  try {
    const getAllProduct = await Product.find();

    if (!getAllProduct) {
      return res.status(404).json({
        status: "ERR",
        message: "Product not found",
      });
    }
    res.status(200).json({
      status: "OK",
      message: "GetAllProduct successfully",
      data: getAllProduct,
    });
  } catch (error) {
    return res.status(500).json({
      message: "GetAllProduct failed",
      error: error.message,
    });
  }
};
