const fs = require('fs');
const path = require('path');
const logger = require('../../../utils/logger');

class FixtureManager {
  constructor() {
    this.fixturesDir = path.join(__dirname, '../test-fixtures/amazon');
  }

  loadFixture(fixtureName) {
    const filename = fixtureName.endsWith('.html') ? fixtureName : `${fixtureName}.html`;
    const filePath = path.join(this.fixturesDir, filename);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Fixture file not found: ${filePath}`);
    }
    return fs.readFileSync(filePath, 'utf8');
  }

  saveFixture(fixtureName, content) {
    const filename = fixtureName.endsWith('.html') ? fixtureName : `${fixtureName}.html`;
    const filePath = path.join(this.fixturesDir, filename);
    fs.mkdirSync(this.fixturesDir, { recursive: true });
    fs.writeFileSync(filePath, content, 'utf8');
    logger.debug(`[FixtureManager] Saved fixture '${filename}'`);
  }

  listFixtures() {
    if (!fs.existsSync(this.fixturesDir)) {
      return [];
    }
    return fs.readdirSync(this.fixturesDir).filter((f) => f.endsWith('.html'));
  }
}

module.exports = new FixtureManager();
