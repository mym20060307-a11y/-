export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: 'admin' | 'operator' | 'driver';
  created_at: string;
  updated_at: string;
}

export interface Route {
  id: number;
  route_number: string;
  route_name: string;
  start_station: string;
  end_station: string;
  direction: string;
  operating_hours: string;
  interval_minutes: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Station {
  id: number;
  route_id: number;
  station_name: string;
  sequence: number;
  latitude: number;
  longitude: number;
  created_at: string;
}

export interface Bus {
  id: number;
  bus_number: string;
  plate_number: string;
  model: string;
  capacity: number;
  fuel_type: 'electric' | 'diesel' | 'hybrid';
  status: 'operational' | 'maintenance' | 'repair' | 'retired';
  last_maintenance?: string;
  next_maintenance?: string;
  current_location: {
    lat: number;
    lng: number;
  };
  route_id?: number;
  created_at: string;
  updated_at: string;
}

export interface Driver {
  id: number;
  driver_name: string;
  license_number: string;
  phone: string;
  birth_date?: string;
  license_expiry?: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface Schedule {
  id: number;
  route_id: number;
  bus_id: number;
  driver_id: number;
  schedule_date: string;
  departure_time: string;
  arrival_time?: string;
  shift_type: 'morning' | 'afternoon' | 'evening' | 'night' | 'normal';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}
