import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { PlanStatus } from "../enum/plan-status.enum";

export class CreatePlanDto {
  @ApiProperty({ example: "Basic" })
  @IsString()
  name: string;
  @IsString()
  @ApiProperty({ example: "Basic plan" })
  description: string;
  @IsNumber()
  @ApiProperty({ example: 20.0 })
  price: number;
  @ApiPropertyOptional({ example: PlanStatus.ACTIVE })
  @IsEnum(PlanStatus)
  @IsOptional()
  status: PlanStatus;
}
