require("dotenv").config(); // TODO: Make env production
const chalk = require("chalk");
const Client = require("./providers/Client");

const Bot = new Client({}) // TODO: Fix this bullshit that happens
  .login(process.env.DISCORD_TOKEN)
  .loadEvents("./events")
  .loadCommands("./commands");

process.on("unhandledRejection", reason => {
  console.log(reason);
  return console.log(chalk.red(reason));
});
process.on("uncaughtException", error => {
  return console.log(chalk.red(`${error.message}\n\n${error.stack}`));
});
