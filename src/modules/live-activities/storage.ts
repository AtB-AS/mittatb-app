import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {
  LiveActivity,
  LiveActivityStatus,
  LiveActivityStorageSchema,
  LiveActivityStorageData,
  LiveActivityError,
  LiveActivityErrorType,
} from './types';
import {parseISO} from 'date-fns';

const STORAGE_KEY = '@ATB_live_activities';
const FIRESTORE_COLLECTION = 'live_activities';

/**
 * Storage manager for Live Activities
 * Uses both AsyncStorage for local caching and Firestore for persistence across
 * devices
 */
export class LiveActivityStorage {
  private userId: string | null = null;

  /**
   * Initialize storage with user ID for Firestore operations
   */
  public async initialize(userId?: string): Promise<void> {
    this.userId = userId || null;

    // Clean up any corrupted local data on initialization
    try {
      await this.validateAndCleanLocalStorage();
    } catch (error) {
      console.warn('Error during storage initialization cleanup:', error);
      // Clear local storage if validation fails
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
  }

  /**
   * Save a Live Activity to both local and remote storage
   */
  public async saveActivity(activity: LiveActivity): Promise<void> {
    try {
      // Save to local storage
      await this.saveToLocal(activity);

      // Save to Firestore if user is authenticated
      if (this.userId) {
        await this.saveToFirestore(activity);
      }
    } catch (error) {
      console.error('Error saving Live Activity:', error);
      throw new LiveActivityError(
        LiveActivityErrorType.storageError,
        'Failed to save activity',
        error as Error,
      );
    }
  }

  /**
   * Get a specific Live Activity by ID
   */
  public async getActivity(id: string): Promise<LiveActivity | null> {
    try {
      const localActivity = await this.getFromLocal(id);
      if (localActivity) {
        return localActivity;
      }

      if (this.userId) {
        const remoteActivity = await this.getFromFirestore(id);
        if (remoteActivity) {
          await this.saveToLocal(remoteActivity);
          return remoteActivity;
        }
      }

      return null;
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
   * Get all Live Activities
   */
  public async getAllActivities(): Promise<LiveActivity[]> {
    try {
      const localActivities = await this.getAllFromLocal();

      if (this.userId) {
        const remoteActivities = await this.getAllFromFirestore();
        const mergedActivities = this.mergeActivities(
          localActivities,
          remoteActivities,
        );

        await this.saveAllToLocal(mergedActivities);
        return mergedActivities;
      }

      return localActivities;
    } catch (error) {
      console.error('Error getting all Live Activities:', error);
      throw new LiveActivityError(
        LiveActivityErrorType.storageError,
        'Failed to get all activities',
        error as Error,
      );
    }
  }

  /**
   * Update an existing Live Activity
   */
  public async updateActivity(
    id: string,
    updates: Partial<LiveActivity>,
  ): Promise<void> {
    try {
      const existingActivity = await this.getActivity(id);
      if (!existingActivity) {
        throw new LiveActivityError(
          LiveActivityErrorType.activityNotFound,
          `Activity with ID ${id} not found`,
        );
      }

      const updatedActivity: LiveActivity = {
        ...existingActivity,
        ...updates,
        id,
      };

      await this.saveActivity(updatedActivity);
    } catch (error) {
      console.error('Error updating Live Activity:', error);
      if (error instanceof LiveActivityError) {
        throw error;
      }
      throw new LiveActivityError(
        LiveActivityErrorType.storageError,
        'Failed to update activity',
        error as Error,
      );
    }
  }

  /**
   * Update activity status
   */
  public async updateActivityStatus(
    id: string,
    status: LiveActivityStatus,
  ): Promise<void> {
    try {
      await this.updateActivity(id, {
        status,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating Live Activity status:', error);
      throw error;
    }
  }

  /**
   * Delete a Live Activity
   */
  public async deleteActivity(id: string): Promise<void> {
    try {
      await this.deleteFromLocal(id);

      if (this.userId) {
        await this.deleteFromFirestore(id);
      }
    } catch (error) {
      console.error('Error deleting Live Activity:', error);
      throw new LiveActivityError(
        LiveActivityErrorType.storageError,
        'Failed to delete activity',
        error as Error,
      );
    }
  }

  /**
   * Clean up inactive activities (ended, dismissed, expired)
   */
  public async cleanupInactiveActivities(): Promise<void> {
    try {
      const allActivities = await this.getAllActivities();
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const activitiesToDelete = allActivities.filter((activity) => {
        // Delete if ended/dismissed and older than a week
        const isInactive =
          activity.status === LiveActivityStatus.ended ||
          activity.status === LiveActivityStatus.dismissed;
        const isOld = parseISO(activity.updatedAt) < oneWeekAgo;

        return isInactive && isOld;
      });

      // Delete old inactive activities
      for (const activity of activitiesToDelete) {
        await this.deleteActivity(activity.id);
      }

      console.log(
        `Cleaned up ${activitiesToDelete.length} inactive Live Activities`,
      );
    } catch (error) {
      console.error('Error cleaning up inactive Live Activities:', error);
      throw new LiveActivityError(
        LiveActivityErrorType.storageError,
        'Failed to cleanup activities',
        error as Error,
      );
    }
  }

  // Private methods for local storage

  private async saveToLocal(activity: LiveActivity): Promise<void> {
    const localActivities = await this.getAllFromLocal();
    const existingIndex = localActivities.findIndex(
      (a) => a.id === activity.id,
    );

    if (existingIndex >= 0) {
      localActivities[existingIndex] = activity;
    } else {
      localActivities.push(activity);
    }

    await this.saveAllToLocal(localActivities);
  }

  private async getFromLocal(id: string): Promise<LiveActivity | null> {
    const localActivities = await this.getAllFromLocal();
    return localActivities.find((a) => a.id === id) || null;
  }

  private async getAllFromLocal(): Promise<LiveActivity[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];

      // Validate and parse each activity
      const validActivities: LiveActivity[] = [];
      for (const item of parsed) {
        try {
          const validated = LiveActivityStorageSchema.parse(item);
          validActivities.push(this.storageDataToActivity(validated));
        } catch (validationError) {
          console.warn(
            'Invalid activity data found in local storage:',
            validationError,
          );
        }
      }

      return validActivities;
    } catch (error) {
      console.error('Error reading from local storage:', error);
      return [];
    }
  }

  private async saveAllToLocal(activities: LiveActivity[]): Promise<void> {
    const storageData = activities.map(this.activityToStorageData);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
  }

  private async deleteFromLocal(id: string): Promise<void> {
    const localActivities = await this.getAllFromLocal();
    const filteredActivities = localActivities.filter((a) => a.id !== id);
    await this.saveAllToLocal(filteredActivities);
  }

  // Private methods for Firestore

  private async saveToFirestore(activity: LiveActivity): Promise<void> {
    if (!this.userId) return;

    const docRef = firestore()
      .collection(FIRESTORE_COLLECTION)
      .doc(`${this.userId}_${activity.id}`);

    await docRef.set(this.activityToStorageData(activity), {merge: true});
  }

  private async getFromFirestore(id: string): Promise<LiveActivity | null> {
    if (!this.userId) return null;

    const docRef = firestore()
      .collection(FIRESTORE_COLLECTION)
      .doc(`${this.userId}_${id}`);

    const doc = await docRef.get();
    if (!doc.exists) return null;

    try {
      const data = doc.data();
      const validated = LiveActivityStorageSchema.parse(data);
      return this.storageDataToActivity(validated);
    } catch (error) {
      console.warn('Invalid activity data in Firestore:', error);
      return null;
    }
  }

  private async getAllFromFirestore(): Promise<LiveActivity[]> {
    if (!this.userId) return [];

    const querySnapshot = await firestore()
      .collection(FIRESTORE_COLLECTION)
      .where('__name__', '>=', `${this.userId}_`)
      .where('__name__', '<', `${this.userId}_\uf8ff`)
      .get();

    const activities: LiveActivity[] = [];
    querySnapshot.forEach((doc) => {
      try {
        const data = doc.data();
        const validated = LiveActivityStorageSchema.parse(data);
        activities.push(this.storageDataToActivity(validated));
      } catch (error) {
        console.warn('Invalid activity data in Firestore:', error);
      }
    });

    return activities;
  }

  private async deleteFromFirestore(id: string): Promise<void> {
    if (!this.userId) return;

    const docRef = firestore()
      .collection(FIRESTORE_COLLECTION)
      .doc(`${this.userId}_${id}`);

    await docRef.delete();
  }

  // Helper methods

  private activityToStorageData(activity: LiveActivity): any {
    return {
      id: activity.id,
      attributes: activity.attributes,
      contentState: activity.contentState,
      status: activity.status,
      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt,
      nativeActivityId: activity.nativeActivityId,
      pushToken: activity.pushToken,
    };
  }

  private storageDataToActivity(data: LiveActivityStorageData): LiveActivity {
    return {
      id: data.id,
      attributes: data.attributes as any,
      contentState: data.contentState as any,
      status: data.status,
      createdAt: data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString(),
      nativeActivityId: data.nativeActivityId,
      pushToken: data.pushToken,
    };
  }

  private mergeActivities(
    localActivities: LiveActivity[],
    remoteActivities: LiveActivity[],
  ): LiveActivity[] {
    const merged = new Map<string, LiveActivity>();

    // Add local activities
    localActivities.forEach((activity) => {
      merged.set(activity.id, activity);
    });

    // Merge with remote activities, preferring the one with latest updatedAt
    remoteActivities.forEach((remoteActivity) => {
      const localActivity = merged.get(remoteActivity.id);
      if (
        !localActivity ||
        remoteActivity.updatedAt > localActivity.updatedAt
      ) {
        merged.set(remoteActivity.id, remoteActivity);
      }
    });

    return Array.from(merged.values());
  }

  private async validateAndCleanLocalStorage(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) {
        await AsyncStorage.removeItem(STORAGE_KEY);
        return;
      }

      // Validate each item and remove invalid ones
      const validItems = [];
      for (const item of parsed) {
        try {
          LiveActivityStorageSchema.parse(item);
          validItems.push(item);
        } catch (error) {
          console.warn('Removing invalid activity from storage:', error);
        }
      }

      // Save cleaned data back
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(validItems));
    } catch (error) {
      console.error('Error validating local storage:', error);
      // Remove corrupted storage
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
  }
}
