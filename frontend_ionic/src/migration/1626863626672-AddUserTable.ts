import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserTable1626863626672 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT,
      "localId" TEXT NOT NULL,
      "email" TEXT,
      "emailVerified" BOLLEAN,
      "image" TEXT
  );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "User";
        `);
  }
}
