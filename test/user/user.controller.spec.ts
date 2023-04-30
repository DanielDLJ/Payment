import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "../../src/user/user.controller";
import { UserService } from "../../src/user/user.service";
import { CreateUserDto } from "../../src/user/dto/create-user.dto";
import { UpdateUserDto } from "../../src/user/dto/update-user.dto";
import { UserEmailStatus } from "../../src/user/enum/user-email-status.enum";
import { UserStatus } from "../../src/user/enum/user-status.enum";
import { randomUUID } from "crypto";

describe("UserController", () => {
  let controller: UserController;

  const mockUserService = {
    create: jest.fn((createUserDto: CreateUserDto) => {
      return {
        id: Date.now(),
        ...createUserDto,
      };
    }),
    update: jest.fn((id: string, updateUserDto: UpdateUserDto) => {
      return {
        id: +id,
        ...updateUserDto,
      };
    }),
    findOne: jest.fn((id: string) => {
      return {
        id: +id,
      };
    }),
    findAll: jest.fn(() => {
      return [];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should create a user", async () => {
    const createUserDto: CreateUserDto = {
      name: "Ana",
      email: "ana@hotmail.com",
      externalId: randomUUID(),
      emailStatus: UserEmailStatus.ALL,
      status: UserStatus.ACTIVE,
    };

    const user = await controller.create(createUserDto);

    expect(user).toBeDefined();
    expect(user).toEqual({
      id: expect.any(Number),
      ...createUserDto,
    });
    expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
  });

  it("should update a user", async () => {
    const id = Date.now();
    const updateUserDto: UpdateUserDto = {
      name: "Ana",
      email: "ana@gmail.com",
    };

    const user = await controller.update(id.toString(), updateUserDto);

    expect(user).toBeDefined();
    expect(user).toEqual({
      id: id,
      ...updateUserDto,
    });
  });

  it("should return a user by id", async () => {
    const id = Date.now();
    const user = await controller.findOne(id.toString());

    expect(user).toBeDefined();
    expect(user.id).toEqual(id);
  });

  it("should return all users", async () => {
    const users = await controller.findAll();

    expect(users).toBeDefined();
    expect(users).toEqual([]);
  });
});
