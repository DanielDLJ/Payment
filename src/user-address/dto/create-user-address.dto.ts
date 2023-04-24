import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateUserAddressDto {
  @ApiProperty({ example: "Street A, 25" })
  @IsString()
  address: string;
  @ApiPropertyOptional({ default: "", example: "Apartment 3C" })
  @IsString()
  @IsOptional()
  complement?: string = "";
  @ApiProperty({ example: "Vila Mariana" })
  @IsString()
  district: string;
  @ApiProperty({ example: "Sorocaba" })
  @IsString()
  city: string;
  @ApiProperty({ example: "São Paulo" })
  @IsString()
  state: string;
  @ApiProperty({ example: "22222222" })
  @IsString()
  zipCode: string;
  @ApiPropertyOptional({
    example: false,
    default: false,
    description: "Default address",
  })
  @IsOptional()
  @IsBoolean()
  default?: boolean = false;
}
