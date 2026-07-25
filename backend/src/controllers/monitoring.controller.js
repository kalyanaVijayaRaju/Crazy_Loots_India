const { monitoringAppService } = require('../application');
const ResponseDTO = require('../dto/response.dto');

/**
 * Monitoring Controller
 * Thin controller for monitoring pipeline management
 */
class MonitoringController {
  async runMonitoring(req, res, next) {
    try {
      const result = await monitoringAppService.runMonitoring();
      res.status(200).json(ResponseDTO.success('Monitoring cycle completed', result));
    } catch (error) {
      next(error);
    }
  }

  async pauseMonitoring(req, res, next) {
    try {
      const result = await monitoringAppService.pauseMonitoring();
      res.status(200).json(ResponseDTO.success('Monitoring paused', result));
    } catch (error) {
      next(error);
    }
  }

  async resumeMonitoring(req, res, next) {
    try {
      const result = await monitoringAppService.resumeMonitoring();
      res.status(200).json(ResponseDTO.success('Monitoring resumed', result));
    } catch (error) {
      next(error);
    }
  }

  async retryMonitoring(req, res, next) {
    try {
      const result = await monitoringAppService.retryMonitoring();
      res.status(200).json(ResponseDTO.success('Monitoring retried', result));
    } catch (error) {
      next(error);
    }
  }

  async getJobs(req, res, next) {
    try {
      const result = await monitoringAppService.getMonitoringJobs();
      res.status(200).json(ResponseDTO.success('Monitoring jobs retrieved', result));
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req, res, next) {
    try {
      const result = await monitoringAppService.getMonitoringHistory();
      res.status(200).json(ResponseDTO.success('Monitoring history retrieved', result));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MonitoringController();
