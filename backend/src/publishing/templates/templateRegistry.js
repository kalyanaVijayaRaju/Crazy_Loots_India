const telegramTemplate = require('./telegramTemplate');
const websiteTemplate = require('./websiteTemplate');
const whatsappTemplate = require('./whatsappTemplate');
const pushNotificationTemplate = require('./pushNotificationTemplate');
const emailTemplate = require('./emailTemplate');

class TemplateRegistry {
  constructor() {
    this.templates = new Map();
    this.templates.set('telegram', telegramTemplate);
    this.templates.set('website', websiteTemplate);
    this.templates.set('whatsapp', whatsappTemplate);
    this.templates.set('push', pushNotificationTemplate);
    this.templates.set('email', emailTemplate);
    this.version = '1.0.0';
  }

  getTemplate(channelKey) {
    const key = String(channelKey).toLowerCase();
    return this.templates.get(key) || this.templates.get('telegram');
  }
}

module.exports = new TemplateRegistry();
