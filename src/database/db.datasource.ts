import 'dotenv/config'
import { Account } from "../models/account.model"
import { Role } from "../models/role.model"
import "reflect-metadata"
import { DataSource } from "typeorm"
const path = require('path');
const entities_path = path.join(__dirname, '..','models','*')

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "admin",
    database: process.env.DB_NAME || "test",
    entities: [entities_path],
    synchronize: true,
    logging: false,
    migrations: [__dirname + "/migrations/*.js"],
})