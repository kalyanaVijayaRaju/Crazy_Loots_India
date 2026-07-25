const defaultChannels = [
  {
    id: 'chan_prod_main',
    channelId: process.env.TELEGRAM_CHANNEL_ID || '@crazylootsindia',
    name: 'Crazy Loots India Main Channel',
    username: 'crazylootsindia',
    priority: 100,
    rateLimits: { maxPerMinute: 20 },
    mode: 'LIVE',
    status: 'ACTIVE',
  },
  {
    id: 'chan_sandbox_main',
    channelId: process.env.TELEGRAM_SANDBOX_CHANNEL_ID || process.env.TELEGRAM_CHANNEL_ID || '@crazylootsindia_sandbox',
    name: 'Crazy Loots India Sandbox Channel',
    username: 'crazyloots_sandbox',
    priority: 90,
    rateLimits: { maxPerMinute: 60 },
    mode: 'SANDBOX',
    status: 'ACTIVE',
  },
];

class TelegramChannelRegistry {
  constructor() {
    this.channels = new Map(defaultChannels.map((c) => [c.id, { ...c }]));
  }

  registerChannel(channel) {
    if (!channel || !channel.id || !channel.channelId) {
      throw new Error('TelegramChannelRegistry: Channel must have id and channelId.');
    }
    this.channels.set(channel.id, channel);
  }

  getChannel(channelId) {
    return Array.from(this.channels.values()).find(
      (c) => c.id === channelId || c.channelId === channelId
    );
  }

  getChannelsForMode(mode) {
    const isSandbox = mode === 'SANDBOX';
    return Array.from(this.channels.values()).filter(
      (c) => (isSandbox ? c.mode === 'SANDBOX' : c.mode === 'LIVE') && c.status === 'ACTIVE'
    );
  }
}

module.exports = new TelegramChannelRegistry();
