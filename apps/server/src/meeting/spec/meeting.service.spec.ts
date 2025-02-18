import { Test, TestingModule } from '@nestjs/testing';
import { MeetingService } from '../meeting.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('MeetingService', () => {
  let service: MeetingService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeetingService,
        {
          provide: PrismaService,
          useValue: {
            meeting: {
              create: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<MeetingService>(MeetingService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createMeeting', () => {
    it('should create a meeting and return it', async () => {
      const mockMeeting = {
        id: '1',
        title: 'Test Meeting',
        code: 'abcdefghi',
        userId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        durationInSecs: 0,
        description: 'Test Description',
      };

      jest.spyOn(prisma.meeting, 'create').mockResolvedValue(mockMeeting);
      jest.spyOn(prisma.meeting, 'findUnique').mockResolvedValue(null); // No collision

      const result = await service.createMeeting('user-1', {
        title: 'Test Meeting',
        description: 'Test Description',
      });

      expect(result).toEqual(mockMeeting);
      expect(prisma.meeting.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-1',
          title: 'Test Meeting',
          description: 'Test Description',
          code: expect.any(String),
          durationInSecs: 0,
        },
      });
    });

    it('should retry on code collision and generate a unique code', async () => {
      jest
        .spyOn(prisma.meeting, 'findUnique')
        .mockResolvedValueOnce({ code: 'abcdefghi' } as any) // Simulate collision
        .mockResolvedValue(null); // No collision after retry

      jest.spyOn(prisma.meeting, 'create').mockResolvedValue({
        id: '1',
        title: 'Test Meeting',
        code: 'newcode123',
        userId: 'user-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        durationInSecs: 0,
        description: 'Test Description',
      });

      const result = await service.createMeeting('user-1', {
        title: 'Test Meeting',
        description: 'Test Description',
      });

      expect(result.code).toEqual('newcode123');
      expect(prisma.meeting.create).toHaveBeenCalledTimes(1);
    });
  });
});
