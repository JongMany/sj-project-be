import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserRequestDto } from 'src/user/dto/register-user.request.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async register(registerDto: RegisterUserRequestDto): Promise<UserEntity> {
    const registerdUser = await this.userRepository.findOneBy({
      email: registerDto.email,
    });
    if (registerdUser) {
      throw new ConflictException('사용자가 이미 존재합니다.');
    }
    const user = this.userRepository.create(registerDto);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.userRepository.find();
    if (!users.length) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }
    return users;
  }

  async findOne(id: UserEntity['id']): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`유저 ID(${id})를 찾을 수 없습니다.`);
    }
    return user;
  }

  async findByEmail(email: UserEntity['email']): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`유저 이메일(${email})을 찾을 수 없습니다.`);
    }
    return user;
  }

  // async update(
  //   id: UserEntity['id'],
  //   updateUserDto: UpdateUserDto,
  // ): Promise<UserEntity> {
  //   await this.findOne(id); // 업데이트 전 유저가 존재하는지 확인
  //   await this.userRepository.update(id, updateUserDto);
  //   return this.findOne(id); // 업데이트 후 유저 정보 반환
  // }

  async remove(id: UserEntity['id']): Promise<void> {
    await this.findOne(id);
    await this.userRepository.softDelete(id);
  }
}
