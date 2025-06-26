import { Organization, User } from '@prisma/client';
import prisma from '@/utils/database';
import { storageService, UploadResult } from '@/services/storage.service';
import { 
  CreateOrganizationRequest, 
  UpdateOrganizationRequest, 
  OrganizationResponse,
  OrganizationWithUsers,
  UserRole 
} from '@/types';

export class OrganizationService {
  async createOrganization(data: CreateOrganizationRequest): Promise<Organization> {
    // Check if slug is already taken
    const existingOrg = await prisma.organization.findUnique({
      where: { slug: data.slug },
    });

    if (existingOrg) {
      throw new Error('Organization slug already exists');
    }

    const organization = await prisma.organization.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        phone: data.phone,
        address: data.address,
        city: data.city,
        country: data.country,
        timezone: data.timezone || 'UTC',
        currency: data.currency || 'USD',
      },
    });

    return organization;
  }

  async getOrganizationBySlug(slug: string): Promise<Organization | null> {
    return prisma.organization.findUnique({
      where: { slug },
    });
  }

  async getOrganizationById(id: string): Promise<Organization | null> {
    return prisma.organization.findUnique({
      where: { id },
    });
  }

  async getOrganizationWithUsers(organizationId: string): Promise<OrganizationWithUsers | null> {
    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!org) return null;
    
    // Transform null values to undefined for TypeScript compatibility
    return {
      ...org,
      description: org.description ?? undefined,
      logo: org.logo ?? undefined,
      phone: org.phone ?? undefined,
      address: org.address ?? undefined,
      city: org.city ?? undefined,
      state: org.state ?? undefined,
      zipCode: org.zipCode ?? undefined,
      country: org.country ?? undefined,
    } as OrganizationWithUsers;
  }

  async updateOrganization(
    organizationId: string, 
    data: UpdateOrganizationRequest
  ): Promise<Organization> {
    const organization = await prisma.organization.update({
      where: { id: organizationId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return organization;
  }

  async deleteOrganization(organizationId: string): Promise<void> {
    await prisma.organization.update({
      where: { id: organizationId },
      data: { isActive: false },
    });
  }

  async addUserToOrganization(
    organizationId: string,
    userData: {
      email: string;
      firstName: string;
      lastName: string;
      phone?: string;
      role?: UserRole;
    }
  ): Promise<User> {
    // Check if user already exists in this organization
    const existingUser = await prisma.user.findFirst({
      where: {
        email: userData.email,
        organizationId,
      },
    });

    if (existingUser) {
      throw new Error('User already exists in this organization');
    }

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phone || '',
        businessName: userData.firstName + ' ' + userData.lastName,
        role: userData.role || UserRole.MEMBER,
        password: '', // Will be set when user completes registration
        organizationId,
      },
    });

    return user;
  }

  async removeUserFromOrganization(organizationId: string, userId: string): Promise<void> {
    // Check if user is the only owner
    const user = await prisma.user.findFirst({
      where: { id: userId, organizationId },
    });

    if (user?.role === UserRole.OWNER) {
      const ownerCount = await prisma.user.count({
        where: {
          organizationId,
          role: UserRole.OWNER,
          isActive: true,
        },
      });

      if (ownerCount <= 1) {
        throw new Error('Cannot remove the last owner from organization');
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });
  }

  async updateUserRole(
    organizationId: string, 
    userId: string, 
    role: UserRole
  ): Promise<User> {
    // Verify user belongs to organization
    const user = await prisma.user.findFirst({
      where: { id: userId, organizationId },
    });

    if (!user) {
      throw new Error('User not found in organization');
    }

    // Check if trying to remove the last owner
    if (user.role === UserRole.OWNER && role !== UserRole.OWNER) {
      const ownerCount = await prisma.user.count({
        where: {
          organizationId,
          role: UserRole.OWNER,
          isActive: true,
        },
      });

      if (ownerCount <= 1) {
        throw new Error('Cannot remove the last owner role');
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    return updatedUser;
  }

  async getOrganizationStats(organizationId: string) {
    const [userCount, activeUserCount] = await Promise.all([
      prisma.user.count({
        where: { organizationId },
      }),
      prisma.user.count({
        where: { organizationId, isActive: true },
      }),
    ]);

    return {
      totalUsers: userCount,
      activeUsers: activeUserCount,
      inactiveUsers: userCount - activeUserCount,
    };
  }

  /**
   * Upload organization logo
   */
  async uploadLogo(
    organizationId: string,
    file: Express.Multer.File
  ): Promise<string> {
    try {
      // Get organization to check if it exists and has existing logo
      const organization = await prisma.organization.findUnique({
        where: { id: organizationId },
      });

      if (!organization) {
        throw new Error('Organization not found');
      }

      // Delete existing logo if it exists
      if (organization.logo) {
        try {
          await storageService.deleteLogoByUrl(organization.logo);
        } catch (error) {
          console.warn('Failed to delete existing logo:', error);
          // Continue with upload even if deletion fails
        }
      }

      // Upload new logo
      const uploadResult: UploadResult = await storageService.uploadLogo(
        organizationId,
        file.buffer,
        file.originalname,
        file.mimetype
      );

      // Update organization with new logo URL
      await prisma.organization.update({
        where: { id: organizationId },
        data: { logo: uploadResult.url },
      });

      return uploadResult.url;
    } catch (error) {
      console.error('Error uploading logo:', error);
      throw new Error('Failed to upload logo');
    }
  }

  /**
   * Delete organization logo
   */
  async deleteLogo(organizationId: string): Promise<void> {
    try {
      // Get organization
      const organization = await prisma.organization.findUnique({
        where: { id: organizationId },
      });

      if (!organization) {
        throw new Error('Organization not found');
      }

      if (!organization.logo) {
        throw new Error('No logo to delete');
      }

      // Delete logo from storage
      await storageService.deleteLogoByUrl(organization.logo);

      // Update organization to remove logo URL
      await prisma.organization.update({
        where: { id: organizationId },
        data: { logo: null },
      });
    } catch (error) {
      console.error('Error deleting logo:', error);
      throw new Error('Failed to delete logo');
    }
  }

  /**
   * Get organization logo URL
   */
  async getLogoUrl(organizationId: string): Promise<string | null> {
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      select: { logo: true },
    });

    return organization?.logo || null;
  }

  /**
   * Initialize storage buckets (call on app startup)
   */
  async initializeStorage(): Promise<void> {
    try {
      await storageService.initializeBucket();
      console.log('✅ Storage service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize storage service:', error);
      throw error;
    }
  }
}