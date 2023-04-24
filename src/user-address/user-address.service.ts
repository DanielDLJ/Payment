import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserAddressDto } from "./dto/create-user-address.dto";
import { UpdateUserAddressDto } from "./dto/update-user-address.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { In, Repository } from "typeorm";
import { UserService } from "../user/user.service";
import { UserAddress } from "./entities/user-address.entity";
import { UserAddressStatus } from "./enum/user-address-status.enum";

@Injectable()
export class UserAddressService {
  private readonly logger = new Logger(UserAddressService.name);

  constructor(
    @InjectRepository(UserAddress)
    private userAddressRepository: Repository<UserAddress>,
    private readonly userService: UserService,
  ) {}

  async create(userId: number, createUserAddressDto: CreateUserAddressDto) {
    this.logger.log(
      { ...createUserAddressDto, userId },
      `${this.create.name} - Starting logic to create a userAddress`,
    );
    const user = await this.userService.findOne(userId);

    // If the user is trying to create a new address and this address is the default,
    // the previous default address will be updated to false
    if (createUserAddressDto.default === true) {
      await this.disableDefaultAddress(user);
    }

    // If the user does not have any address, the first address will be the default
    if (createUserAddressDto.default === false && user.adresses.length === 0)
      createUserAddressDto.default = true;

    const userAddress = this.userAddressRepository.create(createUserAddressDto);
    userAddress.user = user;
    await this.userAddressRepository.save(userAddress);
    const userUpdated = await this.userService.findOne(userId);

    this.logger.log(
      `${this.create.name} - Finished logic to create a userAddress`,
    );

    return userUpdated;
  }

  async update(
    userId: number,
    id: number,
    updateUserAddressDto: UpdateUserAddressDto,
  ) {
    this.logger.log(
      { ...updateUserAddressDto, userId },
      `${this.update.name} - Starting logic to update a userAddress`,
    );
    const user = await this.userService.findOne(userId);

    const address = user.adresses.filter((address) => address.id === id);

    this.checkAddressExists(address, id);
    this.checkAddressStatus(address[0]);

    // If the user is trying to update an address and this address is the default,
    // the previous default address will be updated to false
    if (updateUserAddressDto.default === true) {
      await this.disableDefaultAddress(user);
      // If user want to update default address to false
      // it will throw error because user must have default address
    } else if (address[0].default === true) {
      const errorMessage = `You cannot disable the default address`;
      this.logger.error(`${this.update.name} - ${errorMessage}`);
      throw new BadRequestException(errorMessage);
    }

    await this.userAddressRepository.save({
      ...address[0],
      ...updateUserAddressDto,
    });

    const userUpdated = await this.userService.findOne(userId);

    this.logger.log(
      `${this.update.name} - Finished logic to update a userAddress`,
    );

    return userUpdated;
  }

  async remove(userId: number, id: number) {
    this.logger.log(
      { userId, id },
      `${this.remove.name} - Starting logic to remove a userAddress`,
    );
    const user = await this.userService.findOne(userId);

    const address = user.adresses.filter((address) => address.id === id);

    this.checkAddressExists(address, id);
    this.checkAddressStatus(address[0]);

    // If the user is trying to remove an address and this address is the default,
    // it will throw error because user must have default address
    if (address[0].default === true) {
      const errorMessage = `You cannot remove the default address`;
      this.logger.error(`${this.remove.name} - ${errorMessage}`);
      throw new BadRequestException(errorMessage);
    }

    await this.userAddressRepository.save({
      ...address[0],
      status: UserAddressStatus.DELETED,
    });

    const userUpdated = await this.userService.findOne(userId);

    this.logger.log(
      `${this.remove.name} - Finished logic to remove a userAddress`,
    );

    return userUpdated;
  }

  private checkAddressExists(address: UserAddress[], addressId: number) {
    if (address.length === 0) {
      const errorMessage = `Address with id: ${addressId} not found`;
      this.logger.error(`${this.checkAddressExists.name} - ${errorMessage}`);
      throw new NotFoundException(errorMessage);
    }
  }

  private checkAddressStatus(address: UserAddress) {
    if (address.status === UserAddressStatus.DELETED) {
      const errorMessage = `Address with id: ${address.id} already deleted`;
      this.logger.error(`${this.checkAddressStatus.name} - ${errorMessage}`);
      throw new BadRequestException(errorMessage);
    }
  }

  private async disableDefaultAddress(user: User) {
    const defaultAdresses = user.adresses
      .filter((address) => address.default === true)
      .map((address) => address.id);

    if (defaultAdresses.length === 0) return;

    await this.userAddressRepository.update(
      { id: In(defaultAdresses) },
      { default: false },
    );
    this.logger.log(
      { defaultAdresses },
      `${this.disableDefaultAddress.name} - Default address disabled`,
    );
  }
}
