import { DataSource } from "typeorm";
import sqliteConnection from "../database";
import { Wallets } from "../entity/wallets";
import { WalletItem } from "../entity/walletItem";
import { WalletUser } from "../entity/walletUser";
import { RecieverData } from "../entity/recieverData";
import { User } from "../entity/user";
import { AddWalletsTable1626944570694 } from "../migration/1626944570694-AddWalletsTable";
import { AddWalletItemTable1626944570684 } from "../migration/1626944570684-AddWalletItemTable";
import { AddWalletUserTable1627029917418 } from "../migration/1627029917418-AddWalletUserTable";
import { AddRecieverDataTable1626863626662 } from "../migration/1626863626662-AddRecieverDataTable";
import { AddUserTable1626863626672 } from "../migration/1626863626672-AddUserTable";

const datasource = new DataSource({
  name: "splitWalletConnection",
  type: "capacitor",
  driver: sqliteConnection,
  database: "ionic-react-split-wallet",
  entities: [Wallets, WalletItem, WalletUser, RecieverData, User],
  migrations: [
    AddWalletsTable1626944570694,
    AddWalletItemTable1626944570684,
    AddWalletUserTable1627029917418,
    AddRecieverDataTable1626863626662,
    AddUserTable1626863626672,
  ],
  //logging: ["error", "query", "schema"],
  logging: ["error"],
  synchronize: true,
  migrationsRun: false,
});

export default datasource;
