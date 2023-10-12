export type ViolationsReportingInitQuery = {
  lng: string;
  lat: string;
};

export type ViolationsReportingProvider = {
  id: number;
  name: string;
  image: {
    type: string;
    base64: string;
  };
};

export type ParkingViolationType = {
  id: number;
  code: string;
  icon: string;
  selectable: boolean;
};

export type ViolationsReportingInitQueryResult = {
  providers: ViolationsReportingProvider[];
  violations: ParkingViolationType[];
};

export type ViolationsVehicleLookupQuery = {
  qr: string;
};

export type ViolationsVehicleLookupQueryResult = {
  provider_id: number;
  vehicle_id: string;
};

export type ViolationsReportQuery = {
  providerId: ViolationsReportingProvider['id'];
  longitude: number;
  latitude: number;
  image?: string; //base64 encoded image blob
  imageType?: string; // file name suffix;
  qr?: string;
  appId?: string; // Unique id identifying the customer
  violations?: ParkingViolationType['code'][];
  timestamp: string;
};

export type ViolationsReportQueryResult = {
  status: 'OK';
};
