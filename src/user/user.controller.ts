import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Logger,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { User } from "./entities/user.entity";

@ApiTags("user")
@Controller("user")
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: "Create a new user" })
  @ApiCreatedResponse({
    description: "The created user",
    type: User,
  })
  async create(@Body() createUserDto: CreateUserDto) {
    this.logger.log("Starting to create user");
    const createdUser = await this.userService.create(createUserDto);
    this.logger.log(`Finished creating user with id: ${createdUser.id}`);
    return createdUser;
  }

  @Get()
  @ApiOperation({ summary: "Find all users" })
  @ApiOkResponse({
    description: "All found users",
    type: User,
    isArray: true,
  })
  async findAll() {
    this.logger.log("Starting to find all users");
    const users = await this.userService.findAll();
    this.logger.log(`Finished finding all ${users.length} users`);
    return users;
  }

  @Get(":id")
  @ApiOperation({ summary: "Find a user by id" })
  @ApiOkResponse({
    description: "The found user",
    type: User,
  })
  async findOne(@Param("id") id: string) {
    this.logger.log(`Starting to find user with id: ${id} `);
    const user = await this.userService.findOne(+id);
    this.logger.log(`Finished finding user ${user.id}`);
    return user;
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    this.logger.log(`Starting to update user with id: ${id}`);
    const updateUser = await this.userService.update(+id, updateUserDto);
    this.logger.log(`Finished updating user ${updateUser.id}`);
    return updateUser;
  }
}
