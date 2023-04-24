import { Module } from "@nestjs/common";
import { UserAddressService } from "./user-address.service";
import { UserAddressController } from "./user-address.controller";
import { TypeOrmModule } from "@nestjs/typeorm";

import { User } from "../user/entities/user.entity";
import { UserAddress } from "./entities/user-address.entity";
import { UserService } from "../user/user.service";

@Module({
  imports: [TypeOrmModule.forFeature([User, UserAddress])],
  controllers: [UserAddressController],
  providers: [UserAddressService, UserService],
})
export class UserAddressModule {}
