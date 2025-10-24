export enum AppOrgs {
  nfk = 'nfk',
  atb = 'atb',
  fram = 'fram',
  troms = 'troms',
}

export enum FareZoneAuthorities {
  atb = 'ATB',
  nfk = 'NOR',
  fram = 'MOR',
  troms = 'TRO',
}

export const EnturOrgIDs: Record<AppOrgs, string> = {
  [AppOrgs.nfk]: '18',
  [AppOrgs.atb]: '3',
  [AppOrgs.fram]: '71',
  [AppOrgs.troms]: '72',
};
