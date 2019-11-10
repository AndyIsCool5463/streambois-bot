module.exports = class {
  constructor(client) {
    this.client = client;
  }

  run(message) {
    if (message.author.bot || !message.content.startsWith(".")) return;

    const args = message.content.split(/\s+/g);
    const command = args.shift().slice(".".length);
    const cmd =
      this.client.commands.get(command) ||
      this.client.commands.get(this.client.aliases.get(command));
    if (!cmd) return;
    if (cmd.command.cooldown.has(message.author.id)) return message.delete();

    cmd.command.setMessage(message);
    cmd.command.setCommandsList(this.client.commands);
    cmd.command.run(message, args);

    // Uncomment the line below this if you want to have commands deleted
    // message.delete();

    if (cmd.command.conf.cooldown > 0)
      cmd.command.startCooldown(message.author.id);
  }
};
