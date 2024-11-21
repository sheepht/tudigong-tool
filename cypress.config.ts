import { defineConfig } from "cypress";

import dotenv from "dotenv";
dotenv.config(); // 載入 .env 檔案

export default defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_baseUrl,
    // defaultCommandTimeout: 300000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return config;
    },
    video: true,
  },
});
