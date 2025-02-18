import { Test, TestingModule } from '@nestjs/testing';
import { MeetingController } from '../meeting.controller';
import { MeetingService } from '../meeting.service';

describe('MeetingController', () => {
  let controller: MeetingController;
  let service: MeetingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeetingController],
      providers: [
        {
          provide: MeetingService,
          useValue: {
            createMeeting: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MeetingController>(MeetingController);
    service = module.get<MeetingService>(MeetingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createMeeting', () => {
    it('should call MeetingService with the correct arguments', async () => {
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

      jest.spyOn(service, 'createMeeting').mockResolvedValue(mockMeeting);

      const req = { user: { userId: 'user-1' } };
      const body = { title: 'Test Meeting', description: 'Test Description' };
      const result = await controller.createMeeting(req, body);

      expect(result).toEqual(mockMeeting);
      expect(service.createMeeting).toHaveBeenCalledWith('user-1', body);
    });
  });
});
