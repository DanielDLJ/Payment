import { Controller, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { UserAddressService } from "./user-address.service";
import { CreateUserAddressDto } from "./dto/create-user-address.dto";
import { UpdateUserAddressDto } from "./dto/update-user-address.dto";
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { User } from "../user/entities/user.entity";

@ApiTags("user")
@Controller("user")
export class UserAddressController {
  constructor(private readonly userAddressService: UserAddressService) {}

  @Post(":userId/user-address")
  @ApiOperation({ summary: "Create a new user-address" })
  @ApiCreatedResponse({
    description: "The updated user",
    type: User,
  })
  create(
    @Param("userId") userId: string,
    @Body() createUserAddressDto: CreateUserAddressDto,
  ) {
    return this.userAddressService.create(+userId, createUserAddressDto);
  }

  @Patch(":userId/user-address/:id")
  @ApiOperation({ summary: "Update a user-address" })
  @ApiOkResponse({
    description: "The updated user",
    type: User,
  })
  update(
    @Param("userId") userId: string,
    @Param("id") id: string,
    @Body() updateUserAddressDto: UpdateUserAddressDto,
  ) {
    return this.userAddressService.update(+userId, +id, updateUserAddressDto);
  }

  @Delete(":userId/user-address/:id")
  @ApiOperation({ summary: "Remove a user-address" })
  @ApiOkResponse({
    description: "The updated user",
    type: User,
  })
  remove(@Param("userId") userId: string, @Param("id") id: string) {
    return this.userAddressService.remove(+userId, +id);
  }
}
