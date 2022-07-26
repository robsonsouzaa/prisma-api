import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { NotFoundError } from 'src/common/errors/types/NotFoundError';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDTO } from '../dto/create-post.dto';
import { UpdatePostDTO } from '../dto/update-post.dto';
import { PostEntity } from '../entities/post.entity';

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPostDTO: CreatePostDTO): Promise<PostEntity> {
    const { authorEmail } = createPostDTO;

    delete createPostDTO.authorEmail;

    const user = await this.prisma.user.findUnique({
      where: {
        email: authorEmail
      }
    });

    if (!user) {
      throw new NotFoundError('Autor não encontrado');
    }

    const data: Prisma.PostCreateInput = {
      ...createPostDTO,
      author: {
        connect: {
          email: authorEmail
        }
      }
    };

    return this.prisma.post.create({
      data
    });
  }

  async findAll(): Promise<PostEntity[]> {
    return this.prisma.post.findMany({
      include: {
        author: {
          select: {
            name: true
          }
        }
      }
    });
  }

  async findOne(id: number): Promise<PostEntity> {
    return this.prisma.post.findUnique({
      where: {
        id
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
  }

  async update(id: number, updatePostDTO: UpdatePostDTO): Promise<PostEntity> {
    const { authorEmail } = updatePostDTO;

    if (!authorEmail) {
      return this.prisma.post.update({
        where: {
          id
        },
        data: updatePostDTO
      });
    }

    delete updatePostDTO.authorEmail;

    const user = await this.prisma.user.findUnique({
      where: {
        email: authorEmail
      }
    });

    if (!user) {
      throw new NotFoundError('Autor não encontrado');
    }

    const data: Prisma.PostUpdateInput = {
      ...updatePostDTO,
      author: {
        connect: {
          email: authorEmail
        }
      }
    };

    return this.prisma.post.update({
      where: {
        id
      },
      data,
      include: {
        author: {
          select: {
            name: true
          }
        }
      }
    });
  }

  async remove(id: number): Promise<PostEntity> {
    return this.prisma.post.delete({
      where: {
        id
      }
    });
  }
}
