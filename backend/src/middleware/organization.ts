import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, UserRole } from '@/types';
import { sendError } from '@/utils/response';
import prisma from '@/utils/database';

export const requireOrganization = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return sendError(res, 'Authentication required', undefined, 401);
  }

  if (!req.user.organizationId) {
    return sendError(res, 'Organization context required', undefined, 403);
  }

  next();
};

export const requireRole = (roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Authentication required', undefined, 401);
    }

    if (!roles.includes(req.user.role)) {
      return sendError(res, 'Insufficient permissions', undefined, 403);
    }

    next();
  };
};

export const requireOwnerOrAdmin = requireRole([UserRole.OWNER, UserRole.ADMIN]);
export const requireOwner = requireRole([UserRole.OWNER]);

export const scopeToOrganization = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return sendError(res, 'Authentication required', undefined, 401);
    }

    // Verify organization exists and is active
    const organization = await prisma.organization.findFirst({
      where: {
        id: req.user.organizationId,
        isActive: true,
      },
    });

    if (!organization) {
      return sendError(res, 'Organization not found or inactive', undefined, 404);
    }

    // Add organization to request for easy access
    req.organization = organization;
    next();
  } catch (error) {
    next(error);
  }
};

export const validateOrganizationSlug = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { organizationSlug } = req.params;
    
    if (!organizationSlug) {
      return sendError(res, 'Organization slug required', undefined, 400);
    }

    const organization = await prisma.organization.findUnique({
      where: { slug: organizationSlug },
    });

    if (!organization) {
      return sendError(res, 'Organization not found', undefined, 404);
    }

    if (!organization.isActive) {
      return sendError(res, 'Organization is inactive', undefined, 403);
    }

    // If user is authenticated, verify they belong to this organization
    if (req.user && req.user.organizationId !== organization.id) {
      return sendError(res, 'Access denied to this organization', undefined, 403);
    }

    req.organization = organization;
    next();
  } catch (error) {
    next(error);
  }
};