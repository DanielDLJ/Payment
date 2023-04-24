import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../user/entities/user.entity";
import { UserAddressStatus } from "../enum/user-address-status.enum";

@Entity()
export class UserAddress {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: "Street A, 25" })
  @Column({ nullable: false })
  address: string;

  @ApiProperty({ example: "Apartment 3C" })
  @Column({ default: "", nullable: false })
  complement: string;

  @ApiProperty({ example: "Vila Madalena" })
  @Column({ nullable: false })
  district: string;

  @ApiProperty({ example: "Sorocaba" })
  @Column({ nullable: false })
  city: string;

  @ApiProperty({ example: "São Paulo" })
  @Column({ nullable: false })
  state: string;

  @ApiProperty({ example: "22222222" })
  @Column({ nullable: false })
  zipCode: string;

  @ApiProperty({
    example: false,
    default: false,
    description: "Default address",
  })
  @Column({ default: false, nullable: false })
  default: boolean;

  @ApiProperty({
    example: UserAddressStatus.ACTIVE,
    default: UserAddressStatus.ACTIVE,
    enum: UserAddressStatus,
  })
  @Column({ default: UserAddressStatus.ACTIVE, nullable: false })
  status: UserAddressStatus;

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

  @ManyToOne(() => User, (user) => user.adresses)
  user: User;
}
