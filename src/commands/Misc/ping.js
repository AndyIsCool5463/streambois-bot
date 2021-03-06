// Import base command
const Base = require("../../providers/Command");

// Create a class for the command that extends the base command
class Ping extends Base {
  constructor(client) {
    // Initialise base command and pass data - all properties except name are optional
    super(client, {
      name: "ping",
      description: "Pings the bot.",
      usage: "", // Usage does not include the command - it is simply the arguments passed
      category: "Misc",
      cooldown: 1000,
      aliases: ["pong"],
      // permLevel is interchangable with permission, although you can have both
      permLevel: 0,
      permission: "READ_MESSAGES"
    });
  }

  run(message) {
    console.log(super.Commands());
    // Respond with the time between now and when the user sent their message
    super.respond(`Pong! Took ${message.createdAt - Date.now()}ms.`);
  }
}

// Export the class
module.exports = Ping;
