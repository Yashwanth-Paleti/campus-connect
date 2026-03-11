import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { defineConfig } from "@prisma/config";

export default defineConfig({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
    },
    datasource: {
        url: process.env.DIRECT_URL as string,
    },
});