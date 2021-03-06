const { exec } = require('child_process');

async function execCommand (msg, args) {
  if (!args[0]) {
    return 'Missing required arguments.';
  }

  exec(args.join(' '), async (e, stdout, stderr) => {
    if (stdout.length + stderr.length > 2000) {
      const res = await this.utils.post({
        url: ['hastebin.com', '/documents'],
        headers: {
          'Content-Type': 'application/json'
        }
      }, `${stdout}\n\n${stderr}`);

      this.sendMessage(msg.channel.id, {
        description: `Console log exceeds 2000 characters. View [here](https://hastebin.com/${JSON.parse(res).key}).`
      });
    } else {
      if (!stderr && !stdout) {
        msg.addReaction('\u2611');
      } else {
        this.sendMessage(msg.channel.id, `${stdout ? `Info: \`\`\`\n${stdout}\n\`\`\`` : ''}\n${stderr ? `Errors: \`\`\`\n${stderr}\`\`\`` : ''}`);
      }
    }
  });
}

module.exports = {
  command: execCommand,
  name: 'exec',
  usage: '{command} <command>',
  aliases: ['zsh'], // edge as fuck :^)
  ownerOnly: true,
  description: 'Bot owner only.'
};