import { defineConfig } from "cypress";
import fs from "fs";

import dotenv from "dotenv";
dotenv.config(); // 載入 .env 檔案

export default defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_baseUrl,
    // defaultCommandTimeout: 300000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on(
        "after:spec",
        (spec: Cypress.Spec, results: CypressCommandLine.RunResult) => {
          if (results && results.video) {
            // Do we have failures for any retry attempts?
            const failures = results.tests.some((test) =>
              test.attempts.some((attempt) => attempt.state === "failed")
            );
            if (!failures) {
              // delete the video if the spec passed and no tests retried
              fs.unlinkSync(results.video);
            }
          }
        }
      );
      return config;
    },
    video: true,
  },
});
