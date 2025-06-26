# Tech Stack

This starter kit uses the following tech stack:

1. **Core Framework and Runtime:**

   - **Vite**: The build tool and development server for the application
     - Core Vite configuration in `vite.config.ts`
   - **React 18**: The underlying UI library for building components
     - Components directory: `src/components/`
     - Hooks directory: `src/hooks/`
   - **TypeScript**: Used for type-safe development
     - Configuration in `tsconfig.json`

2. **Data Fetching and State Management:**

   - **TanStack React Query**: For efficient server state management and data fetching

     - Example query hook structure in `src/hooks/`:

       ```typescript
       import { useQuery } from '@tanstack/react-query'

       export function useProducts() {
         return useQuery({
           queryKey: ['products'],
           queryFn: async () => {
             const response = await fetch('/api/products')

             if (!response.ok) {
               throw new Error('Failed to fetch products')
             }

             return response.json()
           },
         })
       }
       ```

3. **UI Components and Styling:**

   - **Radix UI**: Extensive use of accessible components including:
     - Dialog, Popover, Tooltip
     - Navigation menus
     - Form elements (Checkbox, Radio, Select)
     - Layout components (Accordion, Tabs)
   - **Tailwind CSS**: For styling with utility classes
     - Configuration: `tailwind.config.js`
     - PostCSS configuration: `postcss.config.js`
     - Uses `tailwindcss-animate` for animations
   - **Framer Motion**: For advanced animations
   - **Lucide React**: For icons
   - **Embla Carousel**: For carousel/slider components
   - **Sonner**: For toast notifications
   - **class-variance-authority**: For managing component variants
   - **clsx** and **tailwind-merge**: For conditional class name handling

4. **Form Handling and Validation:**

   - **React Hook Form**: For form management
   - **Zod**: For schema validation
   - **@hookform/resolvers**: For integrating Zod with React Hook Form

5. **Date Handling and Charts:**

   - **date-fns**: For date manipulation
   - **React Day Picker**: For date picking components
   - **Recharts**: For data visualization and charts

6. **Development Tools:**

   - **ESLint**: For code linting
     - Configuration: `.eslintrc.json`
   - **Prettier**: For code formatting with Tailwind plugin
     - Configuration: `.prettierrc`
   - **TypeScript**: For static type checking
   - **PostCSS**: For CSS processing

7. **UI/UX Features:**
   - **next-themes**: For dark/light theme switching
   - **react-resizable-panels**: For resizable layout panels
   - **vaul**: For additional UI components
   - **cmdk**: For command palette functionality

The project is set up as a modern web application with:

- Type-safe development
- Modern UI components
- Responsive design
- Rich component library

This tech stack provides a robust foundation for building a scalable, secure, and user-friendly web application with modern features and best practices.
