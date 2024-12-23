import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Cart } from './cart.schema';
import { Product } from 'src/product/product.schema';

@Injectable()
export class CartService {
  constructor(
      @InjectModel(Cart.name) private cartModule: Model<Cart>,
      @InjectModel(Product.name) private productModule: Model<Product>
    ) {}

    async create(productId: string, userId: string) {
      const product = await this.productModule.findById(productId);
      if (!product) {
        throw new NotFoundException('Product not found.');
      }

      if (product.quantity <= 0) {
        throw new BadRequestException('Product out of stock.');
      }

      const objectId = new mongoose.Types.ObjectId(productId);
      let cart = await this.cartModule.findOne({ user: userId });
    
      if (!cart) {
        // Create a new cart if it doesn't exist
        cart = await this.cartModule.create({
          user: userId,
          cartItems: [
            { productId: objectId, quantity: 1, color: '', price: product.price },
          ],
          totalPrice: product.price,
          totalPriceAfterDiscount: product.priceAfterDiscount || product.price,
        });
      } else {
        // Check if the product already exists in the cart
        const existingItem = cart.cartItems.find((item) =>
          item.productId.equals(objectId)
        );
        if (existingItem) {
          if (product.quantity < existingItem.quantity + 1) {
            throw new BadRequestException('Insufficient stock.');
          }
          // Update the quantity and adjust prices
          existingItem.quantity += 1;
          cart.totalPrice += product.price;
          cart.totalPriceAfterDiscount += product.priceAfterDiscount || product.price;
        } else {
          // Add a new product to the cart
          cart.cartItems.push({
            productId: objectId,
            quantity: 1,
            color: '',
            price: product.price,
          });
          cart.totalPrice += product.price;
          cart.totalPriceAfterDiscount += product.priceAfterDiscount || product.price;
        }
        await cart.save();
      }
    
      return {
        status: 200,
        message: 'Product added successfully',
        data: cart,
      };
    }
    
    
    
    
    

  findAll() {
    return `This action returns all cart`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
