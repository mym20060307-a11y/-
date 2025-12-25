import { mockUsers, mockRoutes, mockStations, mockBuses, mockDrivers, mockSchedules } from '../api/mockData';

const STORAGE_KEYS = {
  USERS: 'bus_system_users',
  ROUTES: 'bus_system_routes',
  STATIONS: 'bus_system_stations',
  BUSES: 'bus_system_buses',
  DRIVERS: 'bus_system_drivers',
  SCHEDULES: 'bus_system_schedules',
  AUTH_USER: 'bus_system_auth_user',
  AUTH_TOKEN: 'bus_system_auth_token',
};

export class LocalDb {
  static init() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ROUTES)) {
      localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(mockRoutes));
    }
    if (!localStorage.getItem(STORAGE_KEYS.STATIONS)) {
      localStorage.setItem(STORAGE_KEYS.STATIONS, JSON.stringify(mockStations));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BUSES)) {
      localStorage.setItem(STORAGE_KEYS.BUSES, JSON.stringify(mockBuses));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DRIVERS)) {
      localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(mockDrivers));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SCHEDULES)) {
      localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(mockSchedules));
    }
  }

  static get<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  static set<T>(key: string, data: T[]) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  static getById<T extends { id: any }>(key: string, id: any): T | undefined {
    const items = this.get<T>(key);
    return items.find((item) => item.id == id);
  }

  static add<T extends { id: any }>(key: string, item: T) {
    const items = this.get<T>(key);
    items.push(item);
    this.set(key, items);
  }

  static update<T extends { id: any }>(key: string, id: any, updates: Partial<T>) {
    const items = this.get<T>(key);
    const index = items.findIndex((item) => item.id == id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates, updated_at: new Date().toISOString() };
      this.set(key, items);
      return items[index];
    }
    return null;
  }

  static delete(key: string, id: any) {
    let items = this.get<any>(key);
    items = items.filter((item) => item.id != id);
    this.set(key, items);
  }

  static get KEYS() {
    return STORAGE_KEYS;
  }
}
