import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { PlanStatus } from "../enum/plan-status.enum";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Plan {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty({ example: "Basic" })
  @Column()
  name: string;
  @ApiProperty({ example: "Basic plan" })
  @Column()
  description: string;
  @ApiProperty({ example: 20.0 })
  @Column()
  price: number;
  @ApiProperty({ example: PlanStatus.ACTIVE })
  @Column({
    type: "enum",
    enum: PlanStatus,
    default: PlanStatus.ACTIVE,
  })
  status: PlanStatus;
  @ApiProperty({ example: new Date().toISOString() })
  @CreateDateColumn({
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  createdAt: Date;
  @ApiProperty({ example: new Date().toISOString() })
  @UpdateDateColumn({
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  updatedAt: Date;
}
