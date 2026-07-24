const path = require('path');
const dotenv = require('dotenv');
const { cleanEnv, str, port } = require('envalid');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const env = cleanEnv(process.env, {
  PORT: port({ default: 5000 }),
  NODE_ENV: str({
    choices: ['development', 'test', 'production'],
    default: 'development',
  }),
  MONGODB_URI: str({
    default: 'mongodb://localhost:27017/crazy_loots_india',
  }),
  APP_NAME: str({ default: 'Crazy Loots India' }),
  API_PREFIX: str({ default: '/api/v1' }),
  LOG_LEVEL: str({
    choices: ['error', 'warn', 'info', 'http', 'debug'],
    default: 'info',
  }),
  TELEGRAM_BOT_TOKEN: str({ default: 'stub_token_for_phase1' }),
  TELEGRAM_CHANNEL_ID: str({ default: '@crazylootsindia' }),
});

module.exports = env;
