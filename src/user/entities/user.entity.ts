import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { randomUUID } from "crypto";
import { UserStatus } from "../enum/user-status.enum";
import { UserEmailStatus } from "../enum/user-email-status.enum";
import { UserAddress } from "../../user-address/entities/user-address.entity";

@Entity()
export class User {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty({
    example: randomUUID(),
    description: "User id from your system",
  })
  @Column({ unique: true })
  externalId: string;
  @ApiProperty({ example: "Ana" })
  @Column()
  name: string;
  @ApiProperty({ example: "ana@hotmail.com" })
  @Column()
  email: string;
  @ApiProperty({ example: UserStatus.ACTIVE })
  @Column({
    type: "enum",
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;
  @ApiProperty({ example: UserEmailStatus.ALL })
  @Column({
    type: "enum",
    enum: UserEmailStatus,
    default: UserEmailStatus.ALL,
  })
  emailStatus: UserEmailStatus;
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

  @ApiProperty({ type: () => UserAddress, isArray: true })
  @OneToMany(() => UserAddress, (address) => address.user)
  adresses: UserAddress[];
}
