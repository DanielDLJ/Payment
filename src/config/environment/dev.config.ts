export const development = async () => {
  //Only for local development
  return {
    port: Number(process.env.PORT) || 3000,
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
      type: process.env.DATABASE_TYPE || "mysql",
      host: process.env.DATABASE_HOST || "localhost",
      port: Number(process.env.DATABASE_PORT) || 3306,
      username: process.env.DATABASE_USERNAME || "root",
      password: process.env.DATABASE_PASSWORD || "123456",
      database: process.env.DATABASE_NAME || "payment",
      migrationsTableName:
        process.env.DATABASE_MIGRATIONS_TABLE_NAME || "migrations",
      synchronize: process.env.DATABASE_SYNCHRONIZE === "true",
      logging: process.env.DATABASE_LOGGING === "true",
      migrationsRun: process.env.DATABASE_MIGRATIONS_RUN === "true",
    },
  };
};
