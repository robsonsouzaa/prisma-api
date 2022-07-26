import { Injectable } from '@nestjs/common';
import { CreatePostDTO } from './dto/create-post.dto';
import { UpdatePostDTO } from './dto/update-post.dto';
import { PostsRepository } from './repositories/posts.repository';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  create(createPostDTO: CreatePostDTO) {
    return this.postsRepository.create(createPostDTO);
  }

  findAll() {
    return this.postsRepository.findAll();
  }

  findOne(id: number) {
    return this.postsRepository.findOne(id);
  }

  update(id: number, updatePostDTO: UpdatePostDTO) {
    return this.postsRepository.update(id, updatePostDTO);
  }

  remove(id: number) {
    return this.postsRepository.remove(id);
  }
}
