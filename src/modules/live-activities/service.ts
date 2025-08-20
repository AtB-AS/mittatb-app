import {Platform, NativeModules, NativeEventEmitter} from 'react-native';
import {
  LiveActivity,
  LiveActivityAttributes,
  LiveActivityContentState,
  CreateLiveActivityRequest,
  UpdateLiveActivityRequest,
  EndLiveActivityRequest,
  LiveActivityStatus,
  LiveActivityEvent,
  LiveActivityEventType,
  LiveActivityError,
  LiveActivityErrorType,
  LiveActivityCapabilities,
} from './types';
import {LiveActivityStorage} from './storage';
import {AndroidLiveActivityManager} from './android-manager';

// iOS Native Module interface
interface IOSLiveActivityModule {
  isSupported(): Promise<boolean>;
  getCapabilities(): Promise<LiveActivityCapabilities>;
  createActivity(
    attributes: Record<string, any>,
    contentState: Record<string, any>,
    config: Record<string, any>,
  ): Promise<{id: string; pushToken?: string}>;
  updateActivity(
    id: string,
    contentState: Record<string, any>,
    config?: Record<string, any>,
  ): Promise<void>;
  endActivity(
    id: string,
    dismissalPolicy?: string,
    finalContentState?: Record<string, any>,
  ): Promise<void>;
  getAllActiveActivities(): Promise<Array<{id: string; status: string}>>;
  requestPermissions(): Promise<boolean>;
  debugLiveActivities(): Promise<Record<string, any>>;
}

/**
 * Cross-platform Live Activities service Provides a unified interface for iOS
 * Live Activities and Android equivalent notifications
 */
export class LiveActivityService {
  private static instance: LiveActivityService;
  private storage: LiveActivityStorage;
  private eventEmitter: NativeEventEmitter | null = null;
  private androidManager: AndroidLiveActivityManager | null = null;
  private iosModule: IOSLiveActivityModule | null = null;

  private constructor() {
    this.storage = new LiveActivityStorage();
    this.initializePlatformSpecific();
  }

  public static getInstance(): LiveActivityService {
    if (!LiveActivityService.instance) {
      LiveActivityService.instance = new LiveActivityService();
    }
    return LiveActivityService.instance;
  }

  private initializePlatformSpecific() {
    if (Platform.OS === 'ios') {
      // Debug: Check what native modules are available
      console.log('🔍 Available NativeModules:', Object.keys(NativeModules));
      console.log('🔍 Looking for RNLiveActivity...');

      // Initialize iOS native module
      this.iosModule = NativeModules.RNLiveActivity as IOSLiveActivityModule;
      console.log('🔍 this.iosModule:', this.iosModule);
      console.log(
        '🔍 NativeModules.RNLiveActivity:',
        NativeModules.RNLiveActivity,
      );

      if (this.iosModule) {
        console.log('✅ iOS module found, setting up event emitter');
        this.eventEmitter = new NativeEventEmitter(
          NativeModules.RNLiveActivity,
        );
        console.log('✅ Event emitter created:', this.eventEmitter);
        this.setupIOSEventListeners();
      } else {
        console.error('❌ RNLiveActivity native module not found!');
        console.log(
          '📋 Available modules:',
          Object.keys(NativeModules).filter((m) => m.includes('RN')),
        );
      }
    } else if (Platform.OS === 'android') {
      // Initialize Android manager
      this.androidManager = new AndroidLiveActivityManager();
    }
  }

  private setupIOSEventListeners() {
    if (!this.eventEmitter) return;

    this.eventEmitter.addListener(
      'LiveActivityEvent',
      this.handleNativeEvent.bind(this),
    );
  }

  private async handleNativeEvent(event: any) {
    try {
      const liveActivityEvent: LiveActivityEvent = {
        type: event.type as LiveActivityEventType,
        activityId: event.activityId,
        timestamp: event.timestamp,
        error: event.error,
      };

      // Update local storage based on the event
      if (
        event.type === LiveActivityEventType.ended ||
        event.type === LiveActivityEventType.dismissed
      ) {
        await this.storage.updateActivityStatus(
          event.activityId,
          event.type === LiveActivityEventType.ended
            ? LiveActivityStatus.ended
            : LiveActivityStatus.dismissed,
        );
      }

      // Emit event to React Native listeners
      this.emit(liveActivityEvent);
    } catch (error) {
      console.error('Error handling native Live Activity event:', error);
    }
  }

