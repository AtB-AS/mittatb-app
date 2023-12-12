import { Platform } from 'react-native';
import { KettleModules } from 'react-native-kettle-module';
import { KettleConsents } from 'react-native-kettle-module';
import { PERMISSIONS, Permission, RESULTS, checkMultiple, request } from 'react-native-permissions';
import { RationaleMessages } from './use-beacons-messages';

export type PermissionKey = 'bluetooth' | 'locationWhenInUse' | 'locationAlways' | 'motion';

export const BEACONS_CONSENTS = [KettleConsents.SURVEYS, KettleConsents.ANALYTICS];
const BEACONS_PERMISSIONS: Record<PermissionKey, Permission> = {
    bluetooth: getBluetoothPermission(),
    locationWhenInUse: Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    locationAlways: Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_ALWAYS : PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
    motion: Platform.OS === 'ios' ? PERMISSIONS.IOS.MOTION : PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION,
};

function getBluetoothPermission(): Permission {
    if (Platform.OS === 'android') {
        // For Android 12 (API Level 31) and above
        if (Platform.Version >= 31) {
            // Requires BLUETOOTH_SCAN for scanning Bluetooth devices including beacons
            return PERMISSIONS.ANDROID.BLUETOOTH_SCAN;
        } else {
            // For Android 23 (API Level 23) to Android 30 (API Level 30)
            // Requires ACCESS_FINE_LOCATION for Bluetooth scanning and discovery
            return PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
        }
    }

    return PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL;
}

export const requestAndroidPermissions = async (rationaleMessages: RationaleMessages) => {
    // Request Bluetooth permission
    const bluetoothStatus = await request(
        BEACONS_PERMISSIONS.bluetooth,
        rationaleMessages.bluetooth,
    );

    if (bluetoothStatus !== RESULTS.GRANTED) {
        return false;
    }

    // Request location when in use
    const locationWhenInUseStatus = await request(
        BEACONS_PERMISSIONS.locationWhenInUse,
        rationaleMessages.locationWhenInUse,
    );

    if (locationWhenInUseStatus !== RESULTS.GRANTED) {
        return true;
    }

    // Request location always or background location
    const locationAlwaysStatus = await request(
        BEACONS_PERMISSIONS.locationAlways,
        rationaleMessages.locationAlways,
    );

    if (locationAlwaysStatus !== RESULTS.GRANTED) {
        return true;
    }

    // Request motion permission
    const motionStatus = await request(BEACONS_PERMISSIONS.motion, rationaleMessages.motion);

    if (motionStatus !== RESULTS.GRANTED) {
        return true;
    }

    return true;
};

const checkPermissionStatuses = async () => {
    const statuses = await checkMultiple(Object.values(BEACONS_PERMISSIONS));
    const permissionStatuses: Record<PermissionKey, boolean> = {
        bluetooth: false,
        locationWhenInUse: false,
        locationAlways: false,
        motion: false,
    };
    Object.keys(permissionStatuses).forEach((key) => {
        const permissionKey = key as PermissionKey;
        permissionStatuses[permissionKey] = statuses[BEACONS_PERMISSIONS[permissionKey]] === RESULTS.GRANTED;
    });
    return permissionStatuses;
};

export const allowedPermissionForKettle = async () => {
    const permissionStatuses = await checkPermissionStatuses();
    const kettleModulesArray = [];
    if (permissionStatuses.bluetooth) {
        kettleModulesArray.push(KettleModules.BLUETOOTH);
    }
    if (permissionStatuses.locationAlways) {
        kettleModulesArray.push(KettleModules.LOCATION);
    }
    if (permissionStatuses.motion) {
        kettleModulesArray.push(KettleModules.ACTIVITY);
    }

    return kettleModulesArray;
};