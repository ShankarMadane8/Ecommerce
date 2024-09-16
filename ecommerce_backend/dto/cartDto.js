// dto/cartDto.js

const { Buffer } = require('buffer');

class CartDto {
    constructor(cart, product) {
        this.id = cart._id;
        this.productId = product._id;
        this.userId = cart.userId;
        this.quantity = cart.quantity;
        this.name = product.name;
        this.brand = product.brand;
        this.description = product.description;
        this.price = product.price;
        this.discount = product.discount;
        this.image = product.image ? Buffer.from(product.image).toString('base64') : null;
        this.category = product.category;
        
        const discountedPrice = product.price * (1 - (product.discount / 100));
        this.totalAmount = discountedPrice * cart.quantity;
    }
}

module.exports = CartDto;
