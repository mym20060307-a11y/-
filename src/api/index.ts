import { LocalDb } from '../utils/localDb';
import type { User, Route, Station, Bus, Driver, Schedule } from '../types';

// Generic CRUD helper
const createCrud = <T extends { id: any }>(key: string) => ({
  getAll: () => {
    return new Promise<T[]>((resolve) => {
      setTimeout(() => resolve(LocalDb.get<T>(key)), 300); // Simulate network delay
    });
  },
  getById: (id: any) => {
    return new Promise<T | undefined>((resolve) => {
      setTimeout(() => resolve(LocalDb.getById<T>(key, id)), 300);
    });
  },
  create: (item: T) => {
    return new Promise<T>((resolve) => {
      // Auto-increment ID logic for number IDs if needed, but for now assuming ID is provided or handled
      if (typeof item.id === 'number' && item.id === 0) {
        // Simple auto-increment
        const all = LocalDb.get<T>(key);
        const maxId = all.reduce((max, i) => (typeof i.id === 'number' ? Math.max(max, i.id) : max), 0);
        item.id = maxId + 1;
      }
      setTimeout(() => {
        LocalDb.add<T>(key, item);
        resolve(item);
      }, 300);
    });
  },
  update: (id: any, updates: Partial<T>) => {
    return new Promise<T | null>((resolve) => {
      setTimeout(() => resolve(LocalDb.update<T>(key, id, updates)), 300);
    });
  },
  delete: (id: any) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        LocalDb.delete(key, id);
        resolve();
      }, 300);
    });
  }
});

export const api = {
  auth: {
    login: (email: string, password: string): Promise<{ user: User; token: string }> => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const users = LocalDb.get<User>(LocalDb.KEYS.USERS);
          const user = users.find(u => u.email === email);
          
          // Simple password check (In real app, verify hash)
          // For mock data, we check if password matches or if hash exists
          // Since we stored hashes for admin, we just allow any password for now if it matches 'password' or the specific hash
          // For simplicity in this demo:
          if (user) {
             // Allow 'password' for all for testing ease, or specific check
             resolve({ user, token: 'mock-jwt-token-' + Date.now() });
          } else {
            reject(new Error('Invalid credentials'));
          }
        }, 500);
      });
    },
    logout: () => {
      return new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 300);
      });
    }
  },
  routes: createCrud<Route>(LocalDb.KEYS.ROUTES),
  stations: createCrud<Station>(LocalDb.KEYS.STATIONS),
  buses: createCrud<Bus>(LocalDb.KEYS.BUSES),
  drivers: createCrud<Driver>(LocalDb.KEYS.DRIVERS),
  schedules: createCrud<Schedule>(LocalDb.KEYS.SCHEDULES),
  users: createCrud<User>(LocalDb.KEYS.USERS),
};
