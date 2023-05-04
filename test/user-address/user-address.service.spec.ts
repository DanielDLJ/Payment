import { Test, TestingModule } from "@nestjs/testing";
import { UserAddressService } from "../../src/user-address/user-address.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserAddress } from "../../src/user-address/entities/user-address.entity";
import { User } from "../../src/user/entities/user.entity";
import { randomUUID } from "crypto";
import { UserStatus } from "../../src/user/enum/user-status.enum";
import { UserEmailStatus } from "../../src/user/enum/user-email-status.enum";
import { UserAddressStatus } from "../../src/user-address/enum/user-address-status.enum";
import { CreateUserAddressDto } from "../../src/user-address/dto/create-user-address.dto";
import { UserService } from "../../src/user/user.service";
import { UpdateUserAddressDto } from "../../src/user-address/dto/update-user-address.dto";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe("UserAddressService", () => {
  let service: UserAddressService;

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

  const defaultUserAddress: UserAddress = {
    id: 1,
    address: "Street A, 25",
    complement: "Apartment 3C",
    district: "Vila Madalena",
    city: "Sorocaba",
    state: "São Paulo",
    zipCode: "22222222",
    default: false,
    status: UserAddressStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: defaultUser,
  };

  const mockUserAddressRepository = {
    create: jest
      .fn()
      .mockImplementation(
        (createUserAddressDto: CreateUserAddressDto): UserAddress => {
          return {
            id: Date.now(),
            status: UserAddressStatus.ACTIVE,
            complement: "",
            default: false,
            ...createUserAddressDto,
            updatedAt: new Date(),
            createdAt: new Date(),
            user: defaultUser,
          };
        },
      ),
    save: jest.fn().mockImplementation((userAddress) =>
      Promise.resolve<UserAddress>({
        ...defaultUserAddress,
        ...userAddress,
      }),
    ),
    update: jest
      .fn()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .mockImplementation((_criteria: any, _partialEntity: any) => {
        return Promise.resolve();
      }),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserAddressService,
        UserService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        {
          provide: getRepositoryToken(UserAddress),
          useValue: mockUserAddressRepository,
        },
      ],
    }).compile();

    service = module.get<UserAddressService>(UserAddressService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create the first address as default", async () => {
      mockUserRepository.findOne = jest
        .fn()
        .mockImplementationOnce((id: number) => {
          return Promise.resolve<User>({
            ...defaultUser,
            id: id,
            adresses: [],
          });
        })
        .mockImplementationOnce((id: number) => {
          return Promise.resolve<User>({
            ...defaultUser,
            id: id,
            adresses: [{ ...defaultUserAddress, default: true }],
          });
        });

      const createUserAddressDto: CreateUserAddressDto = {
        address: "Street A, 25",
        complement: "Apartment 3C",
        district: "Vila Madalena",
        city: "Sorocaba",
        state: "São Paulo",
        zipCode: "22222222",
        default: false,
      };

      const user = await service.create(defaultUser.id, createUserAddressDto);

      expect(user).toBeDefined();
      expect(mockUserRepository.findOne).toBeCalledTimes(2);
      expect(mockUserAddressRepository.update).toBeCalledTimes(0);
      expect(user.adresses.length).toBe(1);
      expect(mockUserAddressRepository.create).toBeCalledWith({
        ...createUserAddressDto,
        default: true,
      });
      expect(user.adresses[0].default).toBe(true);
    });
    it("should create the second address as default and uncheck the previous default", async () => {
      mockUserRepository.findOne = jest
        .fn()
        .mockImplementationOnce((id: number) => {
          return Promise.resolve<User>({
            ...defaultUser,
            id: id,
            adresses: [{ ...defaultUserAddress, default: true }],
          });
        })
        .mockImplementationOnce((id: number) => {
          return Promise.resolve<User>({
            ...defaultUser,
            id: id,
            adresses: [
              { ...defaultUserAddress, default: false },
              { ...defaultUserAddress, id: 2, default: true },
            ],
          });
        });

      const createUserAddressDto: CreateUserAddressDto = {
        address: "Street A, 25",
        complement: "Apartment 3C",
        district: "Vila Madalena",
        city: "Sorocaba",
        state: "São Paulo",
        zipCode: "22222222",
        default: true,
      };

      const user = await service.create(defaultUser.id, createUserAddressDto);

      expect(user).toBeDefined();
      expect(mockUserRepository.findOne).toBeCalledTimes(2);
      expect(mockUserAddressRepository.update).toBeCalledTimes(1);
      expect(user.adresses.length).toBe(2);
      expect(user.adresses[0].default).toBe(false);
      expect(user.adresses[1].default).toBe(true);
    });
  });

  describe("update", () => {
    it("1 - should update the address", async () => {
      const updateUserAddressDto: UpdateUserAddressDto = {
        address: "Update Street A, 25",
        default: true,
      };

      mockUserRepository.findOne = jest
        .fn()
        .mockImplementationOnce((id: number) => {
          return Promise.resolve<User>({
            ...defaultUser,
            id: id,
            adresses: [{ ...defaultUserAddress, default: true }],
          });
        })
        .mockImplementationOnce((id: number) => {
          return Promise.resolve<User>({
            ...defaultUser,
            id: id,
            adresses: [
              {
                ...defaultUserAddress,
                address: updateUserAddressDto.address,
                default: true,
              },
            ],
          });
        });

      const user = await service.update(
        defaultUser.id,
        defaultUserAddress.id,
        updateUserAddressDto,
      );

      expect(user).toBeDefined();
      expect(mockUserRepository.findOne).toBeCalledTimes(2);
      expect(mockUserAddressRepository.update).toBeCalledTimes(1);
      expect(mockUserAddressRepository.save).toBeCalledTimes(1);
      expect(user.adresses[0].address).toBe(updateUserAddressDto.address);
    });
    it("2 - should update the address (no default to disable)", async () => {
      const updateUserAddressDto: UpdateUserAddressDto = {
        address: "Update Street A, 25",
        default: true,
      };

      mockUserRepository.findOne = jest
        .fn()
        .mockImplementationOnce((id: number) => {
          return Promise.resolve<User>({
            ...defaultUser,
            id: id,
            adresses: [{ ...defaultUserAddress, default: false }],
          });
        })
        .mockImplementationOnce((id: number) => {
          return Promise.resolve<User>({
            ...defaultUser,
            id: id,
            adresses: [
              {
                ...defaultUserAddress,
                address: updateUserAddressDto.address,
                default: true,
              },
            ],
          });
        });

      const user = await service.update(
        defaultUser.id,
        defaultUserAddress.id,
        updateUserAddressDto,
      );

      expect(user).toBeDefined();
      expect(mockUserRepository.findOne).toBeCalledTimes(2);
      expect(mockUserAddressRepository.update).toBeCalledTimes(0);
      expect(mockUserAddressRepository.save).toBeCalledTimes(1);
      expect(user.adresses[0].address).toBe(updateUserAddressDto.address);
    });
    it("should throw an error if the user is not found", async () => {
      const updateUserAddressDto: UpdateUserAddressDto = {
        address: "Update Street A, 25",
        default: true,
      };

      mockUserRepository.findOne = jest
        .fn()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .mockImplementationOnce((_id: number) => {
          return Promise.resolve<User>(undefined);
        });

      await expect(
        service.update(
          defaultUser.id,
          defaultUserAddress.id,
          updateUserAddressDto,
        ),
      ).rejects.toThrow(NotFoundException);
    });
    it("should throw an error if the address is not found in the user", async () => {
      const updateUserAddressDto: UpdateUserAddressDto = {
        address: "Update Street A, 25",
        default: true,
      };

      mockUserRepository.findOne = jest
        .fn()
        .mockImplementationOnce((id: number) => {
          return Promise.resolve<User>({
            ...defaultUser,
            id: id,
            adresses: [{ ...defaultUserAddress, id: 1000, default: true }],
          });
        });

      await expect(
        service.update(defaultUser.id, 10, updateUserAddressDto),
      ).rejects.toThrow(NotFoundException);
    });
    it("should throw an error if try to update a address already deleted", async () => {
      const updateUserAddressDto: UpdateUserAddressDto = {
        address: "Update Street A, 25",
        default: true,
      };

      mockUserRepository.findOne = jest
        .fn()
        .mockImplementationOnce((id: number) => {
          return Promise.resolve<User>({
            ...defaultUser,
            id: id,
            adresses: [
              { ...defaultUserAddress, status: UserAddressStatus.DELETED },
            ],
          });
        });

      await expect(
        service.update(
          defaultUser.id,
          defaultUserAddress.id,
          updateUserAddressDto,
        ),
      ).rejects.toThrow(BadRequestException);
    });
    it("should throw an error if try to update a default address to false", async () => {
      const updateUserAddressDto: UpdateUserAddressDto = {
        address: "Update Street A, 25",
        default: false,
      };

      mockUserRepository.findOne = jest
        .fn()
        .mockImplementationOnce((id: number) => {
          return Promise.resolve<User>({
            ...defaultUser,
            id: id,
            adresses: [{ ...defaultUserAddress, default: true }],
          });
        });

      await expect(
        service.update(
          defaultUser.id,
          defaultUserAddress.id,
          updateUserAddressDto,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("remove", () => {
    it("should remove the address", async () => {
      const idToRemove = 25;
      mockUserRepository.findOne = jest
        .fn()
        .mockImplementationOnce((id: number) => {
          return Promise.resolve<User>({
            ...defaultUser,
            id: id,
            adresses: [
              { ...defaultUserAddress, default: true },
              { ...defaultUserAddress, id: idToRemove, default: false },
            ],
          });
        })
        .mockImplementationOnce((id: number) => {
          return Promise.resolve<User>({
            ...defaultUser,
            id: id,
            adresses: [
              { ...defaultUserAddress, default: true },
              {
                ...defaultUserAddress,
                id: idToRemove,
                default: false,
                status: UserAddressStatus.DELETED,
              },
            ],
          });
        });

      const user = await service.remove(defaultUser.id, idToRemove);

      expect(user).toBeDefined();
      expect(mockUserRepository.findOne).toBeCalledTimes(2);
      expect(mockUserAddressRepository.save).toBeCalledTimes(1);
      expect(user.adresses.length).toBe(2);
      expect(user.adresses[1].status).toBe(UserAddressStatus.DELETED);
    });
    it("should throw an error if the user is not found", async () => {
      mockUserRepository.findOne = jest
        .fn()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .mockImplementationOnce((_id: number) => {
          return Promise.resolve<User>(undefined);
        });

      await expect(service.remove(defaultUser.id, 10)).rejects.toThrow(
        NotFoundException,
      );
    });
    it("should throw an error if the address is not found in the user", async () => {
      mockUserRepository.findOne = jest
        .fn()
        .mockImplementationOnce((id: number) => {
          return Promise.resolve<User>({
            ...defaultUser,
            id: id,
            adresses: [{ ...defaultUserAddress, id: 1000, default: true }],
          });
        });

      await expect(service.remove(defaultUser.id, 10)).rejects.toThrow(
        NotFoundException,
      );
    });
    it("should throw an error if try to remove a address already deleted", async () => {
      const idToRemove = 25;
      mockUserRepository.findOne = jest
        .fn()
        .mockImplementationOnce((id: number) => {
          return Promise.resolve<User>({
            ...defaultUser,
            id: id,
            adresses: [
              { ...defaultUserAddress, default: true },
              {
                ...defaultUserAddress,
                id: idToRemove,
                status: UserAddressStatus.DELETED,
              },
            ],
          });
        });

      await expect(service.remove(defaultUser.id, idToRemove)).rejects.toThrow(
        BadRequestException,
      );
    });
    it("should throw an error if try to remove the default address", async () => {
      mockUserRepository.findOne = jest
        .fn()
        .mockImplementationOnce((id: number) => {
          return Promise.resolve<User>({
            ...defaultUser,
            id: id,
            adresses: [{ ...defaultUserAddress, default: true }],
          });
        });

      await expect(
        service.remove(defaultUser.id, defaultUserAddress.id),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
