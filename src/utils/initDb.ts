import { LocalDb } from './localDb';

export function initApp() {
  console.log('Initializing application...');
  LocalDb.init();
  console.log('Local database initialized.');
}
