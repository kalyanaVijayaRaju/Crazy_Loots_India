# Telegram Bot Setup Guide for Crazy Loots India

This document explains how to set up a Telegram Bot, configure the Telegram Channel, obtain API credentials, and integrate with the **Crazy Loots India** platform.

---

## Step 1: Create a Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/BotFather).
2. Start a chat with BotFather and send the command:
   ```text
   /newbot
   ```
3. Enter a name for your bot (e.g., `Crazy Loots India Bot`).
4. Enter a username for your bot ending in `bot` (e.g., `CrazyLootsIndiaBot`).
5. BotFather will return an API HTTP Bot Token in the format:
   ```text
   123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ-12345678
   ```
6. Copy this token. This is your `TELEGRAM_BOT_TOKEN`.

---

## Step 2: Set Up Telegram Channel

1. Open Telegram and create a new public or private Channel (e.g., `Crazy Loots India`).
2. Add your newly created bot (`@CrazyLootsIndiaBot`) as an **Administrator** in the channel.
3. Grant the bot **"Post Messages"** administrator permission.

---

## Step 3: Obtain Channel ID (`TELEGRAM_CHANNEL_ID`)

### Option A: Public Channel Handle
If your channel has a public link/handle (e.g., `t.me/crazylootsindia`):
- Set `TELEGRAM_CHANNEL_ID` to `@crazylootsindia`.

### Option B: Private Channel Numeric ID
If your channel is private:
1. Post a test message in the channel.
2. Forward the test message to [@userinfobot](https://t.me/userinfobot) or [@raw_data_bot](https://t.me/raw_data_bot).
3. The bot will reveal the Channel ID (usually starts with `-100`, e.g., `-1001234567890`).
4. Set `TELEGRAM_CHANNEL_ID` to `-1001234567890`.

---

## Step 4: Configure Environment Variables

Edit `backend/.env`:
```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ-12345678
TELEGRAM_CHANNEL_ID=@crazylootsindia
```

---

## Step 5: Test the Integration

### 1. Test Server Startup Notification
Start the server:
```bash
cd backend
npm run dev
```
Upon successful boot, the server will automatically dispatch a startup alert to the channel:
```text
🚀 Crazy Loots India Backend Started
Environment: development
Server Status: Healthy
Timestamp: 2026-07-24T15:22:00.000Z
```

### 2. Test Send Endpoint via HTTP
Send a test message using `curl`:
```bash
curl -X POST http://localhost:5000/api/v1/telegram/send \
  -H "Content-Type: application/json" \
  -d '{"message": "🔥 Test alert from Crazy Loots India Backend!"}'
```

Expected Response:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Telegram message sent successfully",
  "data": {
    "messageId": 42
  },
  "timestamp": "2026-07-24T15:22:05.000Z"
}
```
