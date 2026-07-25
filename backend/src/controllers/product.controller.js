const { productAppService } = require('../application');
const ResponseDTO = require('../dto/response.dto');

/**
 * Product Controller
 * Thin controller handling product endpoints
 */
class ProductController {
  async createProduct(req, res, next) {
    try {
      const product = await productAppService.createProduct(req.body);
      res.status(201).json(ResponseDTO.success('Product created successfully', product));
    } catch (error) {
      next(error);
    }
  }

  async getProducts(req, res, next) {
    try {
      const result = await productAppService.listProducts(req.query);
      res.status(200).json(ResponseDTO.paginated('Products retrieved successfully', result.items, result.total, result.page, result.limit));
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req, res, next) {
    try {
      const product = await productAppService.getProductById(req.params.id);
      res.status(200).json(ResponseDTO.success('Product retrieved successfully', product));
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const product = await productAppService.updateProduct(req.params.id, req.body);
      res.status(200).json(ResponseDTO.success('Product updated successfully', product));
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const result = await productAppService.deleteProduct(req.params.id);
      res.status(200).json(ResponseDTO.success('Product deleted successfully', result));
    } catch (error) {
      next(error);
    }
  }

  async monitorProduct(req, res, next) {
    try {
      const result = await productAppService.monitorProduct(req.params.id);
      res.status(200).json(ResponseDTO.success('Product monitoring executed', result));
    } catch (error) {
      next(error);
    }
  }

  async extractProduct(req, res, next) {
    try {
      const result = await productAppService.extractProduct(req.params.id);
      res.status(200).json(ResponseDTO.success('Product data extracted successfully', result));
    } catch (error) {
      next(error);
    }
  }

  async replayProduct(req, res, next) {
    try {
      const result = await productAppService.replayProduct(req.params.id);
      res.status(200).json(ResponseDTO.success('Product execution replayed', result));
    } catch (error) {
      next(error);
    }
  }

  async getProductHistory(req, res, next) {
    try {
      const result = await productAppService.getProductHistory(req.params.id);
      res.status(200).json(ResponseDTO.success('Product history retrieved successfully', result));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();
