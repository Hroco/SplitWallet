import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { Wallets } from "./wallets";
import { WalletItem } from "./walletItem";
import { RecieverData } from "./recieverData";
import { User } from "./user";

@Entity("walletUser")
export class WalletUser {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column("float", { default: 0 })
  bilance!: number;

  @Column("float", { default: 0 })
  total!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "userId" })
  users!: User | null;

  @OneToMany(() => WalletItem, (walletItem) => walletItem.payer)
  walletItems!: WalletItem[];

  @OneToMany(() => RecieverData, (recieverData) => recieverData.reciever)
  recieverData!: RecieverData[];

  @ManyToOne(() => Wallets, (wallets) => wallets.walletUsers, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "walletsId" })
  Wallets!: Wallets;

  @Column()
  walletsId!: string;

  @Column({ nullable: true })
  userId!: string | null;

  @Column({ default: false })
  deleted!: boolean;
}
