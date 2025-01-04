import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  getHome() {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Overview</title>
        <style>
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #ff7e5f, #feb47b);
            color: #fff;
            animation: fadeIn 2s ease-in-out;
          }
          .container {
            text-align: center;
            max-width: 600px;
            padding: 20px;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
            animation: fadeIn 3s ease-in-out;
          }
          h1 {
            font-size: 2.5em;
            margin-bottom: 20px;
            animation: fadeIn 4s ease-in-out;
          }
          p {
            font-size: 1.2em;
            line-height: 1.5;
            animation: fadeIn 5s ease-in-out;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to the Ecommerce API</h1>
          <p>
A robust and scalable back-end system for an e-commerce platform. The system handles various functions such as user management, product inventory organization, order processing, payment handling (either via cash or card), coupon addition, reviews, category and brand management, supplier management, and tax regulation.          </p>
        </div>
      </body>
      </html>
    `;
  }
}
