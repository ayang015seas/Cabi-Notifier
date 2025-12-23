import cron from 'node-cron';
import { bikeshareService } from './bikeshare';
import { notifierService } from './notifier';
import { CONFIG } from '..';

class SchedulerService {
  private task: cron.ScheduledTask | null = null;

  /**
   * The main workflow: check bikes and notify
   */
  private async checkAndNotify(): Promise<void> {
    console.log(`[${new Date().toISOString()}] Running bike check...`);
    
    try {
      const stations = await bikeshareService.getNearbyStationStatus();
      await notifierService.sendAvailabilityAlert(stations);
      console.log('Check completed successfully');
    } catch (error) {
      console.error('Check failed:', error);
    }
  }

  /**
   * Start the scheduled task
   */
  start(): void {
    if (this.task) {
      console.log('Scheduler already running');
      return;
    }

    console.log(`Starting scheduler with cron: ${CONFIG.cronSchedule}`);
    
    this.task = cron.schedule(CONFIG.cronSchedule, async () => {
      await this.checkAndNotify();
    });

    console.log('Scheduler started successfully');
  }

  /**
   * Stop the scheduled task
   */
  stop(): void {
    if (this.task) {
      this.task.stop();
      this.task = null;
      console.log('Scheduler stopped');
    }
  }

  /**
   * Manually trigger a check (useful for testing)
   */
  async triggerManualCheck(): Promise<void> {
    await this.checkAndNotify();
  }
}

export const schedulerService = new SchedulerService();