  private eventListeners: Array<(event: LiveActivityEvent) => void> = [];

  /**
   * Add a listener for Live Activity events
   */
  public addEventListener(
    listener: (event: LiveActivityEvent) => void,
  ): () => void {
    this.eventListeners.push(listener);
    return () => {
      const index = this.eventListeners.indexOf(listener);
      if (index > -1) {
        this.eventListeners.splice(index, 1);
      }
    };
  }

  private emit(event: LiveActivityEvent) {
    this.eventListeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in Live Activity event listener:', error);
      }
    });
  }

  /**
   * Check if Live Activities are supported on the current platform
   */
  public async isSupported(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        console.log(
          '🔍 isSupported check - iosModule exists:',
          !!this.iosModule,
        );
        if (!this.iosModule) {
          console.error('❌ isSupported: iosModule is null');
          return false;
        }
        console.log('🔍 Calling iosModule.isSupported()...');
        const result = await this.iosModule.isSupported();
        console.log('🔍 iosModule.isSupported() result:', result);
        return result;
      } else if (Platform.OS === 'android') {
        return this.androidManager?.isSupported() ?? false;
      }
      return false;
    } catch (error) {
      console.error('❌ Error checking Live Activity support:', error);
      return false;
    }
  }

  /**
   * Get platform-specific capabilities
   */
  public async getCapabilities(): Promise<LiveActivityCapabilities> {
    try {
      if (Platform.OS === 'ios' && this.iosModule) {
        return await this.iosModule.getCapabilities();
      } else if (Platform.OS === 'android' && this.androidManager) {
        return this.androidManager.getCapabilities();
      }

      return {
        isSupported: false,
        supportsDynamicIsland: false,
        supportsLockScreen: false,
        supportsPushUpdates: false,
        maxActiveActivities: 0,
      };
    } catch (error) {
      console.error('Error getting Live Activity capabilities:', error);
      throw new LiveActivityError(
        LiveActivityErrorType.nativeError,
        'Failed to get capabilities',
        error as Error,
      );
    }
  }

  /**
   * Request necessary permissions for Live Activities
   */
  public async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios' && this.iosModule) {
        return await this.iosModule.requestPermissions();
      } else if (Platform.OS === 'android' && this.androidManager) {
        return await this.androidManager.requestPermissions();
      }
      return false;
    } catch (error) {
      console.error('Error requesting Live Activity permissions:', error);
      throw new LiveActivityError(
        LiveActivityErrorType.permissionDenied,
        'Failed to request permissions',
        error as Error,
      );
    }
  }

  /**
   * Debug method to check Live Activities configuration and capabilities
   * Only available on iOS
   */
  public async debugLiveActivities(): Promise<Record<string, any>> {
    try {
      if (Platform.OS === 'ios' && this.iosModule) {
        return await this.iosModule.debugLiveActivities();
      } else {
        return {
          platform: Platform.OS,
          isSupported: false,
          message: 'Debug method only available on iOS',
        };
      }
    } catch (error) {
      console.error('Error getting Live Activity debug info:', error);
      return {
        error: 'Failed to get debug info',
        details: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Create a new Live Activity
   */
  public async createActivity<
    TAttributes extends LiveActivityAttributes,
    TContentState extends LiveActivityContentState,
  >(
    request: CreateLiveActivityRequest<TAttributes, TContentState>,
  ): Promise<LiveActivity<TAttributes, TContentState>> {
    try {
      // Validate request
      if (!request.attributes.id) {
        throw new LiveActivityError(
          LiveActivityErrorType.invalidConfiguration,
          'Activity ID is required',
        );
      }

      // Check if activity already exists
      const existingActivity = await this.storage.getActivity(
        request.attributes.id,
      );
      if (existingActivity) {
        throw new LiveActivityError(
          LiveActivityErrorType.invalidConfiguration,
          'Activity with this ID already exists',
        );
      }

      const now = new Date();
      const activity: LiveActivity<TAttributes, TContentState> = {
        id: request.attributes.id,
        attributes: request.attributes,
        contentState: {
          ...request.contentState,
          updatedAt: now,
        },
        status: LiveActivityStatus.active,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };

      // Create platform-specific activity
      if (Platform.OS === 'ios' && this.iosModule) {
        const result = await this.iosModule.createActivity(
          request.attributes,
          request.contentState,
          request.config || {},
        );
        activity.nativeActivityId = result.id;
        activity.pushToken = result.pushToken;
      } else if (Platform.OS === 'android' && this.androidManager) {
        const result = await this.androidManager.createActivity(
          request.attributes,
          request.contentState,
          request.config || {},
        );
        activity.nativeActivityId = result.id;
      }

      // Store in local database
      await this.storage.saveActivity(activity);

      // Emit creation event
      this.emit({
        type: LiveActivityEventType.created,
        activityId: activity.id,
        activity,
        timestamp: now.toISOString(),
      });

      return activity;
    } catch (error) {
      console.error('Error creating Live Activity:', error);
      if (error instanceof LiveActivityError) {
        throw error;
      }
      throw new LiveActivityError(
        LiveActivityErrorType.nativeError,
        'Failed to create Live Activity',
        error as Error,
      );
    }
  }

  /**
   * Update an existing Live Activity
   */
  public async updateActivity<TContentState extends LiveActivityContentState>(
    request: UpdateLiveActivityRequest<TContentState>,
  ): Promise<void> {
    try {
      // Get existing activity
      const existingActivity = await this.storage.getActivity(request.id);
      if (!existingActivity) {
        throw new LiveActivityError(
          LiveActivityErrorType.activityNotFound,
          `Activity with ID ${request.id} not found`,
        );
      }

      // Update platform-specific activity
      if (
        Platform.OS === 'ios' &&
        this.iosModule &&
        existingActivity.nativeActivityId
      ) {
        await this.iosModule.updateActivity(
          existingActivity.nativeActivityId,
          request.contentState,
          request.config,
        );
      } else if (
        Platform.OS === 'android' &&
        this.androidManager &&
        existingActivity.nativeActivityId
      ) {
        await this.androidManager.updateActivity(
          existingActivity.nativeActivityId,
          request.contentState,
          request.config,
        );
      }

      // Update local storage
      const now = new Date();
      const updatedContentState = {
        ...existingActivity.contentState,
        ...request.contentState,
        updatedAt: now,
      };

      await this.storage.updateActivity(request.id, {
        contentState: updatedContentState,
        updatedAt: now.toISOString(),
      });

      // Emit update event
      this.emit({
        type: LiveActivityEventType.updated,
        activityId: request.id,
        timestamp: now.toISOString(),
      });
    } catch (error) {
      console.error('Error updating Live Activity:', error);
      if (error instanceof LiveActivityError) {
        throw error;
      }
      throw new LiveActivityError(
        LiveActivityErrorType.nativeError,
        'Failed to update Live Activity',
        error as Error,
      );
    }
  }

  /**
   * End a Live Activity
   */
  public async endActivity(request: EndLiveActivityRequest): Promise<void> {
    try {
      // Get existing activity
      const existingActivity = await this.storage.getActivity(request.id);
      if (!existingActivity) {
        throw new LiveActivityError(
          LiveActivityErrorType.activityNotFound,
          `Activity with ID ${request.id} not found`,
        );
      }

      // End platform-specific activity
      if (
        Platform.OS === 'ios' &&
        this.iosModule &&
        existingActivity.nativeActivityId
      ) {
        await this.iosModule.endActivity(
          existingActivity.nativeActivityId,
          request.dismissalPolicy,
          request.finalContentState,
        );
      } else if (
        Platform.OS === 'android' &&
        this.androidManager &&
        existingActivity.nativeActivityId
      ) {
        await this.androidManager.endActivity(
          existingActivity.nativeActivityId,
          request.dismissalPolicy,
          request.finalContentState,
        );
      }

      // Update local storage
      const now = new Date();
      await this.storage.updateActivityStatus(
        request.id,
        LiveActivityStatus.ended,
      );
      await this.storage.updateActivity(request.id, {
        updatedAt: now.toISOString(),
      });

      // Emit end event
      this.emit({
        type: LiveActivityEventType.ended,
        activityId: request.id,
        timestamp: now.toISOString(),
      });
    } catch (error) {
      console.error('Error ending Live Activity:', error);
      if (error instanceof LiveActivityError) {
        throw error;
      }
      throw new LiveActivityError(
        LiveActivityErrorType.nativeError,
        'Failed to end Live Activity',
        error as Error,
      );
    }
  }

  /**
   * Get all stored Live Activities
   */
  public async getAllActivities(): Promise<LiveActivity[]> {
    try {
      return await this.storage.getAllActivities();
    } catch (error) {
      console.error('Error getting all Live Activities:', error);
      throw new LiveActivityError(
        LiveActivityErrorType.storageError,
        'Failed to get activities',
        error as Error,
      );
    }
  }

  /**
   * Get a specific Live Activity by ID
   */
  public async getActivity(id: string): Promise<LiveActivity | null> {
    try {
      return await this.storage.getActivity(id);
    } catch (error) {
      console.error('Error getting Live Activity:', error);
      throw new LiveActivityError(
        LiveActivityErrorType.storageError,
        'Failed to get activity',
        error as Error,
      );
    }
  }

  /**
   * Get all active Live Activities
   */
  public async getActiveActivities(): Promise<LiveActivity[]> {
    try {
      const allActivities = await this.storage.getAllActivities();
      return allActivities.filter(
        (activity: LiveActivity) =>
          activity.status === LiveActivityStatus.active,
      );
    } catch (error) {
      console.error('Error getting active Live Activities:', error);
      throw new LiveActivityError(
        LiveActivityErrorType.storageError,
        'Failed to get active activities',
        error as Error,
      );
    }
  }

  /**
   * Clean up ended and dismissed activities from storage
   */
  public async cleanupInactiveActivities(): Promise<void> {
    try {
      await this.storage.cleanupInactiveActivities();
    } catch (error) {
      console.error('Error cleaning up inactive Live Activities:', error);
      throw new LiveActivityError(
        LiveActivityErrorType.storageError,
        'Failed to cleanup activities',
        error as Error,
      );
    }
  }

  /**
   * Sync local storage with platform-specific active activities
   */
  public async syncWithNativeActivities(): Promise<void> {
    try {
      let nativeActivities: Array<{id: string; status: string}> = [];

      if (Platform.OS === 'ios' && this.iosModule) {
        nativeActivities = await this.iosModule.getAllActiveActivities();
      } else if (Platform.OS === 'android' && this.androidManager) {
        nativeActivities = await this.androidManager.getAllActiveActivities();
      }

      const localActivities = await this.storage.getAllActivities();

      // Mark activities as ended if they're not active natively
      for (const localActivity of localActivities) {
        if (localActivity.status === LiveActivityStatus.active) {
          const nativeActivity = nativeActivities.find(
            (na) => na.id === localActivity.nativeActivityId,
          );

          if (!nativeActivity || nativeActivity.status !== 'active') {
            await this.storage.updateActivityStatus(
              localActivity.id,
              LiveActivityStatus.ended,
            );
          }
        }
      }
    } catch (error) {
      console.error('Error syncing with native Live Activities:', error);
      throw new LiveActivityError(
        LiveActivityErrorType.nativeError,
        'Failed to sync with native activities',
        error as Error,
      );
    }
  }

  /**
   * Initialize the service and restore activities from storage
   */
  public async initialize(): Promise<void> {
    try {
      await this.storage.initialize();

      // Sync with native activities on startup
      if (await this.isSupported()) {
        await this.syncWithNativeActivities();
      }
    } catch (error) {
      console.error('Error initializing Live Activity service:', error);
      throw new LiveActivityError(
        LiveActivityErrorType.nativeError,
        'Failed to initialize Live Activity service',
        error as Error,
      );
    }
  }
}
