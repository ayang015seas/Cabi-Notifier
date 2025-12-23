// Core domain types
export interface StationStatus {
  stationId: string;
  stationName: string;
  numBikesAvailable: number;
  numDocksAvailable: number;
  lastReported: Date;
  distanceMeters: number;
}

// Raw API response types
export interface GBFSStationStatus {
  data: {
    stations: Array<{
      station_id: string;
      num_bikes_available: number;
      num_docks_available: number;
      last_reported: number;
    }>;
  };
}

export interface GBFSStationInformation {
  data: {
    stations: Array<{
      station_id: string;
      name: string;
      lat: number;
      lon: number;
    }>;
  };
}

// Configuration
export interface AppConfig {
  bikeshareApiBase: string;
  homeLatitude: number;
  homeLongitude: number;
  searchRadiusMeters: number;
  cronSchedule: string;
  twilio: {
    accountSid: string;
    authToken: string;
    fromNumber: string;
    toNumber: string;
  };
  port: number;
  nodeEnv: string;
}
