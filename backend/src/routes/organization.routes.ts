import { Router } from 'express';
import { OrganizationController } from '@/controllers/organization.controller';
import { authenticate } from '@/middleware/auth';
import { 
  requireOrganization, 
  requireOwnerOrAdmin, 
  requireOwner,
  scopeToOrganization 
} from '@/middleware/organization';
import { handleValidationErrors } from '@/middleware/validation';
import { uploadLogo, handleUploadError, requireFileField } from '@/middleware/upload';
import {
  createOrganizationValidation,
  updateOrganizationValidation,
  addUserToOrganizationValidation,
  updateUserRoleValidation,
  organizationSlugValidation,
  userIdValidation,
} from '@/validation/organization.validation';

const router = Router();
const organizationController = new OrganizationController();

// Public routes
router.get(
  '/public/:slug', 
  organizationSlugValidation, 
  handleValidationErrors, 
  organizationController.getOrganizationBySlug
);

// Protected routes - require authentication
router.use(authenticate);

// Organization management routes
router.post(
  '/', 
  createOrganizationValidation, 
  handleValidationErrors, 
  organizationController.createOrganization
);

router.get(
  '/current', 
  requireOrganization,
  scopeToOrganization,
  organizationController.getCurrentOrganization
);

router.put(
  '/current', 
  requireOrganization,
  requireOwnerOrAdmin,
  scopeToOrganization,
  updateOrganizationValidation, 
  handleValidationErrors, 
  organizationController.updateOrganization
);

router.delete(
  '/current', 
  requireOrganization,
  requireOwner,
  scopeToOrganization,
  organizationController.deleteOrganization
);

// User management within organization
router.post(
  '/users', 
  requireOrganization,
  requireOwnerOrAdmin,
  scopeToOrganization,
  addUserToOrganizationValidation, 
  handleValidationErrors, 
  organizationController.addUserToOrganization
);

router.delete(
  '/users/:userId', 
  requireOrganization,
  requireOwnerOrAdmin,
  scopeToOrganization,
  userIdValidation,
  handleValidationErrors,
  organizationController.removeUserFromOrganization
);

router.put(
  '/users/:userId/role', 
  requireOrganization,
  requireOwner,
  scopeToOrganization,
  updateUserRoleValidation, 
  handleValidationErrors, 
  organizationController.updateUserRole
);

// Organization statistics
router.get(
  '/stats', 
  requireOrganization,
  requireOwnerOrAdmin,
  scopeToOrganization,
  organizationController.getOrganizationStats
);

// Logo management routes
router.post(
  '/logo', 
  requireOrganization,
  requireOwnerOrAdmin,
  scopeToOrganization,
  uploadLogo,
  handleUploadError,
  requireFileField('logo'),
  organizationController.uploadLogo
);

router.delete(
  '/logo', 
  requireOrganization,
  requireOwnerOrAdmin,
  scopeToOrganization,
  organizationController.deleteLogo
);

export default router;