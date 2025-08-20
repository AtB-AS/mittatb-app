import {Platform, PermissionsAndroid} from 'react-native';
import {
  LiveActivityAttributes,
  LiveActivityContentState,
  LiveActivityCapabilities,
  LiveActivityError,
  LiveActivityErrorType,
} from './types';

interface AndroidNotificationResult {
  id: string;
}

/**
 * Android Live Activity Manager
 * Simulates iOS Live Activities using the existing notification system on Android
 */
export class AndroidLiveActivityManager {
  private notificationCounter = 1000; // Start from 1000 to avoid conflicts

  /**
   * Check if Live Activities are supported (always true on Android)
   */
  public isSupported(): boolean {
    return Platform.OS === 'android';
  }

  /**
   * Get Android capabilities for Live Activities
   */
  public getCapabilities(): LiveActivityCapabilities {
    return {
      isSupported: true,
      supportsDynamicIsland: false, // Android doesn't have Dynamic Island
      supportsLockScreen: true,
      supportsPushUpdates: true,
      maxActiveActivities: 50, // Android can handle many notifications
    };
  }

  /**
   * Request necessary permissions for notifications
   */
  public async requestPermissions(): Promise<boolean> {
    try {
      const version = parseInt(Platform.Version.toString(), 10);
      if (version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true; // No permission needed for older Android versions
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  /**
   * Create a Live Activity as a persistent notification
   */
  public async createActivity(
    attributes: LiveActivityAttributes,
    contentState: LiveActivityContentState,
    _config: any = {},
  ): Promise<AndroidNotificationResult> {
    try {
      const notificationId = this.getNextNotificationId();

      return {
        id: notificationId.toString(),
      };
    } catch (error) {
      console.error('Error creating Android Live Activity:', error);
      throw new LiveActivityError(
        LiveActivityErrorType.nativeError,
        'Failed to create Android Live Activity',
        error as Error,
      );
    }
  }

  /**
   * Update an existing Live Activity notification
   */
  public async updateActivity(
    id: string,
    contentState: Partial<LiveActivityContentState>,
    config: any = {},
  ): Promise<void> {
    try {
      console.log('Updating Android Live Activity:', {
        id,
        contentState,
        config,
      });
    } catch (error) {
      console.error('Error updating Android Live Activity:', error);
      throw new LiveActivityError(
        LiveActivityErrorType.nativeError,
        'Failed to update Android Live Activity',
        error as Error,
      );
    }
  }

  /**
   * End a Live Activity notification
   */
  public async endActivity(
    id: string,
    dismissalPolicy?: string,
    finalContentState?: any,
  ): Promise<void> {
    try {
      console.log('Ending Android Live Activity:', {
        id,
        dismissalPolicy,
        finalContentState,
      });
    } catch (error) {
      console.error('Error ending Android Live Activity:', error);
      throw new LiveActivityError(
        LiveActivityErrorType.nativeError,
        'Failed to end Android Live Activity',
        error as Error,
      );
    }
  }

  /**
   * Get all active Live Activity notifications
   */
  public async getAllActiveActivities(): Promise<
    Array<{id: string; status: string}>
  > {
    try {
      return [];
    } catch (error) {
      console.error('Error getting active Android Live Activities:', error);
      return [];
    }
  }

  private getNextNotificationId(): number {
    return ++this.notificationCounter;
  }
}
