import {MigrationConfig} from "drizzle-orm/migrator";

type Config = {
    api: APIConfig;
    db: DBConfig;
    platform: string;
}
type APIConfig = { fileserverHits: number;
    port: number}
type DBConfig = {
    migrationConfig: MigrationConfig;
    url:string;
}
process.loadEnvFile()

function envOrThrow(key:string):string{
    const value = process.env[key]
    if (!value){
        throw new Error(`Missing ${key}`);
    }
    return value;
}




const migrationConfig: MigrationConfig = {
    migrationsFolder: "./src/db/migrations"
}

export const config: Config = {api:{fileserverHits: 0,
                                    port: Number(envOrThrow("PORT"))},
                                db: {migrationConfig: migrationConfig,
                                     url: envOrThrow("DB_URL")},
                                platform: envOrThrow("PLATFORM")};


