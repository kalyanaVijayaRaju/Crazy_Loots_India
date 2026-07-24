class TelegramPublishingContracts {
  verifyClientContract(client) {
    if (!client) {
      return false;
    }
    const methods = ['sendMessage', 'editMessage', 'deleteMessage', 'sendPhoto', 'sendMediaGroup', 'healthCheck'];
    for (const m of methods) {
      if (typeof client[m] !== 'function') {
        return false;
      }
    }
    return true;
  }

  verifyStrategyContract(strategy) {
    if (!strategy) {
      return false;
    }
    if (typeof strategy.execute !== 'function' || typeof strategy.getStrategyName !== 'function') {
      return false;
    }
    return true;
  }
}

module.exports = new TelegramPublishingContracts();
