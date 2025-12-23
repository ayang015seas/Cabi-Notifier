import express from 'express';
import { bikeshareService } from './services/bikeshare';
import { schedulerService } from './services/scheduler';
import { CONFIG } from './config';

const app = express();

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Manual trigger endpoint for testing
app.post('/trigger-check', async (req, res) => {
  try {
    await schedulerService.triggerManualCheck();
    res.json({ success: true, message: 'Check triggered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Check failed' });
  }
});

// Initialize and start
async function bootstrap() {
  try {
    console.log('Initializing app...');
    
    // Load station information
    await bikeshareService.initialize();
    
    // Start the scheduler
    schedulerService.start();
    
    // Start Express server
    app.listen(CONFIG.port, () => {
      console.log(`Server running on port ${CONFIG.port}`);
      console.log(`Environment: ${CONFIG.nodeEnv}`);
      console.log(`Monitoring location: ${CONFIG.homeLatitude}, ${CONFIG.homeLongitude}`);
      console.log(`Search radius: ${CONFIG.searchRadiusMeters}m`);
      console.log('App is ready!');
    });
  } catch (error) {
    console.error('Failed to start app:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  schedulerService.stop();
  process.exit(0);
});

bootstrap();
