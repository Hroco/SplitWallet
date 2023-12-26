import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Wallets } from "./wallets";
import { WalletUser } from "./walletUser";
import { RecieverData } from "./recieverData";

@Entity("walletItem")
export class WalletItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column("simple-array")
  tags!: string[];

  @ManyToOne(() => WalletUser)
  @JoinColumn({ name: "userId" })
  payer!: WalletUser;

  @Column("float")
  amount!: number;

  @Column()
  type!: string;

  @Column()
  date!: Date;

  @OneToMany(() => RecieverData, (recieverData) => recieverData.WalletItem)
  recievers!: RecieverData[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Wallets, (wallets) => wallets.walletItems, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "walletsId" })
  Wallets!: Wallets;

  @Column()
  walletsId!: string;

  @Column()
  userId!: string;
}
