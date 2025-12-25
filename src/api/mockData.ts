import type { User, Route, Station, Bus, Driver, Schedule } from '../types';

export const mockUsers: User[] = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'admin@bus.com',
    password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // bcrypt hash for 'password' (mock)
    name: '系统管理员',
    role: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174001',
    email: 'operator@bus.com',
    password_hash: 'password',
    name: '调度员张三',
    role: 'operator',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174002',
    email: 'driver@bus.com',
    password_hash: 'password',
    name: '司机李四',
    role: 'driver',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const mockRoutes: Route[] = [
  {
    id: 1,
    route_number: '101',
    route_name: '市中心环线',
    start_station: '火车站',
    end_station: '火车站',
    direction: '顺时针',
    operating_hours: '06:00-22:00',
    interval_minutes: 15,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    route_number: '102',
    route_name: '东西干线',
    start_station: '东站',
    end_station: '西站',
    direction: '双向',
    operating_hours: '06:00-21:30',
    interval_minutes: 20,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const mockStations: Station[] = [
  { id: 1, route_id: 1, station_name: '火车站', sequence: 1, latitude: 23.1291, longitude: 113.2644, created_at: new Date().toISOString() },
  { id: 2, route_id: 1, station_name: '人民公园', sequence: 2, latitude: 23.1320, longitude: 113.2700, created_at: new Date().toISOString() },
  { id: 3, route_id: 1, station_name: '市政府', sequence: 3, latitude: 23.1350, longitude: 113.2750, created_at: new Date().toISOString() },
  { id: 4, route_id: 2, station_name: '东站', sequence: 1, latitude: 23.1400, longitude: 113.3000, created_at: new Date().toISOString() },
  { id: 5, route_id: 2, station_name: '西站', sequence: 10, latitude: 23.1200, longitude: 113.2000, created_at: new Date().toISOString() }
];

export const mockBuses: Bus[] = [
  {
    id: 1,
    bus_number: 'BUS-001',
    plate_number: '粤A12345',
    model: '宇通ZK6120',
    capacity: 80,
    fuel_type: 'electric',
    status: 'operational',
    last_maintenance: '2024-01-15',
    next_maintenance: '2024-04-15',
    current_location: { lat: 23.1291, lng: 113.2644 },
    route_id: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    bus_number: 'BUS-002',
    plate_number: '粤A67890',
    model: '比亚迪K9',
    capacity: 90,
    fuel_type: 'electric',
    status: 'operational',
    last_maintenance: '2024-02-01',
    next_maintenance: '2024-05-01',
    current_location: { lat: 23.1400, lng: 113.3000 },
    route_id: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const mockDrivers: Driver[] = [
  {
    id: 1,
    driver_name: '王五',
    license_number: 'A1-20230001',
    phone: '13800138000',
    birth_date: '1980-05-20',
    license_expiry: '2028-05-20',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    driver_name: '赵六',
    license_number: 'A1-20230002',
    phone: '13900139000',
    birth_date: '1985-08-15',
    license_expiry: '2029-08-15',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export const mockSchedules: Schedule[] = [
  {
    id: 1,
    route_id: 1,
    bus_id: 1,
    driver_id: 1,
    schedule_date: new Date().toISOString().split('T')[0],
    departure_time: '08:00:00',
    arrival_time: '09:30:00',
    shift_type: 'morning',
    status: 'scheduled',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];
