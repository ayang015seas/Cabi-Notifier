import axios from 'axios';
import { StationStatus, GBFSStationStatus, GBFSStationInformation } from '../types';
import { CONFIG } from '../config';
import { calculateDistance } from '../utils/distance';

interface StationInfo {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

class BikeshareService {
  private stationInfoCache: Map<string, StationInfo> = new Map();

  /**
   * Initialize by fetching station information
   */
  async initialize(): Promise<void> {
    try {
      const response = await axios.get<GBFSStationInformation>(
        `${CONFIG.bikeshareApiBase}/station_information.json`
      );
      
      response.data.data.stations.forEach(station => {
        this.stationInfoCache.set(station.station_id, {
          id: station.station_id,
          name: station.name,
          lat: station.lat,
          lon: station.lon,
        });
      });
      
      console.log(`Loaded ${this.stationInfoCache.size} station locations`);
    } catch (error) {
      console.error('Failed to load station information:', error);
      throw error;
    }
  }

  /**
   * Get nearby stations within the specified radius
   */
  private getNearbyStationIds(): string[] {
    const nearbyStations: Array<{ id: string; distance: number }> = [];

    for (const [id, info] of this.stationInfoCache.entries()) {
      const distance = calculateDistance(
        CONFIG.homeLatitude,
        CONFIG.homeLongitude,
        info.lat,
        info.lon
      );

      if (distance <= CONFIG.searchRadiusMeters) {
        nearbyStations.push({ id, distance });
      }
    }

    // Sort by distance
    nearbyStations.sort((a, b) => a.distance - b.distance);

    console.log(`Found ${nearbyStations.length} stations within ${CONFIG.searchRadiusMeters}m`);
    return nearbyStations.map(s => s.id);
  }

  /**
   * Get current status for nearby stations
   */
  async getNearbyStationStatus(): Promise<StationStatus[]> {
    try {
      const nearbyStationIds = this.getNearbyStationIds();
      
      if (nearbyStationIds.length === 0) {
        console.warn('No stations found within specified radius');
        return [];
      }

      const response = await axios.get<GBFSStationStatus>(
        `${CONFIG.bikeshareApiBase}/station_status.json`
      );

      const stationSet = new Set(nearbyStationIds);
      const relevantStations = response.data.data.stations.filter(
        station => stationSet.has(station.station_id)
      );

      return relevantStations.map(station => {
        const info = this.stationInfoCache.get(station.station_id);
        const distance = info
          ? calculateDistance(
              CONFIG.homeLatitude,
              CONFIG.homeLongitude,
              info.lat,
              info.lon
            )
          : 0;

        return {
          stationId: station.station_id,
          stationName: info?.name || 'Unknown Station',
          numBikesAvailable: station.num_bikes_available,
          numDocksAvailable: station.num_docks_available,
          lastReported: new Date(station.last_reported * 1000),
          distanceMeters: Math.round(distance),
        };
      }).sort((a, b) => a.distanceMeters - b.distanceMeters);
    } catch (error) {
      console.error('Failed to fetch station status:', error);
      throw error;
    }
  }
}

export const bikeshareService = new BikeshareService();
