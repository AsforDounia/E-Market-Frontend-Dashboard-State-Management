import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import {
  Product,
  Category,
  ProductCategory,
  User,
  Cart,
  CartItem,
  Coupon,
  Order,
  OrderCoupon,
  OrderItem,
  Review,
  TokenBlacklist,
  UserCoupon,
  UserNotification,
  Notification,
} from "../models/Index.js";
import DotenvFlow from "dotenv-flow";

DotenvFlow.config({ node_env: "production", override: true });

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database");

    // Clear all collections
    console.log("Clearing all collections...");
    await Promise.all([
      Cart.deleteMany({}),
      CartItem.deleteMany({}),
      Category.deleteMany({}),
      Coupon.deleteMany({}),
      Order.deleteMany({}),
      OrderCoupon.deleteMany({}),
      OrderItem.deleteMany({}),
      Product.deleteMany({}),
      ProductCategory.deleteMany({}),
      Review.deleteMany({}),
      TokenBlacklist.deleteMany({}),
      User.deleteMany({}),
      UserCoupon.deleteMany({}),
      UserNotification.deleteMany({}),
      Notification.deleteMany({}),
    ]);
    console.log("All collections cleared.");

    const users = [];

    //admin
    const admin = await User.create({
      fullname: "Admin User",
      email: "admin@gmail.com",
      password: "admin123",
      role: "admin",
    });
    users.push(admin);
    
    // seller
    const seller = await User.create({
        fullname: "Seller User",
        email: "seller@gmail.com",
        password: "seller123",
        role: "seller",
    });
    users.push(seller);

    // 5 users aléatoires
    for (let i = 0; i < 5; i++) {
      const user = await User.create({
        fullname: faker.person.fullName(),
        email: faker.internet.email(),
        password: "user123",
        role: "user",
      });
      users.push(user);
    }
    console.log(`Inserted ${users.length} users`);

    //cartegories
    const categoryNames = [
      "Electronics",
      "Clothing",
      "Books",
      "Home & Garden",
      "Sports",
      "Beauty",
    ];

    const categories = await Category.insertMany(
      categoryNames.map((name) => ({
        name,
        description: faker.lorem.sentence(),
      })),
    );
    console.log(`Inserted ${categories.length} categories`);

    //products
    const sellers = users.filter(u => u.role === 'admin' || u.role === 'seller');
    const products = [];

    for (let i = 0; i < 50; i++) {
      const title = faker.commerce.productName();
      const slug = `${title.toLowerCase().replace(/ /g, "-")}-${faker.string.uuid()}`;
      const product = await Product.create({
        title,
        slug,
        description: faker.commerce.productDescription(),
        price: faker.commerce.price({ min: 10, max: 1000, dec: 2 }),
        stock: faker.number.int({ min: 10, max: 200 }),
        imageUrls: ["/uploads/products/optimized/images-1762954580627-378966512.png"],
        sellerId: faker.helpers.arrayElement(sellers)._id,
        validationStatus: faker.helpers.arrayElement(['pending', 'approved', 'rejected']),
      });

      // assigner entre 1 et 2 catégories
      const randomCategories = faker.helpers.arrayElements(
        categories,
        faker.number.int({ min: 1, max: 2 }),
      );

      for (const cat of randomCategories) {
        await ProductCategory.create({
          product: product._id,
          category: cat._id,
        });
      }

      products.push(product);
    }
    console.log(
      `Inserted ${products.length} products with category relationships`,
    );

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    mongoose.disconnect();
  }
}

export default seedDatabase;

if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}