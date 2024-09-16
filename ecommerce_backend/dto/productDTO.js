// dto/productDTO.js

const createProductDTO = (product, cartQuantity) => {
  return {
      id: product._id,
      name: product.name,
      brand: product.brand,
      description: product.description,
      price: product.price,
      discount: product.discount,
      image: product.image ? product.image.toString('base64') : null,
      category: product.category.name,
      category_id: product.category._id,
      stock: product.stock,
      quantity: cartQuantity || 0  // Default to 0 if no cart item found
  };
};

module.exports = createProductDTO;
