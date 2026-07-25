class DryRunValidator {
  /**
   * Validate that an end-to-end execution completed safely in DRY_RUN mode
   * @param {Object} pipelineResult
   * @returns {Object} { valid: boolean, errors: [], warnings: [] }
   */
  validate(pipelineResult) {
    const errors = [];
    const warnings = [];

    if (!pipelineResult) {
      return { valid: false, errors: ['Pipeline result is missing.'], warnings: [] };
    }

    if (pipelineResult.mode !== 'DRY_RUN') {
      warnings.push(`End-to-end execution ran in mode '${pipelineResult.mode}'`);
    }

    if (!pipelineResult.stages || pipelineResult.stages.length === 0) {
      errors.push('No pipeline stages executed.');
    }

    if (!pipelineResult.publishingPackage) {
      warnings.push('PublishingPackage was not generated (deal might have been rejected or filtered).');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

module.exports = new DryRunValidator();
