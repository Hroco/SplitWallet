import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { WalletItem } from "./walletItem";
import { WalletUser } from "./walletUser";

@Entity("wallets")
export class Wallets {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  globalId!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  currency!: string;

  @Column()
  category!: string;

  @Column("float", { default: 0 })
  total!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ default: false })
  isSynced!: boolean;

  @OneToMany(() => WalletUser, (walletUser) => walletUser.Wallets)
  walletUsers!: WalletUser[];

  @OneToMany(() => WalletItem, (walletItem) => walletItem.Wallets)
  walletItems!: WalletItem[];
}
