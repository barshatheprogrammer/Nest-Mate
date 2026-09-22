const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Webhook route must be registered before express.json() to parse raw body for Svix
app.use('/api/webhooks', express.raw({ type: 'application/json' }), require('./routes/webhookRoutes'));

// Body parser
app.use(express.json({ limit: '10mb' }));

// Enable CORS
app.use(cors({
  origin: ['http://localhost:5173', 'https://nest-mate-gamma.vercel.app'],
  credentials: true
}));

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes setup
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
// app.use('/api/roommates', require('./routes/roommates'));
// app.use('/api/requests', require('./routes/requests'));
// app.use('/api/messages', require('./routes/messages'));
// app.use('/api/reviews', require('./routes/reviews'));
// app.use('/api/reports', require('./routes/reports'));
// app.use('/api/admin', require('./routes/admin'));

// Error handling middleware
// app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));
