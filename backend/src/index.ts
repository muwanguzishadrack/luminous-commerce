import 'dotenv/config';
import app from './app';
import prisma from './utils/database';
import { OrganizationService } from './services/organization.service';
import { isStorageConfigured } from './config/storage';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    // Initialize storage service if configured
    if (isStorageConfigured()) {
      try {
        const organizationService = new OrganizationService();
        await organizationService.initializeStorage();
      } catch (error) {
        console.warn('⚠️ Storage initialization failed:', error);
        console.warn('File upload features will be limited');
      }
    } else {
      console.warn('⚠️ Storage not configured. File upload features disabled.');
      console.warn('Set MINIO_ENDPOINT, MINIO_ACCESS_KEY, and MINIO_SECRET_KEY environment variables.');
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 API Health: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();