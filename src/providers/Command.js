/**
 * Command Template
 */

class Command {
  /**
   * @param {Bot} client Client used in command
   * @param {Options} options Command Configuration
   */
  constructor(client, options) {
    /**
     * The bot
     * @type {Bot}
     */
    this.client = client;

    this.help = {
      name: options.name || null,
      description: options.description || "No information specified.",
      usage: options.useage || "No Information specified",
      category: options.category || "None",
      aliases: options.aliases || []
    };

    this.conf = {
      permLevel: options.permLevel || 0,
      permission: options.permission || "SEND_MESSAGES",
      cooldown: options.cooldown || 1000,
      aliases: options.aliases || [],
      allowDMs: options.allowDMs || false
    };
    this.cooldown = new Set();
  }

  startCooldown(user) {
    this.cooldown.add(user);
    setTimeout(() => {
      this.cooldown.delete(user);
    }, this.conf.cooldown);
  }
  setMessage(message) {
    this.message = message;
  }
  /**
   *
   * @param {Object} commands
   */
  setCommandsList(commands) {
    this.commandsList = commands;
  }
  get Commands() {
    return this.commandsList;
  }
  respond(message) {
    this.message.channel.send(message);
    return this.message;
  }
  react(reaction, message) {
    if (!message) {
      this.message.react(reaction);
    } else {
      message.react(reaction);
    }
  }
}
module.exports = Command;
