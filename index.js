const fs = require('fs');
const path = require('path');
const { Client } = require('discord.js-selfbot-v13');
const dotenv = require('dotenv');
const { Logger } = require('./logger');

const configPath = path.resolve(__dirname, 'config.json');
const exampleConfigPath = path.resolve(__dirname, 'config.example.json');

if (!fs.existsSync(configPath) && fs.existsSync(exampleConfigPath)) {
  fs.copyFileSync(exampleConfigPath, configPath);
}

let config;
try {
  config = require('./config.json');
} catch (err) {
  console.error('Failed to load config.json:', err.message);
  process.exit(1);
}

dotenv.config();

console.clear();

const log = new Logger('AutoTyper');
const pkg = require('./package.json');
const client = new Client();
let isRunning = true;
let currentTimeout = null;

const sleep = (ms) => new Promise(r => { currentTimeout = setTimeout(r, ms); });

function validateConfig() {
  if (!config.channels || !Array.isArray(config.channels) || config.channels.length === 0) {
    log.error('No channels configured in config.json! Please add at least one channel ID.');
    process.exit(1);
  }

  if (config.channels.some(id => !id || id === 'YOUR_CHANNEL_ID_HERE' || id === 'channel_id_here')) {
    log.error('Placeholder channel ID found in config.json. Please replace it with your real Discord channel ID(s).');
    process.exit(1);
  }

  if (!config.message || typeof config.message !== 'string') {
    log.error('No message configured in config.json! Please specify a valid message string.');
    process.exit(1);
  }

  if (typeof config.interval !== 'number' || config.interval <= 0) {
    log.warn('Invalid or missing interval in config.json. Defaulting to 600000ms (10 minutes).');
    config.interval = 600000;
  }

  if (typeof config.channelDelay !== 'number' || config.channelDelay < 0) {
    config.channelDelay = 10000;
  }
}

async function sendToChannel(channelId, index, total) {
  let channel;
  try {
    channel = await client.channels.fetch(channelId);
  } catch (err) {
    log.error(`Channel not found → ${channelId}: ${err.message}`);
    return;
  }

  if (!channel || !channel.send) {
    log.error(`Cannot send messages to channel → ${channelId} (Missing permissions or invalid channel type)`);
    return;
  }

  try {
    await channel.send(config.message);
    const serverName = channel.guild ? channel.guild.name : 'Direct Message';
    const channelName = channel.name ? `#${channel.name}` : channel.id;
    log.cycle(index, total, `${channelName} (${serverName})`);
  } catch (err) {
    log.error(`Failed to send → ${channelId}: ${err.message}`);
  }
}

async function startMessageCycles() {
  log.info('Starting message dispatch loop...');
  log.blank();

  while (isRunning) {
    for (let i = 0; i < config.channels.length; i++) {
      if (!isRunning) return;
      await sendToChannel(config.channels[i], i, config.channels.length);

      if (i < config.channels.length - 1 && isRunning) {
        await sleep(config.channelDelay);
      }
    }

    if (!isRunning) return;
    log.cycleDone(config.channels.length);

    if (isRunning) {
      await sleep(config.interval);
    }
  }
}

client.on('ready', () => {
  log.header(pkg.name, pkg.version);

  log.ready({
    'User': client.user.tag || client.user.username,
    'Channels': config.channels.length,
    'Message': `"${config.message}"`,
    'Interval': `${config.interval / 60000} minutes`,
    'Channel Delay': `${config.channelDelay / 1000} seconds`,
  });

  startMessageCycles();
});

client.on('shardDisconnect', () => {
  log.warn('Connection lost');
});

client.on('shardReconnecting', () => {
  log.reconnecting('Shard reconnecting...');
});

client.on('error', error => {
  log.error(`Client error: ${error.message}`);
});

process.on('unhandledRejection', error => {
  log.error(`Unhandled rejection: ${error ? error.message || error : 'Unknown error'}`);
});

process.on('SIGINT', () => {
  log.shutdown('SIGINT received (User interrupted)');
  isRunning = false;
  if (currentTimeout) clearTimeout(currentTimeout);
  client.destroy();
  process.exit(0);
});

if (!process.env.DISCORD_TOKEN) {
  log.error('DISCORD_TOKEN is not defined in .env file!');
  log.info('Create a .env file with: DISCORD_TOKEN=your_token_here');
  process.exit(1);
}

validateConfig();

log.info('Connecting to Discord...');

client.login(process.env.DISCORD_TOKEN).catch(err => {
  log.error(`Login failed: ${err.message}`);
  process.exit(1);
});
