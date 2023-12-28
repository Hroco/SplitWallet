import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWalletsTable1626944570694 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE IF NOT EXISTS "Wallets" (
        "id" TEXT NOT NULL PRIMARY KEY, -- UUID
        "name" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "currency" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "total" REAL NOT NULL DEFAULT 0,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL,
        "isSynced" BOOLLEAN
    );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "Wallets";
        `);
  }
}
