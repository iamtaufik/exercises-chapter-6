require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const Sentry = require('@sentry/node');

app.use(express.json());

const userRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');

Sentry.init({
  desn: process.env.SENTRY_DSN,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
  environment: process.env.RAILWAY_ENVIRONMENT_NAME,
});

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/profile', profileRoutes);

app.get('/', (req, res) => {
  console.log(name);
  res.status(200).json({ success: true, message: 'Welcome to my development API' });
});

app.use(Sentry.Handlers.errorHandler());

app.use((err, req, res, next) => {
  res.status(404).json({ success: false, message: 'not found' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
