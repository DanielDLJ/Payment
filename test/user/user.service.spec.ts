import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../../src/user/user.service";
import { CreateUserDto } from "../../src/user/dto/create-user.dto";
import { UserStatus } from "../../src/user/enum/user-status.enum";
import { User } from "../../src/user/entities/user.entity";
import { UserEmailStatus } from "../../src/user/enum/user-email-status.enum";
import { randomUUID } from "crypto";
import { getRepositoryToken } from "@nestjs/typeorm";
import { FindOneOptions, FindOptionsWhere } from "typeorm";
import { UpdateUserDto } from "src/user/dto/update-user.dto";

describe("UserService", () => {
  let service: UserService;

  const expectedUser: User = {
    id: expect.any(Number),
    externalId: expect.any(String),
    name: expect.any(String),
    email: expect.any(String),
    status: expect.any(String),
    emailStatus: expect.any(String),
    updatedAt: expect.any(Date),
    createdAt: expect.any(Date),
    adresses: expect.any(Array),
  };

  const defaultUser: User = {
    id: Date.now(),
    externalId: randomUUID(),
    name: "Ana",
    email: "ana@hotmail.com",
    status: UserStatus.ACTIVE,
    emailStatus: UserEmailStatus.ALL,
    updatedAt: new Date(),
    createdAt: new Date(),
    adresses: [],
  };

  const mockUserRepository = {
    create: jest
      .fn()
      .mockImplementation((createUserDto: CreateUserDto): User => {
        return {
          id: Date.now(),
          status: UserStatus.ACTIVE,
          emailStatus: UserEmailStatus.ALL,
          ...createUserDto,
          updatedAt: new Date(),
          createdAt: new Date(),
          adresses: [],
        };
      }),
    save: jest.fn().mockImplementation((user) =>
      Promise.resolve<User>({
        ...defaultUser,
        ...user,
      }),
    ),
    find: jest.fn().mockImplementation(() => Promise.resolve<User[]>([])),
    findOne: jest.fn().mockImplementation((options: FindOneOptions<User>) => {
      const id = (options.where as FindOptionsWhere<User>).id as number;
      return Promise.resolve<User>({
        ...defaultUser,
        id: id,
      });
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a user", async () => {
      const createUserDto: CreateUserDto = {
        name: "Ana",
        email: "ana@hotmail.com",
        externalId: randomUUID(),
        emailStatus: UserEmailStatus.ALL,
        status: UserStatus.ACTIVE,
      };

      const user = await service.create(createUserDto);

      expect(user).toBeDefined();
      expect(user).toEqual({
        ...expectedUser,
        ...createUserDto,
      });
      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe("findAll", () => {
    it("should return an array of users", async () => {
      const users = await service.findAll();

      expect(users).toBeDefined();
      expect(users).toEqual([]);
      expect(mockUserRepository.find).toHaveBeenCalled();
    });
  });

  describe("findOne", () => {
    it("should return a user", async () => {
      const id = Date.now();
      const user = await service.findOne(id);

      expect(user).toBeDefined();
      expect(user).toEqual({
        ...expectedUser,
        id: id,
      });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: id },
        relations: {
          adresses: true,
        },
      });
    });
  });

  describe("update", () => {
    it("should update a user", async () => {
      const id = Date.now();
      const updateUserDto: UpdateUserDto = {
        name: "Ana",
        email: "ana@gmail.com",
      };
      const user = await service.update(id, updateUserDto);

      expect(user).toBeDefined();
      expect(user).toEqual({
        ...expectedUser,
        id: id,
        ...updateUserDto,
      });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: id },
        relations: {
          adresses: true,
        },
      });
    });
  });
});
