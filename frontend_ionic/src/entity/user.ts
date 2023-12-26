import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity("user")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column("text", { nullable: true })
  name!: string | null;

  @Column("text")
  localId!: string;

  @Column("text", { nullable: true })
  email!: string | null;

  @Column("boolean", { nullable: true })
  emailVerified!: boolean | null;

  @Column("text", { nullable: true })
  image!: string | null;
}
