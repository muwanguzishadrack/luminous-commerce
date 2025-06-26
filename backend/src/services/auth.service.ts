import prisma from '@/utils/database';
import { hashPassword, comparePassword } from '@/utils/password';
import { generateTokenPair, verifyToken } from '@/utils/jwt';
import { 
  RegisterRequest, 
  LoginRequest, 
  JoinOrganizationRequest,
  AuthResponse, 
  UserRole,
  UpdateProfileRequest,
  ChangePasswordRequest
} from '@/types';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/utils/email';
import { getCurrencyByCountryCode } from '@/utils/country-currency';

export class AuthService {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return prisma.$transaction(async (tx: any) => {
      // Check if user already exists with this email
      const existingUser = await tx.user.findFirst({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Generate organization slug from business name
      const slug = data.businessName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 50);

      // Ensure slug is unique
      let finalSlug = slug;
      let counter = 1;
      while (await tx.organization.findUnique({ where: { slug: finalSlug } })) {
        finalSlug = `${slug}-${counter}`;
        counter++;
      }

      // Get currency based on country code
      const currency = data.countryCode 
        ? getCurrencyByCountryCode(data.countryCode)
        : 'USD';

      // Create organization with business name and auto-detected currency
      const organization = await tx.organization.create({
        data: {
          name: data.businessName,
          slug: finalSlug,
          country: data.countryCode || null,
          currency: currency,
        },
      });

      // Hash password
      const hashedPassword = await hashPassword(data.password);

      // Create user as organization owner
      const user = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          businessName: data.businessName,
          role: UserRole.OWNER,
          organizationId: organization.id,
        },
      });

      const tokens = generateTokenPair({
        userId: user.id,
        email: user.email,
        role: user.role,
        organizationId: organization.id,
        organizationSlug: organization.slug,
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          businessName: user.businessName,
          role: user.role,
          organizationId: organization.id,
          organization: {
            id: organization.id,
            name: organization.name,
            slug: organization.slug,
          },
        },
        ...tokens,
      };
    });
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            isActive: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    if (!user.organization?.isActive) {
      throw new Error('Organization is deactivated');
    }

    const isPasswordValid = await comparePassword(data.password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
      organizationSlug: user.organization.slug,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        businessName: user.businessName,
        role: user.role,
        organizationId: user.organizationId,
        organization: {
          id: user.organization.id,
          name: user.organization.name,
          slug: user.organization.slug,
        },
      },
      ...tokens,
    };
  }

  async joinOrganization(data: JoinOrganizationRequest): Promise<AuthResponse> {
    return prisma.$transaction(async (tx: any) => {
      // Find organization
      const organization = await tx.organization.findUnique({
        where: { slug: data.organizationSlug },
      });

      if (!organization) {
        throw new Error('Organization not found');
      }

      if (!organization.isActive) {
        throw new Error('Organization is not accepting new members');
      }

      // Check if user already exists in this organization
      const existingUser = await tx.user.findFirst({
        where: {
          email: data.email,
          organizationId: organization.id,
        },
      });

      if (existingUser) {
        throw new Error('User already exists in this organization');
      }

      // Hash password
      const hashedPassword = await hashPassword(data.password);

      // Create user
      const user = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phone || '',
          businessName: data.firstName + ' ' + data.lastName,
          role: UserRole.MEMBER,
          organizationId: organization.id,
        },
      });

      const tokens = generateTokenPair({
        userId: user.id,
        email: user.email,
        role: user.role,
        organizationId: organization.id,
        organizationSlug: organization.slug,
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          businessName: user.businessName,
          role: user.role,
          organizationId: organization.id,
          organization: {
            id: organization.id,
            name: organization.name,
            slug: organization.slug,
          },
        },
        ...tokens,
      };
    });
  }

  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        businessName: true,
        role: true,
        isActive: true,
        organizationId: true,
        createdAt: true,
        updatedAt: true,
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return user;
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const { verifyRefreshToken } = await import('@/utils/jwt');
      const decoded = verifyRefreshToken(refreshToken);

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: {
          organization: {
            select: {
              slug: true,
              isActive: true,
            },
          },
        },
      });

      if (!user || !user.isActive) {
        throw new Error('Invalid refresh token');
      }

      if (!user.organization?.isActive) {
        throw new Error('Organization is deactivated');
      }

      const { generateAccessToken } = await import('@/utils/jwt');
      const accessToken = generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        organizationSlug: user.organization.slug,
      });

      return { accessToken };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return;
    }

    // Delete any existing password reset tokens for this user
    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // Generate a secure random token
    const crypto = await import('crypto');
    const token = crypto.randomBytes(32).toString('hex');

    // Create password reset token (expires in 1 hour)
    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    // Send password reset email
    await sendPasswordResetEmail(email, token);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      throw new Error('Invalid or expired reset token');
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user password and delete the reset token
    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.delete({
        where: { token },
      }),
    ]);
  }

  async updateProfile(userId: string, data: UpdateProfileRequest): Promise<void> {
    // Check if email is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        email: data.email,
        id: { not: userId },
      },
    });

    if (existingUser) {
      throw new Error('Email is already taken by another user');
    }

    // Update user profile
    await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      },
    });
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const { comparePassword } = await import('@/utils/password');
    const isValidPassword = await comparePassword(oldPassword, user.password);

    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const { hashPassword } = await import('@/utils/password');
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }
}