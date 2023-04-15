export const production = async () => {
  //Load async config (AppAzureConfig, ...)
  return {
    port: Number(process.env.PORT),
    swagger: {
      title: process.env.SWAGGER_TITLE,
      description: process.env.SWAGGER_DESCRIPTION,
      version: process.env.SWAGGER_VERSION,
      contact: {
        name: process.env.SWAGGER_CONTACT_NAME,
        email: process.env.SWAGGER_CONTACT_EMAIL,
      },
      enable: process.env.SWAGGER_ENABLE === "true",
    },
    dataBase: {
      type: process.env.DATABASE_TYPE,
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      migrationsTableName: process.env.DATABASE_MIGRATIONS_TABLE_NAME,
      synchronize: process.env.DATABASE_SYNCHRONIZE === "true",
      logging: process.env.DATABASE_LOGGING === "true",
      migrationsRun: process.env.DATABASE_MIGRATIONS_RUN === "true",
    },
  };
};
