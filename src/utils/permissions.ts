// todo https://github.com/AtB-AS/kundevendt/issues/8615:

export enum PermissionType {
  Bluetooth = 'bluetooth',
  LocationWhenInUse = 'locationWhenInUse',
  LocationAlwaysAllow = 'locationAlwaysAllow',
  MotionAndFitnessActivity = 'motionAndFitnessActivity',
}

async function placeholderReturnQuickly(val: boolean): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(val);
    }, 1);
  });
}

async function placeholderReturnAfter1Sec(val: boolean): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(val);
    }, 1000);
  });
}

export async function getHasBluetoothPermission(): Promise<boolean> {
  //console.log('getHasBluetoothPermission');
  return await placeholderReturnQuickly(false);
}

export async function requestBluetoothPermission(): Promise<boolean> {
  //console.log('requestBluetoothPermission');
  return await placeholderReturnAfter1Sec(true);
}

export async function getHasLocationWhenInUsePermission(): Promise<boolean> {
  //console.log('getHasLocationWhenInUsePermission');
  return await placeholderReturnQuickly(true);
}

export async function requestLocationWhenInUsePermission(): Promise<boolean> {
  //console.log('requestLocationWhenInUsePermission');
  return await placeholderReturnAfter1Sec(true);
}

export async function getHasLocationAlwaysAllowPermission(): Promise<boolean> {
  //console.log('getHasLocationAlwaysAllowPermission');
  return await placeholderReturnQuickly(false);
}

export async function requestLocationAlwaysAllowPermission(): Promise<boolean> {
  //console.log('requestLocationAlwaysAllowPermission');
  return await placeholderReturnAfter1Sec(false);
}

export async function getHasMotionAndFitnessActivityPermission(): Promise<boolean> {
  //console.log('getHasMotionAndFitnessActivityPermission');
  return await placeholderReturnQuickly(false);
}

export async function requestMotionAndFitnessActivityPermission(): Promise<boolean> {
  //console.log('requestMotionAndFitnessActivityPermission');
  return await placeholderReturnAfter1Sec(false);
}

const defaultAsyncFunc = async () => Promise.resolve(false);

export const checkAndRequestPermission = async (
  permissionType: PermissionType,
) => {
  let getHasPermission = defaultAsyncFunc;
  let requestPermission = defaultAsyncFunc;
  switch (permissionType) {
    case PermissionType.Bluetooth:
      getHasPermission = getHasBluetoothPermission;
      requestPermission = requestBluetoothPermission;
      break;
    case PermissionType.LocationWhenInUse:
      getHasPermission = getHasLocationWhenInUsePermission;
      requestPermission = requestLocationWhenInUsePermission;
      break;
    case PermissionType.LocationAlwaysAllow:
      getHasPermission = getHasLocationAlwaysAllowPermission;
      requestPermission = requestLocationAlwaysAllowPermission;
      break;
    case PermissionType.MotionAndFitnessActivity:
      getHasPermission = getHasMotionAndFitnessActivityPermission;
      requestPermission = requestMotionAndFitnessActivityPermission;
      break;
    default:
      console.warn('unknown permissionType: ', permissionType);
      break;
  }

  const hasPermission = await getHasPermission();
  let permissionGranted = hasPermission;
  if (!hasPermission) {
    permissionGranted = await requestPermission();
  }
  return permissionGranted;
};
