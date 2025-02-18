import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn((username, email) => {
      return {
        id: 1,
        username,
        email,
        token: 'mocked-access-token',
      };
    }),
    login: jest.fn((email) => {
      return {
        id: 1,
        email,
        token: 'mocked-access-token',
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should register a user and return user data with token', async () => {
      const registerDto: RegisterDto = {
        name: 'testuser',
        email: 'test@example.com',
        password: 'Password123',
      };

      const result = await authController.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(
        registerDto.name,
        registerDto.email,
        registerDto.password,
      );
      expect(result).toEqual({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        token: 'mocked-access-token',
      });
    });
  });

  describe('login', () => {
    it('should log in a user and return user data with token', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'Password123',
      };

      const result = await authController.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        token: 'mocked-access-token',
      });
    });
  });
});
