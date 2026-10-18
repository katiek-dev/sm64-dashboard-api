import express from 'express';
import levels from './routes/levels.js';
import individualLevels from './routes/individualLevels.js';
import logger from './middleware/logger.js';
import errorHandler from './middleware/error.js';
import notFound from './middleware/notFound.js';
import cors from 'cors';

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}))

// Default port is 8000 unless specified in .env file
const port = process.env.PORT || 8000;

// Logger middleware
app.use(logger);

// avoid CORS when fetching from browser on same pc
app.use(cors());

// Routes
app.use('/api/levels', levels);
app.use('/api/individual-levels', individualLevels);

// Route not found middleware
app.use(notFound);

// Error handler middleware
app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port ${port}`));