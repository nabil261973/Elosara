import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Clock, Store, User, Bike, CheckCircle2, ShieldAlert } from 'lucide-react';

interface LocationMapProps {
  mode: 'PICKER' | 'TRACKING';
  // Picker mode props
  lat?: number;
  lng?: number;
  address?: string;
  onLocationSelect?: (lat: number, lng: number, addressText?: string) => void;

  // Tracking mode props
  vendorName?: string;
  vendorLat?: number;
  vendorLng?: number;
  vendorAddress?: string;
  clientName?: string;
  clientLat?: number;
  clientLng?: number;
  clientAddress?: string;
  orderStatus?: string;
  prepTimeMinutes?: number;
}

// Haversine formula to compute distance in Km
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
}

export const LocationMap: React.FC<LocationMapProps> = ({
  mode,
  lat = 24.7136,
  lng = 46.6753,
  address = '',
  onLocationSelect,
  vendorName = 'متجر الأسرة',
  vendorLat = 24.7950,
  vendorLng = 46.6250,
  vendorAddress = 'الرياض - حي الملقا',
  clientName = 'العميل',
  clientLat = 24.8100,
  clientLng = 46.6500,
  clientAddress = 'الرياض - حي الياسمين',
  orderStatus = 'DELIVERING',
  prepTimeMinutes = 20
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  const [selectedLat, setSelectedLat] = useState<number>(lat);
  const [selectedLng, setSelectedLng] = useState<number>(lng);
  const [driverProgress, setDriverProgress] = useState<number>(0.5); // 0 (at vendor) to 1 (at client)

  // Presets for quick location selection
  const LOCATION_PRESETS = [
    { name: 'الرياض - حي الياسمين', lat: 24.8100, lng: 46.6500 },
    { name: 'الرياض - حي الملقا', lat: 24.7950, lng: 46.6250 },
    { name: 'جدة - حي الشاطئ', lat: 21.5700, lng: 39.1300 },
    { name: 'الدمام - الشاطئ الشرقي', lat: 26.4400, lng: 50.1200 },
    { name: 'بريدة - حي الأفق', lat: 26.3400, lng: 43.9800 }
  ];

  // Calculated distance & delivery time
  const distanceKm =
    mode === 'TRACKING'
      ? calculateDistanceKm(vendorLat, vendorLng, clientLat, clientLng)
      : calculateDistanceKm(lat, lng, selectedLat, selectedLng);

  // Estimated driving time: ~2 mins per km + prep time
  const travelMinutes = Math.max(8, Math.round(distanceKm * 2.5));
  const totalEstimatedMinutes = (prepTimeMinutes || 15) + travelMinutes;

  // Driver animation effect during TRACKING mode
  useEffect(() => {
    if (mode !== 'TRACKING' || orderStatus !== 'DELIVERING') return;
    const interval = setInterval(() => {
      setDriverProgress((prev) => {
        if (prev >= 0.95) return 0.1;
        return prev + 0.05;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [mode, orderStatus]);

  // Map Initialization & Updates
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy previous map instance if re-initializing
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const initialLat = mode === 'PICKER' ? selectedLat : (vendorLat + clientLat) / 2;
    const initialLng = mode === 'PICKER' ? selectedLng : (vendorLng + clientLng) / 2;
    const zoomLevel = mode === 'PICKER' ? 13 : 12;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: zoomLevel,
      zoomControl: false
    });

    // Dark styled OpenStreetMap Tile Layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 19
    }).addTo(map);

    L.control.zoom({ position: 'topleft' }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    markersGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    // Handle map click in PICKER mode
    if (mode === 'PICKER') {
      map.on('click', (e: L.LeafletMouseEvent) => {
        const newLat = Math.round(e.latlng.lat * 10000) / 10000;
        const newLng = Math.round(e.latlng.lng * 10000) / 10000;
        setSelectedLat(newLat);
        setSelectedLng(newLng);
        if (onLocationSelect) {
          onLocationSelect(newLat, newLng);
        }
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mode]);

  // Update Markers & Overlay Elements
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = markersGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    if (mode === 'PICKER') {
      // Create Custom HTML Pin Marker for Location Picker
      const pinIcon = L.divIcon({
        className: 'custom-picker-pin',
        html: `
          <div style="background:#f59e0b; width:36px; height:36px; border-radius:50%; border:3px solid #0f172a; display:flex; align-items:center; justify-content:center; box-shadow:0 10px 25px rgba(0,0,0,0.4); transform:translate(-50%, -100%);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 36]
      });

      const marker = L.marker([selectedLat, selectedLng], { icon: pinIcon, draggable: true }).addTo(layerGroup);
      
      marker.on('dragend', (e) => {
        const target = e.target as L.Marker;
        const pos = target.getLatLng();
        const nLat = Math.round(pos.lat * 10000) / 10000;
        const nLng = Math.round(pos.lng * 10000) / 10000;
        setSelectedLat(nLat);
        setSelectedLng(nLng);
        if (onLocationSelect) {
          onLocationSelect(nLat, nLng);
        }
      });

      map.panTo([selectedLat, selectedLng]);
    } else {
      // TRACKING MODE: Vendor Pin + Client Pin + Polyline + Moving Driver Pin

      // Vendor Icon
      const vendorIcon = L.divIcon({
        className: 'custom-vendor-pin',
        html: `
          <div style="background:#10b981; color:#ffffff; padding:6px 10px; border-radius:12px; border:2px solid #0f172a; font-size:11px; font-weight:bold; display:flex; align-items:center; gap:4px; box-shadow:0 6px 18px rgba(0,0,0,0.3); transform:translate(-50%, -100%); white-space:nowrap;">
            🏪 <span>${vendorName}</span>
          </div>
        `,
        iconAnchor: [30, 30]
      });
      L.marker([vendorLat, vendorLng], { icon: vendorIcon }).addTo(layerGroup);

      // Client Icon
      const clientIcon = L.divIcon({
        className: 'custom-client-pin',
        html: `
          <div style="background:#f59e0b; color:#0f172a; padding:6px 10px; border-radius:12px; border:2px solid #0f172a; font-size:11px; font-weight:black; display:flex; align-items:center; gap:4px; box-shadow:0 6px 18px rgba(0,0,0,0.3); transform:translate(-50%, -100%); white-space:nowrap;">
            📍 <span>موقع التوصيل (${clientName})</span>
          </div>
        `,
        iconAnchor: [40, 30]
      });
      L.marker([clientLat, clientLng], { icon: clientIcon }).addTo(layerGroup);

      // Polyline route path
      const latlngs: L.LatLngExpression[] = [
        [vendorLat, vendorLng],
        [clientLat, clientLng]
      ];
      const polyline = L.polyline(latlngs, {
        color: '#f59e0b',
        weight: 4,
        dashArray: '8, 8',
        opacity: 0.8
      }).addTo(layerGroup);

      // Moving Driver Pin (interpolated position)
      const currentDriverLat = vendorLat + (clientLat - vendorLat) * driverProgress;
      const currentDriverLng = vendorLng + (clientLng - vendorLng) * driverProgress;

      const driverIcon = L.divIcon({
        className: 'custom-driver-pin',
        html: `
          <div style="background:#0284c7; color:#ffffff; padding:6px 10px; border-radius:20px; border:2px solid #ffffff; font-size:11px; font-weight:extrabold; display:flex; align-items:center; gap:4px; box-shadow:0 8px 20px rgba(2,132,199,0.5); transform:translate(-50%, -50%);">
            🛵 <span>مندوب التوصيل</span>
          </div>
        `,
        iconAnchor: [20, 15]
      });

      if (orderStatus === 'DELIVERING' || orderStatus === 'PREPARING') {
        L.marker([currentDriverLat, currentDriverLng], { icon: driverIcon }).addTo(layerGroup);
      }

      // Fit map bounds to encompass both vendor and client
      const bounds = L.latLngBounds([vendorLat, vendorLng], [clientLat, clientLng]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [selectedLat, selectedLng, vendorLat, vendorLng, clientLat, clientLng, driverProgress, mode, orderStatus]);

  const handlePresetSelect = (pLat: number, pLng: number, pName: string) => {
    setSelectedLat(pLat);
    setSelectedLng(pLng);
    if (onLocationSelect) {
      onLocationSelect(pLat, pLng, pName);
    }
  };

  return (
    <div className="space-y-3 font-sans text-right">
      
      {/* Map Header Stats / Mode Info Bar */}
      <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
            {mode === 'PICKER' ? <MapPin className="w-4 h-4" /> : <Navigation className="w-4 h-4" />}
          </div>
          <div>
            <div className="font-extrabold text-slate-100 flex items-center gap-1.5">
              <span>{mode === 'PICKER' ? 'تحديد الموقع على الخريطة' : 'تتبع المسار وزمن الوصول'}</span>
              <span className="bg-amber-500/20 text-amber-400 text-[10px] px-2 py-0.2 rounded-full font-mono">
                {distanceKm} كم
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {mode === 'PICKER'
                ? 'اسحب الدبوس أو انقر على الخريطة لتعيين الإحداثيات الدقيقة'
                : `من ${vendorName} إلى ${clientName}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-slate-300">
          <div className="flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-700">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>وقت التوصيل التقديري:</span>
            <strong className="text-amber-400 font-bold">{totalEstimatedMinutes} دقيقة</strong>
          </div>
        </div>
      </div>

      {/* Preset Buttons for Quick Location Pick */}
      {mode === 'PICKER' && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
          <span className="text-slate-400 shrink-0 font-bold">مواقع سريعة:</span>
          {LOCATION_PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePresetSelect(p.lat, p.lng, p.name)}
              className={`shrink-0 px-2.5 py-1 rounded-xl font-bold border transition-all ${
                selectedLat === p.lat && selectedLng === p.lng
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              📍 {p.name}
            </button>
          ))}
        </div>
      )}

      {/* Map Container Viewport */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950 h-64 sm:h-72 w-full z-0">
        <div ref={mapContainerRef} className="w-full h-full z-0" />
        
        {/* Map Floating Status Card (Tracking mode) */}
        {mode === 'TRACKING' && (
          <div className="absolute bottom-3 right-3 left-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-700 text-slate-100 text-xs z-10 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <div>
                <span className="font-extrabold text-amber-300">
                  {orderStatus === 'DELIVERING'
                    ? '🛵 مندوب التوصيل في الطريق إليك الآن'
                    : orderStatus === 'PREPARING'
                    ? '👩‍🍳 الأسرة تجهز الوجبة بحب واهتمام'
                    : '⏳ الطلب قيد الانتظار'}
                </span>
                <p className="text-[10px] text-slate-400">
                  المسافة الكلية: {distanceKm} كم • الزمن المتوقع وصوله: {totalEstimatedMinutes} دقيقة
                </p>
              </div>
            </div>

            <div className="text-left font-mono text-[11px] text-slate-400 bg-slate-950/60 px-2 py-1 rounded-lg border border-slate-800">
              {clientAddress || 'عنوان العميل'}
            </div>
          </div>
        )}
      </div>

      {/* Coordinates Display footer */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
        <span>الإحداثيات الجغرافية:</span>
        <span className="font-mono text-amber-400/90">
          Lat: {mode === 'PICKER' ? selectedLat : clientLat}, Lng: {mode === 'PICKER' ? selectedLng : clientLng}
        </span>
      </div>
    </div>
  );
};
