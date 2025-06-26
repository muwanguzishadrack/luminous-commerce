import { Request, Response, NextFunction } from 'express';
import { OrganizationService } from '@/services/organization.service';
import { sendSuccess, sendError } from '@/utils/response';
import { 
  AuthenticatedRequest, 
  CreateOrganizationRequest, 
  UpdateOrganizationRequest,
  UserRole 
} from '@/types';

const organizationService = new OrganizationService();

export class OrganizationController {
  createOrganization = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: CreateOrganizationRequest = req.body;
      const organization = await organizationService.createOrganization(data);
      
      sendSuccess(res, 'Organization created successfully', organization, 201);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Organization slug already exists') {
          return sendError(res, error.message, undefined, 409);
        }
      }
      next(error);
    }
  }

  getCurrentOrganization = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.organizationId) {
        return sendError(res, 'No organization associated with user', undefined, 404);
      }

      const organization = await organizationService.getOrganizationWithUsers(
        req.user.organizationId
      );
      
      if (!organization) {
        return sendError(res, 'Organization not found', undefined, 404);
      }

      sendSuccess(res, 'Organization retrieved successfully', organization);
    } catch (error) {
      next(error);
    }
  }

  getOrganizationBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;
      const organization = await organizationService.getOrganizationBySlug(slug);
      
      if (!organization) {
        return sendError(res, 'Organization not found', undefined, 404);
      }

      // Return public information only
      const publicOrg = {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        description: organization.description,
        isActive: organization.isActive,
      };

      sendSuccess(res, 'Organization retrieved successfully', publicOrg);
    } catch (error) {
      next(error);
    }
  }

  updateOrganization = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.organizationId) {
        return sendError(res, 'No organization associated with user', undefined, 404);
      }

      const data: UpdateOrganizationRequest = req.body;
      const organization = await organizationService.updateOrganization(
        req.user.organizationId, 
        data
      );
      
      sendSuccess(res, 'Organization updated successfully', organization);
    } catch (error) {
      next(error);
    }
  }

  deleteOrganization = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.organizationId) {
        return sendError(res, 'No organization associated with user', undefined, 404);
      }

      await organizationService.deleteOrganization(req.user.organizationId);
      
      sendSuccess(res, 'Organization deactivated successfully');
    } catch (error) {
      next(error);
    }
  }

  addUserToOrganization = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.organizationId) {
        return sendError(res, 'No organization associated with user', undefined, 404);
      }

      const { email, firstName, lastName, phone, role } = req.body;
      
      const user = await organizationService.addUserToOrganization(
        req.user.organizationId,
        { email, firstName, lastName, phone, role }
      );
      
      sendSuccess(res, 'User added to organization successfully', {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      }, 201);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'User already exists in this organization') {
          return sendError(res, error.message, undefined, 409);
        }
      }
      next(error);
    }
  }

  removeUserFromOrganization = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.organizationId) {
        return sendError(res, 'No organization associated with user', undefined, 404);
      }

      const { userId } = req.params;
      
      await organizationService.removeUserFromOrganization(
        req.user.organizationId, 
        userId
      );
      
      sendSuccess(res, 'User removed from organization successfully');
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Cannot remove the last owner from organization') {
          return sendError(res, error.message, undefined, 400);
        }
      }
      next(error);
    }
  }

  updateUserRole = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.organizationId) {
        return sendError(res, 'No organization associated with user', undefined, 404);
      }

      const { userId } = req.params;
      const { role } = req.body;
      
      const user = await organizationService.updateUserRole(
        req.user.organizationId, 
        userId, 
        role
      );
      
      sendSuccess(res, 'User role updated successfully', {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Cannot remove the last owner role') || 
            error.message === 'User not found in organization') {
          return sendError(res, error.message, undefined, 400);
        }
      }
      next(error);
    }
  }

  getOrganizationStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.organizationId) {
        return sendError(res, 'No organization associated with user', undefined, 404);
      }

      const stats = await organizationService.getOrganizationStats(
        req.user.organizationId
      );
      
      sendSuccess(res, 'Organization stats retrieved successfully', stats);
    } catch (error) {
      next(error);
    }
  }

  uploadLogo = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.organizationId) {
        return sendError(res, 'No organization associated with user', undefined, 404);
      }

      if (!req.file) {
        return sendError(res, 'No file uploaded', undefined, 400);
      }

      const logoUrl = await organizationService.uploadLogo(
        req.user.organizationId,
        req.file
      );
      
      sendSuccess(res, 'Logo uploaded successfully', { logoUrl });
    } catch (error) {
      next(error);
    }
  }

  deleteLogo = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.organizationId) {
        return sendError(res, 'No organization associated with user', undefined, 404);
      }

      await organizationService.deleteLogo(req.user.organizationId);
      
      sendSuccess(res, 'Logo deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}