/**
 * وحدة الربط المباشر مع خادم Traccar GPS عبر WebSockets
 * تستقبل إحداثيات شرائح الـ GPS المزروعة في المركبات لحظياً وتحدّث جدول gps_trackers في Supabase
 */
import { supabase } from '@/lib/supabaseClient';

export interface TraccarPositionPayload {
  deviceId: number;
  latitude: number;
  longitude: number;
  speed: number; // knots
  course: number;
  attributes?: {
    ignition?: boolean;
  };
}

export class TraccarRealtimeBridge {
  private ws: WebSocket | null = null;
  private wsUrl: string;

  constructor(wsUrl: string = process.env.NEXT_PUBLIC_TRACCAR_WS_URL || 'wss://traccar.yourdomain.com/api/socket') {
    this.wsUrl = wsUrl;
  }

  public connect(onPositionsUpdate?: (positions: TraccarPositionPayload[]) => void): void {
    if (typeof window === 'undefined') return;
    this.ws = new WebSocket(this.wsUrl);

    this.ws.onmessage = async (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.positions && Array.isArray(data.positions)) {
        if (onPositionsUpdate) {
          onPositionsUpdate(data.positions);
        }
        for (const pos of data.positions as TraccarPositionPayload[]) {
          const speedKmh = Number((pos.speed * 1.852).toFixed(2));
          await supabase
            .from('gps_trackers')
            .update({
              last_location: `SRID=4326;POINT(${pos.longitude} ${pos.latitude})`,
              current_speed_kmh: speedKmh,
              heading_degrees: pos.course || 0,
              ignition_on: Boolean(pos.attributes?.ignition),
              last_connected_at: new Date().toISOString(),
            })
            .eq('traccar_device_id', pos.deviceId);
        }
      }
    };
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
