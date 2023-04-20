import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { UserStatus } from "../enum/user-status.enum";
import { UserEmailStatus } from "../enum/user-email-status.enum";
import { randomUUID } from "crypto";

export class CreateUserDto {
  @IsString()
  @ApiProperty({
    example: randomUUID(),
    description: "User id from your system",
  })
  externalId: string;
  @ApiProperty({ example: "Ana" })
  @IsString()
  name: string;
  @ApiProperty({ example: "ana@hotmail.com" })
  @IsString()
  email: string;
  @ApiPropertyOptional({ example: UserStatus.ACTIVE })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;
  @ApiPropertyOptional({ example: UserEmailStatus.ALL })
  @IsEnum(UserEmailStatus)
  @IsOptional()
  emailStatus?: UserEmailStatus;
}
