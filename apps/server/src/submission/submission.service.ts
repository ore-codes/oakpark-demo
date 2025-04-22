import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class SubmissionService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: this.config.get<string>('cloudinary.cloudName'),
      api_key: this.config.get<string>('cloudinary.apiKey'),
      api_secret: this.config.get<string>('cloudinary.apiSecret'),
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'submissions',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  async createSubmission(
    userId: string,
    meetingId: string,
    file: Express.Multer.File,
  ) {
    const fileUrl = await this.uploadFile(file);

    return this.prisma.submission.create({
      data: {
        fileUrl,
        fileName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        user: {
          connect: {
            id: userId
          }
        },
        meeting: {
          connect: {
            id: meetingId
          }
        }
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
  }

  async getSubmissionsByMeeting(meetingId: string) {
    return this.prisma.submission.findMany({
      where: {
        meetingId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getSubmissionsByUser(userId: string) {
    return this.prisma.submission.findMany({
      where: {
        userId,
      },
      include: {
        meeting: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
} 