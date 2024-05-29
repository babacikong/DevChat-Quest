const { Client, GatewayIntentBits } = require('discord.js');
const WebSocket = require('ws');
const { message, createDataItemSigner } = require('@permaweb/aoconnect');
const { readFileSync } = require('fs');

const token = 'YOUR DISCORD BOT TOKEN ID'; // Discord Bot Token ID
const channelId = 'YOUR DISCORD CHANNEL ID'; // Discord Channel ID

const walletPath = '/root/.aos.json'; // Correct file path
const walletContent = JSON.parse(readFileSync(walletPath).toString());

async function relayMessageToDevChat(incomingMsg) {
  const senderName = incomingMsg.author.username;
  const msgContent = incomingMsg.content;

  console.log(`Preparing to relay message from ${senderName} to DevChat`);

  await message({
    process: 'YOUR PROCESS ID', // Process ID must be set correctly
    tags: [
      { name: 'Action', value: 'TransferToDevChat' },
      { name: 'Content', value: msgContent },
      { name: 'Sender', value: senderName },
    ],
    signer: createDataItemSigner(walletContent),
    data: msgContent,
  })
  .then(response => {
    console.log('Message successfully relayed to DevChat:', response);
  })
  .catch(error => {
    console.error('Error relaying message to DevChat:', error);
  });
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  startWebSocketServer();
});

client.login(token);

function startWebSocketServer() {
  const wss = new WebSocket.Server({ port: 8080 });

  wss.on('connection', ws => {
    console.log('WebSocket connection established');

    ws.on('message', message => {
      const decodedMessage = message.toString();
      console.log('Received message:', decodedMessage);
      const channel = client.channels.cache.get(channelId);
      if (channel) {
        channel.send(decodedMessage)
          .then(() => {
            console.log('Message sent to Discord');
            relayMessageToDevChat({ author: { username: 'DiscordUser' }, content: decodedMessage });
          })
          .catch(console.error);
      } else {
        console.error('Could not find the Discord channel.');
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });

  console.log('WebSocket server started on port 8080');
}

client.on('messageCreate', message => {
  console.log(`Message from ${message.author.username}: ${message.content}`);
  relayMessageToDevChat(message);
});
