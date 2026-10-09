import express from 'express';
import levels from './routes/levels.js';

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}))

const port = process.env.PORT || 8000;

app.use('/api/levels', levels)

app.listen(port, () => console.log(`Server is running on port 8000`));