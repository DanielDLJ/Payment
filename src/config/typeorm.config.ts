import { ConfigModule, ConfigService } from "@nestjs/config";
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from "@nestjs/typeorm";
import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (config: ConfigService): Promise<TypeOrmModuleOptions> => {
    return {
      type: config.get<string>("dataBase.type") as any,
      host: config.get<string>("dataBase.host"),
      port: config.get<number>("dataBase.port"),
      username: config.get<string>("dataBase.username"),
      password: config.get<string>("dataBase.password"),
      database: config.get<string>("dataBase.database"),
      entities: ["dist/**/*.entity.{js,ts}"],
      migrations: ["dist/database/migrations/*.js"],
      migrationsTableName: config.get<string>("dataBase.migrationsTableName"),
      synchronize: config.get<boolean>("dataBase.synchronize"),
      logging: config.get<boolean>("dataBase.logging"),
      migrationsRun: config.get<boolean>("dataBase.migrationsRun"),
    };
  },
};

//Command to generate migration
//npm run migration:generate ./src/database/migrations/Init

export const dataSourceOptions: DataSourceOptions = {
  type: process.env.DATABASE_TYPE as any,
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_LOCAL_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
  entities: ["dist/**/*.entity.{js,ts}"],
  migrations: ["dist/database/migrations/*.js"],
  migrationsTableName: process.env.DATABASE_MIGRATIONS_TABLE_NAME,
  synchronize: process.env.DATABASE_SYNCHRONIZE === "true",
  logging: process.env.DATABASE_LOGGING === "true",
  migrationsRun: process.env.DATABASE_MIGRATIONS_RUN === "true",
};
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
