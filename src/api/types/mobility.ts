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
