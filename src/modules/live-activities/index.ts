export * from './types';
export * from './service';
export * from './storage';
export * from './android-manager';
export * from './use-live-activities';

// Examples
export * from './examples/DepartureLiveActivityExample';
export * from './examples/LiveActivitiesTestScreen';
export * from './examples/LiveActivitiesDebugScreen';

import {LiveActivityService} from './service';

export const getLiveActivityService = () => {
  return LiveActivityService.getInstance();
};
