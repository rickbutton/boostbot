import { config as configureDotEnv } from "dotenv";
import { startBot } from "./bot";
import { startExpressApp } from "./http";
import { configurePassport } from "./passport";

configureDotEnv();
configurePassport();

startBot();
startExpressApp()

