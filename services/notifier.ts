import twilio from 'twilio';
import { StationStatus } from '../types';
import { CONFIG } from '..';

class NotifierService {
  private client: twilio.Twilio;

  constructor() {
    this.client = twilio(CONFIG.twilio.accountSid, CONFIG.twilio.authToken);
  }

  /**
   * Format station data into a readable SMS message
   */
  private formatMessage(stations: StationStatus[]): string {
    if (stations.length === 0) {
      return 'No bike stations found nearby.';
    }

    const lines = stations.map(station => {
      const emoji = station.numBikesAvailable > 0 ? '🚲' : '❌';
      return `${emoji} ${station.stationName} (${station.distanceMeters}m): ${station.numBikesAvailable} bikes`;
    });

    return `Bike Availability:\n${lines.join('\n')}`;
  }

  /**
   * Send availability alert via SMS
   */
  async sendAvailabilityAlert(stations: StationStatus[]): Promise<void> {
    const message = this.formatMessage(stations);
    
    try {
      await this.client.messages.create({
        body: message,
        from: CONFIG.twilio.fromNumber,
        to: CONFIG.twilio.toNumber,
      });
      
      console.log('SMS sent successfully');
    } catch (error) {
      console.error('Failed to send SMS:', error);
      throw error;
    }
  }
}

export const notifierService = new NotifierService();
