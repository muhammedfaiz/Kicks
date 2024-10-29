
# Kicks

Kicks is an e-commerce application specializing in sneakers. Built with a clean and modern design, it allows users to browse, search, and purchase sneakers with ease. The project includes a user-friendly interface, a powerful backend, and secure payment processing.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Demo](#demo)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Product Listings**: Display various sneaker products with descriptions, prices, and images.
- **Search and Filter**: Allows users to search for sneakers and filter results by category or price.
- **Shopping Cart**: Users can add items to their cart, view contents, and manage items before checkout.
- **Checkout**: A simple and secure checkout process with payment integration.
- **Responsive Design**: Optimized to work on different screen sizes.

## Tech Stack

### Backend

- **Node.js** - For the server environment.
- **Express** - For handling API requests and routing.
- **MongoDB** - NoSQL database for storing product and user data.
- **Session** - Sessions for secure user authentication.
- **Razor Pay API** - For payment processing.

### Frontend

- **HTML/CSS/JavaScript** - For the structure and styling of the user interface.

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/muhammedfaiz/Kicks.git
   cd Kicks
   ```

2. **Install dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables** (See [Environment Variables](#environment-variables) for required variables).

4. **Start the server**

   ```bash
   npm run dev
   ```

5. **Access the application** by visiting `http://localhost:2500` (or your specified backend port).

## Environment Variables

In the backend directory, create a `.env` file with the following variables:

- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JSON Web Tokens
- `STRIPE_SECRET_KEY`: Stripe secret key for payment processing

## Usage

- **Browse Products**: View available sneakers with details.
- **Add to Cart**: Choose items to add to the cart.
- **Checkout**: Complete the purchase securely using Stripe.
- **User Authentication**: Sign up and log in to track your orders.

## Project Structure

```plaintext
Kicks/
│
├── backend/            # Backend server with Node.js and Express
|   ├── helpers         # Logical function connecting controllers
│   ├── controllers/    # Functions for handling requests
│   ├── models/         # Database models for products, users, orders
│   ├── routes/         # API routes for handling requests
│   └── config/         # Database and environment configurations
└── frontend/           # Frontend HTML/CSS/JavaScript files
```


### Demo

[![Watch the video](https://res.cloudinary.com/dzsu6hf5v/image/upload/c_thumb,w_200,g_face/v1730175196/Screenshot_2024-03-15_092203_uktaqv.png)](https://res.cloudinary.com/dzsu6hf5v/video/upload/v1729523339/project2_lyh01m.mp4)


## Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/NewFeature`).
3. Commit your changes (`git commit -m 'Add NewFeature'`).
4. Push to the branch (`git push origin feature/NewFeature`).
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
