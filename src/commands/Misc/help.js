// Import base command
const Base = require("../../providers/Command");
const Discord = require("discord.js");
// Create a class for the command that extends the base command
class Help extends Base {
  constructor(client) {
    // Initialise base command and pass data - all properties except name are optional
    super(client, {
      name: "help",
      description: "Help",
      usage: "", // Usage does not include the command - it is simply the arguments passed
      category: "Information",
      cooldown: 1000,
      aliases: ["help"],
      // permLevel is interchangable with permission, although you can have both
      permLevel: 0,
      permission: "READ_MESSAGES"
    });
  }

  async run(message) {
    let pages = [];
    let page = 0;
    let MAX_PAGES = 0;
    // Respond with the time between now and when the user sent their message
    await this._makeEmbed(pages, page);
  }
  async _makeEmbed(pages, page) {
    const embed = new Discord.RichEmbed();
    const categories = new Set();
    await this.commandsList.map((command, index) =>
      categories.add(command.category)
    );
    this.MAX_PAGES = categories.size;
    embed.setTimestamp();
    console.log(`PAGE: ${page + 1} || MPAGE ${this.MAX_PAGES}`);
    if (page + 1 > this.MAX_PAGES || page + 1 <= 0) page = 0;
    categories.forEach((category, cIndex) => {
      let commandsList4Category = new Set();
      const commands = this.commandsList.filter(
        (cmd, cmdIndex) => cmd.category === category
      );
      let PageObject = {
        catName: category,
        commands: []
      };
      commands.forEach((e, i) =>
        PageObject.commands.push({
          name: e.command.help.name,
          description: e.command.help.description
        })
      );
      pages.push(PageObject);
    });
    embed.setAuthor(
      `${pages[page].catName} Page: ${page + 1}/${this.MAX_PAGES}`,
      this.message.author.defaultAvatarURL
    );
    pages[page].commands.forEach((c, i) => {
      embed.addField(c.name, c.description);
    });
    return this.message.channel.send(embed).then(async _msg => {
      if (page + 1 == this.MAX_PAGES) await _msg.react("◀");
      if (page + 1 == 1) await _msg.react("▶");

      await _msg.react("▶"); //r eact 2
      // reacts
      let filter = (r, u) =>
        (r.emoji.name === "▶" || r.emoji.name === "◀") && u.bot === false; // filter
      const collect = _msg.createReactionCollector(filter, {
        time: 30000
      });
      collect.on("collect", r => {
        if (r.emoji.name == "▶") {
          page++;
          collect.stop();
          _msg.clearReactions();
          _msg.delete();
          this._makeEmbed(pages, page);
        } else if (r.emoji.name == "◀") {
          page--;
          collect.stop();
          _msg.clearReactions();
          _msg.delete();
          this._makeEmbed(pages, page);
        }
      });
    });
  }
}

// Export the class
module.exports = Help;
