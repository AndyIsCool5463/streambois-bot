const chalk = require("chalk");
class Error {
  constructor(error, failure) {
    this.error = error;
    this.failure = failure;
  }
  log() {
    console.error(chalk.red(this.error));
  }
}

module.exports = Error;
