const BaseRepository = require('./base.repository');
const ScrapeJob = require('../models/scrapeJob.model');
const { ScrapeJobStatus } = require('../constants/enums');

class ScrapeJobRepository extends BaseRepository {
  constructor() {
    super(ScrapeJob);
  }

  async startJob(merchantId) {
    return this.create({
      merchant: merchantId,
      startedAt: new Date(),
      status: ScrapeJobStatus.RUNNING,
    });
  }

  async completeJob(jobId, { totalProducts = 0, successCount = 0, failedCount = 0 } = {}) {
    const finishedAt = new Date();
    const job = await this.findById(jobId);
    const duration = job ? finishedAt.getTime() - new Date(job.startedAt).getTime() : 0;

    return this.update(jobId, {
      finishedAt,
      duration,
      status: ScrapeJobStatus.COMPLETED,
      totalProducts,
      successCount,
      failedCount,
    });
  }

  async failJob(jobId, errorMessage = '') {
    const finishedAt = new Date();
    const job = await this.findById(jobId);
    const duration = job ? finishedAt.getTime() - new Date(job.startedAt).getTime() : 0;

    return this.update(jobId, {
      finishedAt,
      duration,
      status: ScrapeJobStatus.FAILED,
      errorMessage,
    });
  }
}

module.exports = new ScrapeJobRepository();
