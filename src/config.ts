import dotenv from 'dotenv';
import { AppConfig } from './types';

dotenv.config();

function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const CONFIG: AppConfig = {
  bikeshareApiBase: getRequiredEnv('BIKESHARE_API_BASE'),
  homeLatitude: parseFloat(getRequiredEnv('HOME_LATITUDE')),
  homeLongitude: parseFloat(getRequiredEnv('HOME_LONGITUDE')),
  searchRadiusMeters: parseInt(getRequiredEnv('SEARCH_RADIUS_METERS')),
  cronSchedule: getRequiredEnv('CRON_SCHEDULE'),
  twilio: {
    accountSid: getRequiredEnv('TWILIO_ACCOUNT_SID'),
    authToken: getRequiredEnv('TWILIO_AUTH_TOKEN'),
    fromNumber: getRequiredEnv('TWILIO_FROM_NUMBER'),
    toNumber: getRequiredEnv('TWILIO_TO_NUMBER'),
  },
  port: parseInt(process.env.PORT || '3000'),
  nodeEnv: process.env.NODE_ENV || 'development',
};
