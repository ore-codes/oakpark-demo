import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should create a new user and return user data with a token', async () => {
      const hashedPassword = 'hashedPassword123';
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce(hashedPassword);

      const newUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: hashedPassword,
      };

      mockPrismaService.user.create.mockResolvedValueOnce(newUser);
      mockJwtService.sign.mockReturnValueOnce('mocked-access-token');

      const result = await authService.register(
        'testuser',
        'test@example.com',
        'Password123',
      );

      expect(bcrypt.hash).toHaveBeenCalledWith('Password123', 10);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          username: 'testuser',
          email: 'test@example.com',
          password: hashedPassword,
        },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: newUser.id,
        email: newUser.email,
      });
      expect(result).toEqual({
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
        },
        token: 'mocked-access-token',
      });
    });
  });

  describe('login', () => {
    it('should validate user credentials and return user data with a token', async () => {
      const hashedPassword = 'hashedPassword123';
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      const foundUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: hashedPassword,
      };

      mockPrismaService.user.findUnique.mockResolvedValueOnce(foundUser);
      mockJwtService.sign.mockReturnValueOnce('mocked-access-token');

      const result = await authService.login('test@example.com', 'Password123');

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'Password123',
        foundUser.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: foundUser.id,
        email: foundUser.email,
      });
      expect(result).toEqual({
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
        },
        token: 'mocked-access-token',
      });
    });

    it('should throw an error if user is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);

      await expect(
        authService.login('test@example.com', 'Password123'),
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('should throw an error if password is incorrect', async () => {
      const hashedPassword = 'hashedPassword123';
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      const foundUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password: hashedPassword,
      };

      mockPrismaService.user.findUnique.mockResolvedValueOnce(foundUser);

      await expect(
        authService.login('test@example.com', 'WrongPassword'),
      ).rejects.toThrowError(UnauthorizedException);
    });
  });
});
