import { Test, TestingModule } from "@nestjs/testing";
import { UserAddressController } from "../../src/user-address/user-address.controller";
import { UserAddressService } from "../../src/user-address/user-address.service";
import { CreateUserAddressDto } from "../../src/user-address/dto/create-user-address.dto";
import { UpdateUserAddressDto } from "../../src/user-address/dto/update-user-address.dto";
import { User } from "../../src/user/entities/user.entity";
import { UserStatus } from "../../src/user/enum/user-status.enum";
import { UserEmailStatus } from "../../src/user/enum/user-email-status.enum";
import { randomUUID } from "crypto";
import { UserAddressStatus } from "../../src/user-address/enum/user-address-status.enum";

describe("UserAddressController", () => {
  let controller: UserAddressController;

  const defaultUser: User = {
    id: 1,
    externalId: randomUUID(),
    name: "Ana",
    email: "ana@hotmail.com",
    status: UserStatus.ACTIVE,
    emailStatus: UserEmailStatus.ALL,
    updatedAt: new Date(),
    createdAt: new Date(),
    adresses: [],
  };

  const mockUserAddressService = {
    create: jest.fn(
      (userId: number, createUserAddressDto: CreateUserAddressDto) => {
        return {
          ...defaultUser,
          id: userId,
          adresses: [{ id: Date.now(), ...createUserAddressDto }],
        };
      },
    ),
    update: jest.fn(
      (
        userId: number,
        id: number,
        updateUserAddressDto: UpdateUserAddressDto,
      ) => {
        return {
          ...defaultUser,
          id: userId,
          adresses: [{ id: id, ...updateUserAddressDto }],
        };
      },
    ),
    remove: jest.fn((userId: number, id: number) => {
      return {
        ...defaultUser,
        id: userId,
        adresses: [{ id: id, status: UserAddressStatus.DELETED }],
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserAddressController],
      providers: [UserAddressService],
    })
      .overrideProvider(UserAddressService)
      .useValue(mockUserAddressService)
      .compile();

    controller = module.get<UserAddressController>(UserAddressController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should create a user address", async () => {
    const userId = 1;
    const createUserAddressDto: CreateUserAddressDto = {
      address: "Street A, 25",
      complement: "Apartment 3C",
      district: "Vila Madalena",
      city: "Sorocaba",
      state: "São Paulo",
      zipCode: "22222222",
      default: false,
    };
    const user = await controller.create(
      userId.toString(),
      createUserAddressDto,
    );
    expect(user).toBeDefined();
    expect(user.id).toEqual(userId);
    expect(user.adresses[0]).toEqual({
      id: expect.any(Number),
      ...createUserAddressDto,
    });
    expect(user.adresses.length).toEqual(1);
  });

  it("should update a user address", async () => {
    const userId = 1;
    const userAddressId = 1;
    const updateUserAddressDto: UpdateUserAddressDto = {
      address: "Update Street A, 25",
      complement: "Apartment 3C",
      district: "Vila Madalena",
      city: "Sorocaba",
      state: "São Paulo",
      zipCode: "22222222",
      default: false,
    };
    const user = await controller.update(
      userId.toString(),
      userAddressId.toString(),
      updateUserAddressDto,
    );
    expect(user).toBeDefined();
    expect(user.id).toEqual(userId);
    expect(user.adresses[0]).toEqual({
      id: expect.any(Number),
      ...updateUserAddressDto,
    });
    expect(user.adresses.length).toEqual(1);
  });

  it("should remove a user address", async () => {
    const userId = 1;
    const userAddressId = 1;
    const user = await controller.remove(
      userId.toString(),
      userAddressId.toString(),
    );
    expect(user).toBeDefined();
    expect(user.id).toEqual(userId);
    expect(user.adresses[0].status).toEqual(UserAddressStatus.DELETED);
    expect(user.adresses.length).toEqual(1);
  });
});
