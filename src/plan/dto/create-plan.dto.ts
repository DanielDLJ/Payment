import { IsNumber, IsString } from "class-validator";

export class CreatePlanDto {
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsNumber()
  price: number;
}
