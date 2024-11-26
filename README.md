# Kambo Autos - Auto Parts E-commerce Platform

## Overview

Kambo Autos is a cutting-edge e-commerce platform specializing in automotive parts and accessories. Built with Next.js 15, React 18, and TypeScript, it offers a seamless shopping experience for customers and a powerful management system for administrators.

## Features

- 🛍️ **Product Management**
  - Comprehensive product catalog with detailed specifications
  - Advanced filtering and search capabilities
  - Image upload and management with Firebase Storage

- 🚗 **Vehicle Compatibility**
  - Car maker and model management
  - Year-specific part compatibility
  - Modification support for different vehicle variants

- 👤 **User Management**
  - Secure authentication with NextAuth.js
  - Role-based access control (Admin/Customer)
  - User profile management

- 🛒 **Shopping Experience**
  - Intuitive product browsing and search
  - Shopping cart functionality
  - Secure checkout process

- 📊 **Admin Dashboard**
  - Comprehensive sales analytics
  - Inventory management
  - Order processing and tracking

- 🎨 **Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Dark/Light mode support
  - Accessible components with shadcn/ui
  - Interactive icons with Lucide React

- 📱 **Mobile-First Approach**
  - Optimized for all device sizes
  - Touch-friendly interface

## Tech Stack

- **Frontend:**
  - Next.js 13 (App Router)
  - React 18
  - TypeScript
  - Tailwind CSS
  - shadcn/ui components
  - Lucide React icons

- **Backend:**
  - Next.js API Routes
  - Prisma ORM
  - PostgreSQL
  - Firebase Storage

- **Authentication:**
  - NextAuth.js

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/kambo-autos.git
   cd kambo-autos

2. **Install dependencies**

```shellscript
npm install
```


3. **Set up environment variables**
Create a `.env.local` file with the following variables:

```plaintext
DATABASE_URL="your-postgresql-url"
NEXTAUTH_SECRET="your-nextauth-secret"
FIREBASE_API_KEY="your-firebase-api-key"
FIREBASE_AUTH_DOMAIN="your-firebase-auth-domain"
FIREBASE_PROJECT_ID="your-firebase-project-id"
FIREBASE_STORAGE_BUCKET="your-firebase-storage-bucket"
FIREBASE_MESSAGING_SENDER_ID="your-firebase-messaging-sender-id"
FIREBASE_APP_ID="your-firebase-app-id"
```


4. **Initialize the database**

```shellscript
npx prisma generate
npx prisma db push
```


5. **Run the development server**

```shellscript
npm run dev
```


6. **Open your browser**
Navigate to `http://localhost:3000`


## Project Structure

```plaintext
kambo-autos/
├── app/                 # Next.js 13 app directory
│   ├── admin/           # Admin dashboard pages
│   ├── api/             # API routes
│   └── [...]/           # Other app routes
├── components/          # React components
│   ├── admin/           # Admin-specific components
│   └── ui/              # UI components
├── lib/                 # Utility functions and configurations
├── prisma/              # Database schema and migrations
└── public/              # Static assets
```

## Deployment

This project is set up for easy deployment on Vercel. Follow these steps:

1. Push your code to a GitHub repository
2. Create a new project on Vercel and link it to your GitHub repo
3. Configure the environment variables in the Vercel dashboard
4. Deploy!


## Contributing

We welcome contributions to Kambo Autos! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase](https://firebase.google.com/)
- [NextAuth.js](https://next-auth.js.org/)


## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.