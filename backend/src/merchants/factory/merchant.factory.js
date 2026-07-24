const merchantRegistry = require('../registry/merchant.registry');
const AmazonAdapter = require('../adapters/amazon.adapter');
const FlipkartAdapter = require('../adapters/flipkart.adapter');
const MyntraAdapter = require('../adapters/myntra.adapter');
const AjioAdapter = require('../adapters/ajio.adapter');
const MeeshoAdapter = require('../adapters/meesho.adapter');
const RelianceDigitalAdapter = require('../adapters/relianceDigital.adapter');
const CromaAdapter = require('../adapters/croma.adapter');
const NykaaAdapter = require('../adapters/nykaa.adapter');
const TataCliqAdapter = require('../adapters/tataCliq.adapter');
const { InvalidProductUrlError } = require('../errors/merchant.errors');

class MerchantFactory {
  constructor() {
    this.registry = merchantRegistry;
    this.initDefaultAdapters();
  }

  /**
   * Register default system merchant adapters
   */
  initDefaultAdapters() {
    this.registry.register(new AmazonAdapter());
    this.registry.register(new FlipkartAdapter());
    this.registry.register(new MyntraAdapter());
    this.registry.register(new AjioAdapter());
    this.registry.register(new MeeshoAdapter());
    this.registry.register(new RelianceDigitalAdapter());
    this.registry.register(new CromaAdapter());
    this.registry.register(new NykaaAdapter());
    this.registry.register(new TataCliqAdapter());
  }

  /**
   * Retrieve adapter by merchant name or slug
   * @param {string} merchantName - Name of the merchant (e.g. 'amazon', 'flipkart')
   * @returns {MerchantAdapter}
   */
  getAdapter(merchantName) {
    return this.registry.get(merchantName);
  }

  /**
   * Automatically resolve matching adapter by product URL pattern
   * @param {string} url - Raw product web link
   * @returns {MerchantAdapter}
   */
  getAdapterByUrl(url) {
    const supportedMerchants = this.registry.listSupported();
    for (const merchantName of supportedMerchants) {
      const adapter = this.registry.get(merchantName);
      if (adapter.validateProductUrl(url)) {
        return adapter;
      }
    }
    throw new InvalidProductUrlError(url, 'Unknown/Unsupported URL pattern');
  }

  /**
   * List all registered merchant names
   * @returns {Array<string>}
   */
  listSupportedMerchants() {
    return this.registry.listSupported();
  }
}

module.exports = new MerchantFactory();
