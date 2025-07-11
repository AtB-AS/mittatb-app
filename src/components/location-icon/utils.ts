import {FeatureCategory} from '@atb/api/bff/types';

export const getVenueIconTypes = (category: FeatureCategory[]) => {
  return category
    .map(mapLocationCategoryToVenueType)
    .filter((v, i, arr) => arr.indexOf(v) === i); // get distinct values
};

const mapLocationCategoryToVenueType = (category: FeatureCategory) => {
  switch (category) {
    case 'onstreetBus':
    case 'busStation':
    case 'coachStation':
      return 'bus';
    case 'onstreetTram':
    case 'tramStation':
      return 'tram';
    case 'railStation':
    case 'metroStation':
      return 'rail';
    case 'airport':
      return 'airport';
    case 'harbourPort':
    case 'ferryPort':
    case 'ferryStop':
      return 'boat';
    default:
      return 'unknown';
  }
};
