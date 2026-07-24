const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');

const env = require('./config/environment');
const logger = require('./utils/logger');
const routes = require('./routes');
const notFoundHandler = require('./middleware/notFoundHandler');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Gzip response compression
app.use(compression());

// Parse JSON request body
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded request body
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP Request Logger
if (env.NODE_ENV !== 'test') {
  app.use(morgan('combined', { stream: logger.stream }));
}

// API Routes
app.use(env.API_PREFIX, routes);

// Handle 404 Route Not Found
app.use(notFoundHandler);

// Centralized Global Error Handler
app.use(errorHandler);

module.exports = app;
