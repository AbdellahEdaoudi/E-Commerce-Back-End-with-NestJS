import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Cart } from './cart.schema';
import { Product } from 'src/product/product.schema';
import { UpdateCartItemsDto } from './dto/update-cart-items.dto';
import { Coupon } from 'src/coupon/coupon.schema';

@Injectable()
export class CartService {
  constructor(
      @InjectModel(Cart.name) private cartModule: Model<Cart>,
      @InjectModel(Product.name) private productModule: Model<Product>,
      @InjectModel(Coupon.name) private couponModule: Model<Coupon>
    ) {}

    async create(productId: string, userId: string) {
      const product = await this.productModule.findById(productId);
      if (!product) {
        throw new NotFoundException('Product not found.');
      }

      if (product.quantity <= 0) {
        throw new BadRequestException('Product out of stock.');
      }
      let cart = await this.cartModule.findOne({ user: userId })
      .populate('cartItems.productId',"_id quantity price priceAfterDiscount ");
    
      if (!cart) {
        // Create a new cart if it doesn't exist
        cart = await this.cartModule.create({
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
        if (cart.coupons && cart.coupons.length > 0) {
          const totalDiscount = cart.coupons.reduce(
            (sum, coupon) => sum + coupon.discount,
            0,
          );
        cart.totalPrice -= totalDiscount
        cart.totalPriceAfterDiscount -= totalDiscount
      }
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
      }
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
      const product = await this.productModule.findById(productId);
      if (!product) {
        throw new NotFoundException('Product not found.');
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
      if (cart.coupons && cart.coupons.length > 0) {
        const totalDiscount = cart.coupons.reduce(
          (sum, coupon) => sum + coupon.discount,
          0,
        );
        cart.totalPrice -= totalDiscount
        cart.totalPriceAfterDiscount -= totalDiscount
      }
      if (cart.totalPrice  <= 0) {
      cart.totalPrice = 0
      }
      if (cart.totalPriceAfterDiscount  <= 0) {
        cart.totalPriceAfterDiscount = 0
        }
      await cart.save();
  
      return {
        status: 200,
        message: 'Deleted Product',
        data: cart,
      };
    }

    async findOne(user_id: string) {
      const cart = await this.cartModule
        .findOne({ user: user_id })
        .populate('cartItems.productId', 'price title description')
        .select('-__v');
      if (!cart) {
        throw new NotFoundException(
          `You don't hava a cart please go to add prducts`,
        );
      }
  
      return {
        status: 200,
        message: 'Found Cart',
        data: cart,
      };
    }
    
    async applyCoupon(user_id: string, couponName: string) {
      const cart = await this.cartModule.findOne({ user: user_id });
      const coupon = await this.couponModule.findOne({ name: couponName });
  
      if (!cart) {
        throw new NotFoundException('Not Found Cart');
      }
      if (!coupon) {
        throw new HttpException('Invalid coupon', 400);
      }
      const isExpired = new Date(coupon.expirdate) > new Date();
      if (!isExpired) {
        throw new HttpException('Invalid coupon', 400);
      }
  
      const ifCouponAlredyUsed = cart.coupons.findIndex(
        (item) => item.name === couponName,
      );
      if (ifCouponAlredyUsed !== -1) {
        throw new HttpException('Coupon alredy used', 400);
      }
  
      if (cart.totalPrice <= 0) {
        throw new HttpException('You have full discount', 400);
      }
  
      cart.coupons.push({ name: coupon.name, couponId: coupon._id.toString(),discount:coupon.discount});
      cart.totalPrice = cart.totalPrice - coupon.discount;
      cart.totalPriceAfterDiscount = cart.totalPriceAfterDiscount - coupon.discount;
      if (cart.totalPrice < 0) {
        cart.totalPrice = 0
      }
      if (cart.totalPriceAfterDiscount < 0) {
        cart.totalPriceAfterDiscount = 0
      }
      await cart.save();
  
      return {
        status: 200,
        message: 'Coupon Applied',
        data: cart,
      };
    }
    
}
