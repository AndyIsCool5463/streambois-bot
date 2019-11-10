const Discord = require("discord.js");
const chalk = require("chalk");
const Enmap = require("enmap");
const fs = require("fs");
const fse = require("fs-extra"); // Alternative to native fs, ill simplify it later
/**
 * Represents a Discord client
 * @extends Discord.Client
 */

class Bot extends Discord.Client {
  /**
   * @param {Object} options The options passed to the client
   * @param {Object} options.discordOptions The client options used by the original discord.js client
   */
  constructor(options) {
    super(options.discordOptions || {}); // if no discord options are supplied

    /**
     * Enmap JS collection of bot commands
     * @type {Enmap}
     */
    this.commands = new Enmap();
    /**
     * Enmap Collection of aliases
     * @type {Enmap}
     */
    this.aliases = new Enmap();
    /**
     * Discord JS collection of bot commands
     * @type {Enmap}
     */
    this.categories = new Enmap();

    // Tell user that client is finished constructing
    console.log(
      chalk.green(`Client Initalized. You are on node ${process.version}.`)
    );
  }
  /**
   * Logs the client in
   * @param {String} token The token used to log the client in
   */
  login(token) {
    super.login(token);
    return this; // this allows the user to chain functions i.e bot.login().loadCommands().loadEvents() etc
  }
  /**
   *
   * @param {String} path Path where commands are located
   */
  async loadCommands(path) {
    await this.commands.defer;
    let dir = await this._getDirectories(path);
    this.categories.set("array", dir);
    if (dir.length <= 0)
      // APPARENTLY FUCKING !DIR DOESNT FUCKING WORK BECAUSE FUCK JS
      throw new Error("No Categories Found! Maybe you set the wrong path?");
    await dir.forEach(directory => {
      this._getCommandsFromDirectory(path, directory);
    });
    return this;
  }
  /**
   *
   * @param {String} path
   */
  loadEvents(path) {
    fs.readdir(`./src/${path}`, (err, files) => {
      if (err) console.log(err);

      files.forEach(evt => {
        const event = new (require(`../${path}/${evt}`))(this);

        super.on(evt.split(".")[0], (...args) => event.run(...args));
      });
    });
    return this;
  }
  get Commands() {
    return this.commands;
  }
  /**
   *
   * @param {String} path
   */
  async _getDirectories(path) {
    let filesAndDirectories = await fse.readdir(`./src/${path}`);
    let directories = [];
    await Promise.all(
      filesAndDirectories.map(name => {
        return fse.stat(`./src/${path}/${name}`).then(stat => {
          if (stat.isDirectory()) directories.push(name);
        });
      })
    );
    return directories;
  }
  /**
   *
   * @param {String} parent Parent Commands Directory
   * @param {String} cat Category directory
   */
  async _getCommandsFromDirectory(parent, cat) {
    await fs.readdir(`./src/${parent}/${cat}`, (error, files) => {
      if (error) throw new Error(error);
      console.log(`[${cat}]: [${files.length}]`);
      files.forEach(file => {
        if (!file.endsWith(".js")) return;

        let cmd = new (require(`../commands/${cat}/${file}`))(this); // equivialnt to `let cmd = new Ping(this)`;
        this.commands.set(cmd.help.name, {
          command: cmd,
          aliases: cmd.help.alias,
          category: cat
        });
        /* 
            TODO: Alias MUST BE AN ARRAY FOR THIS TO WORK
        */
        cmd.help.aliases.forEach(alias => {
          this.aliases.set(alias, {
            command: cmd,
            aliases: cmd.help.name,
            category: cat
          });
        });
      });
    });
    return this;
  }
}
module.exports = Bot;
