# Luminous CRM

A modern, comprehensive Customer Relationship Management (CRM) system built with React and TypeScript. Luminous CRM provides businesses with powerful tools to manage customers, orders, products, campaigns, and communications all in one unified platform.

![Luminous CRM](./src/assets/Luminous-CRM-Logo.svg)

## 🚀 Features

### 📊 **Dashboard & Analytics**

- **Real-time Metrics**: Track key business metrics including revenue, orders, customers, and growth
- **Sales Analytics**: Visual charts and graphs showing sales performance over time
- **Quick Actions**: Fast access to create orders, products, and campaigns
- **Recent Activity**: Monitor latest orders, transactions, and customer interactions
- **Top Products**: View best-selling products with performance metrics

### 🛒 **E-commerce Management**

- **Order Management**: Complete order lifecycle from creation to fulfillment
  - Create, edit, and track orders
  - Order status management (Pending, Paid, Cancelled, Shipped)
  - Customer assignment and product selection
  - Payment method tracking
  - Order history and details view
- **Product Catalog**: Comprehensive product management system
  - Add, edit, and delete products
  - Product image management with media library
  - Category organization
  - Stock tracking and inventory management
  - Product performance analytics
- **Inventory Control**: Real-time stock monitoring and alerts

### 👥 **Customer Relationship Management**

- **Customer Database**: Centralized customer information management
- **Customer Profiles**: Detailed customer views with order history
- **Customer Segmentation**: Organize customers by various criteria
- **Communication History**: Track all customer interactions
- **Customer Analytics**: Insights into customer behavior and preferences

### 💬 **Communication & Messaging**

- **Integrated Chat System**: Real-time customer communication
- **Message Templates**: Pre-built templates for common communications
- **Template Builder**: Create custom message templates with:
  - Multiple template types (Text, Image, Video, Document, Location, Carousel)
  - Rich text formatting (_bold_, _italic_, ~strikethrough~)
  - Variable placeholders ({{1}}, {{2}}, etc.)
  - Interactive actions (Call-to-Action buttons, Quick Replies)
  - Multi-language support
  - Live preview functionality
- **Campaign Management**: Marketing campaign creation and tracking
  - Template-based campaigns
  - Delivery and read rate analytics
  - Campaign performance metrics
  - Automated campaign flows

### 💰 **Financial Management**

- **Transaction Tracking**: Complete financial transaction history
- **Payment Processing**: Multiple payment method support
- **Revenue Analytics**: Financial performance insights
- **Wallet System**: Integrated payment and balance management
- **Financial Reporting**: Detailed financial reports and analytics

### 🔐 **Authentication & Security**

- **User Registration**: Streamlined signup process with:
  - Personal information (First name, Last name)
  - Business information (Business name)
  - Contact details (Email, Phone number)
  - Secure password with confirmation
- **User Login**: Simple email and password authentication
- **Password Recovery**: Forgot password functionality with email reset
- **Business Profile**: Post-registration business details setup:
  - Business description and logo upload
  - Complete address information (Address, City, State, Zip, Country)
  - Business preferences (Currency, Timezone)
- **Secure Sessions**: JWT-based authentication with refresh tokens
- **Protected Routes**: Role-based access control

### 🎨 **User Experience**

- **Modern UI/UX**: Clean, intuitive interface built with shadcn/ui
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark/Light Mode**: Theme switching capability
- **Accessibility**: WCAG compliant design
- **Fast Performance**: Optimized with Vite for lightning-fast development and builds

## 🛠️ Tech Stack

### **Frontend Framework**

- **[React 18](https://react.dev/)** - Modern React with hooks and concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Vite](https://vitejs.dev/)** - Next-generation frontend tooling

### **UI & Styling**

- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - High-quality React components
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible UI primitives
- **[Lucide React](https://lucide.dev/)** - Beautiful & consistent icon library
- **[Framer Motion](https://www.framer.com/motion/)** - Production-ready motion library

### **Data Management**

- **[TanStack Query](https://tanstack.com/query)** - Powerful data synchronization
- **[React Hook Form](https://react-hook-form.com/)** - Performant forms with easy validation
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation

### **Development Tools**

- **[ESLint](https://eslint.org/)** - Code linting and quality
- **[Prettier](https://prettier.io/)** - Code formatting
- **[PostCSS](https://postcss.org/)** - CSS processing
- **[Autoprefixer](https://autoprefixer.github.io/)** - CSS vendor prefixing

## 📁 Project Structure

```
luminous/
├── src/
│   ├── components/
│   │   ├── pages/           # Main application pages
│   │   │   ├── dashboard.tsx      # Analytics dashboard
│   │   │   ├── orders.tsx         # Order management
│   │   │   ├── products.tsx       # Product catalog
│   │   │   ├── customers.tsx      # Customer management
│   │   │   ├── campaigns.tsx      # Marketing campaigns
│   │   │   ├── chat.tsx           # Communication system
│   │   │   ├── transactions.tsx   # Financial tracking
│   │   │   ├── wallet.tsx         # Payment management
│   │   │   └── create-template.tsx # Message template builder
│   │   ├── layout/          # Layout components
│   │   │   ├── dashboard-layout.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── top-bar.tsx
│   │   └── ui/              # Reusable UI components
│   ├── assets/              # Static assets
│   ├── lib/                 # Utility functions
│   ├── hooks/               # Custom React hooks
│   └── types/               # TypeScript type definitions
├── public/                  # Public assets
└── dist/                    # Production build output
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **npm**, **yarn**, or **pnpm**

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd luminous
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:5173](http://localhost:5173)

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run lint` - Run ESLint for code quality
- `npm run preview` - Preview production build locally

## 🎯 Key Features Breakdown

### Dashboard Analytics

- Revenue tracking with visual charts
- Order status distribution
- Customer growth metrics
- Top-performing products
- Recent activity feed

### Order Management System

- Complete order lifecycle management
- Customer assignment and product selection
- Payment method tracking
- Order status updates
- Bulk operations support

### Product Management

- Rich product catalog with images
- Category-based organization
- Stock level monitoring
- Product performance analytics
- Media library integration

### Customer Management

- Comprehensive customer profiles
- Order history tracking
- Communication logs
- Customer segmentation
- Behavioral analytics

### Campaign & Communication Tools

- Template-based messaging system
- Multi-format template support (Text, Image, Video, etc.)
- Interactive message elements
- Campaign performance tracking
- Multi-language template support

### Financial Tracking

- Transaction history
- Payment method management
- Revenue analytics
- Wallet integration
- Financial reporting

## 🔧 Customization

The application is built with modularity in mind. Key customization points:

- **Theme Configuration**: Modify `tailwind.config.js` for custom styling
- **Component Library**: Extend or modify components in `src/components/ui/`
- **Page Layouts**: Customize page structures in `src/components/pages/`
- **Navigation**: Update sidebar navigation in `src/components/layout/sidebar.tsx`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/) for beautiful, accessible components
- Icons provided by [Lucide](https://lucide.dev/)
- Charts powered by [Recharts](https://recharts.org/)
- Form handling by [React Hook Form](https://react-hook-form.com/)

---

**Luminous CRM** - Empowering businesses with modern customer relationship management tools.
