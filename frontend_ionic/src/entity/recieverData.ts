import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { WalletUser } from "./walletUser";
import { WalletItem } from "./walletItem";

@Entity("recieverData")
export class RecieverData {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => WalletUser, (walletUser) => walletUser.recieverData, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  reciever!: WalletUser;

  @Column("float")
  amount!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => WalletItem, (walletItem) => walletItem.recievers, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "walletItemId" })
  WalletItem!: WalletItem;

  @Column()
  walletItemId!: string;

  @Column()
  userId!: string;
}
