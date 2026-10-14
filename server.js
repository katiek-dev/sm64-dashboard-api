import express from 'express';
import levels from './routes/levels.js';
import logger from './middleware/logger.js';
import errorHandler from './middleware/error.js';
import notFound from './middleware/notFound.js';

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}))

const port = process.env.PORT || 8000;

// Logger middleware
app.use(logger);

// Routes
app.use('/api/levels', levels)

// Route not found middleware
app.use(notFound);

// Error handler middleware
app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port 8000`));