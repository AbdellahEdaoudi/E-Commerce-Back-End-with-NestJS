import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Cart } from './cart.schema';
import { Product } from 'src/product/product.schema';
import { UpdateCartItemsDto } from './dto/update-cart-items.dto';

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
      const cart = await this.cartModule.findOne({ user: userId }).populate('cartItems.productId');
    
      if (!cart) {
        // Create a new cart if it doesn't exist
        await this.cartModule.create({
          user: userId,
          cartItems: [
            { productId: productId, quantity: 1, color: '', price: product.price },
          ],
          totalPrice: product.price,
          totalPriceAfterDiscount: product.priceAfterDiscount || product.price,
        });
      } else {
        // Check if the product already exists in the cart
        const existingItem = cart.cartItems.find((item) =>
          item.productId._id.equals(productId)
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
            productId: {
              _id: product._id,
              price: product.price,
              priceAfterDiscount: product.priceAfterDiscount,
            },
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
        data:  cart
        
      };
    }

    async update(
      productId: string,
      userId: string,
      updateCartItemsDto: UpdateCartItemsDto,
    ) {
      const cart = await this.cartModule
        .findOne({ user: userId })
        .populate('cartItems.productId', 'price priceAfterDiscount');
    
      if (!cart) {
        throw new NotFoundException('Cart not found for this user.');
      }
      const product = await this.productModule.findById(productId);
      if (!product) {
        throw new NotFoundException('Product not found.');
      }
    
      const existingItem = cart.cartItems.find((item) =>
        item.productId._id.equals(productId),
      );
    
      if (!existingItem) {
        throw new NotFoundException('Product not found in cart.');
      }
    
      // Update color if provided
      if (updateCartItemsDto.color) {
        existingItem.color = updateCartItemsDto.color;
      }
    
      // Update quantity if provided
      if (updateCartItemsDto.quantity) {
        if (updateCartItemsDto.quantity > product.quantity) {
          throw new BadRequestException('Insufficient stock for this product.');
        }
        existingItem.quantity = updateCartItemsDto.quantity;
      }
    
      // Recalculate total prices
      cart.totalPrice = cart.cartItems.reduce(
        (total, item) => total + item.quantity * item.productId.price,
        0,
      );
    
      cart.totalPriceAfterDiscount = cart.cartItems.reduce(
        (total, item) =>
          total + item.quantity * (item.productId.priceAfterDiscount || item.productId.price),
        0,
      );
    
      await cart.save();
    
      return {
        status: 200,
        message: 'Cart item updated successfully',
        data: cart,
      };
    }


    async remove(productId: string, user_id: string) {
      const cart = await this.cartModule
        .findOne({ user: user_id })
        .populate(
          'cartItems.productId',
          'price title description priceAfterDiscount _id',
        );
      if (!cart) {
        throw new NotFoundException('Not Found Cart');
      }
      const existingItem = cart.cartItems.find((item) =>
            item.productId._id.equals(productId)
          );
      if (!existingItem) {
        throw new NotFoundException('Product not found in cart.');
      }
      cart.cartItems = cart.cartItems.filter((item) =>
            !item.productId._id.equals(productId)
          );

          // Recalculate total prices
      cart.totalPrice = cart.cartItems.reduce(
        (total, item) => total + item.quantity * item.productId.price,
        0,
      );
    
      cart.totalPriceAfterDiscount = cart.cartItems.reduce(
        (total, item) =>
          total + item.quantity * (item.productId.priceAfterDiscount || item.productId.price),
        0,
      );
  
      await cart.save();
  
      return {
        status: 200,
        message: 'Deleted Product',
        data: cart,
      };
    }
    
    
}
