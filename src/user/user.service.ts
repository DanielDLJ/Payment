import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    this.logger.log(
      { ...createUserDto },
      `${this.findAll.name} - Starting logic to create a user`,
    );
    const user = this.userRepository.create(createUserDto);
    const createdUser = await this.userRepository.save(user);
    this.logger.log(
      `${this.findAll.name} - Finished logic to create a user with id: ${createdUser.id}`,
    );
    return createdUser;
  }

  async findAll() {
    this.logger.log(`${this.findAll.name} - Starting logic to find all users`);
    const users = await this.userRepository.find();

    this.logger.log(
      `${this.findAll.name} - Finished logic to find all ${users.length} users`,
    );
    return users;
  }

  async findOne(id: number) {
    this.logger.log(
      `${this.findOne.name} - Starting logic to find user with id: ${id}`,
    );

    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      const errorMessage = `User with id: ${id} not found`;
      this.logger.error(`${this.findOne.name} - ${errorMessage}`);
      throw new NotFoundException(errorMessage);
    }

    this.logger.log(
      `${this.findOne.name} - Finished logic to find user with id: ${id}`,
    );
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    this.logger.log(
      {
        ...updateUserDto,
      },
      `${this.update.name} - Starting logic to update user with id: ${id}`,
    );
    const user = await this.findOne(id);

    const updatedUser = await this.userRepository.save({
      ...user,
      ...updateUserDto,
    });

    this.logger.log(
      `${this.update.name} - Finished logic to update user with id: ${id}`,
    );
    return updatedUser;
  }
}
