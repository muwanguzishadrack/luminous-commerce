import { Router } from 'express';
import authRoutes from './auth.routes';
import organizationRoutes from './organization.routes';
import whatsappRoutes from './whatsapp.routes';

const router = Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/organizations', organizationRoutes);
router.use('/whatsapp', whatsappRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Luminous CRM API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

export default router;