const express = require("express");
const ethers = require("ethers");
require("dotenv").config();
const initailSetupScript = require("./app/initialScript")
const watcher = require("./app/watcher")
const PORT = process.env.NODE_DOCKER_PORT || 8080;
const app = express();

app.listen(PORT, () =>
  console.log(`App is listening on port:: ${PORT}.`)
);


(async () => {
  await initailSetupScript.runInitailSetup();
  await watcher.watchBlock();
})();
