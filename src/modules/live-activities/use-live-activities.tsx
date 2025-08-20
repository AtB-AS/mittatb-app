import {useEffect, useState, useCallback, useRef} from 'react';
import {useAuthContext} from '@atb/modules/auth';
import {
  LiveActivity,
  LiveActivityAttributes,
  LiveActivityContentState,
  CreateLiveActivityRequest,
  UpdateLiveActivityRequest,
  EndLiveActivityRequest,
  LiveActivityEvent,
  LiveActivityCapabilities,
  LiveActivityError,
  LiveActivityErrorType,
  LiveActivityStatus,
} from './types';
import {LiveActivityService} from './service';

/**
 * Hook for managing Live Activities
 * Provides a React-friendly interface to the Live Activity service
 */
export function useLiveActivities() {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [capabilities, setCapabilities] =
    useState<LiveActivityCapabilities | null>(null);
  const [activeActivities, setActiveActivities] = useState<LiveActivity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<LiveActivityError | null>(null);

  const {authStatus} = useAuthContext();
  const serviceRef = useRef<LiveActivityService | null>(null);
  const eventListenerRef = useRef<(() => void) | null>(null);

  // Initialize service
  useEffect(() => {
    const initializeService = async () => {
      try {
        setIsLoading(true);
        serviceRef.current = LiveActivityService.getInstance();

        // Initialize with user ID for storage
        await serviceRef.current.initialize();

        // Check support and capabilities
        const supported = await serviceRef.current.isSupported();
        const caps = await serviceRef.current.getCapabilities();

        setIsSupported(supported);
        setCapabilities(caps);

        // Load active activities
        if (supported) {
          const activities = await serviceRef.current.getActiveActivities();
          setActiveActivities(activities);
        }

        setError(null);
      } catch (err) {
        console.error('Error initializing Live Activities:', err);
        setError(err as LiveActivityError);
      } finally {
        setIsLoading(false);
      }
    };

    initializeService();
  }, [authStatus]);

  const handleLiveActivityEvent = useCallback((event: LiveActivityEvent) => {
    switch (event.type) {
      case 'created':
      case 'updated':
        if (event.activity) {
          setActiveActivities((prev) => {
            const filtered = prev.filter((a) => a.id !== event.activityId);
            return [...filtered, event.activity!];
          });
        }
        break;

      case 'ended':
      case 'dismissed':
        setActiveActivities((prev) =>
          prev.filter((a) => a.id !== event.activityId),
        );
        break;

      case 'error':
        console.error('Live Activity error:', event.error);
        break;
    }
  }, []);

  // Setup event listeners
  useEffect(() => {
    if (!serviceRef.current) return;

    const removeListener = serviceRef.current.addEventListener(
      handleLiveActivityEvent,
    );
    eventListenerRef.current = removeListener;

    return () => {
      if (eventListenerRef.current) {
        eventListenerRef.current();
      }
    };
  }, [handleLiveActivityEvent]);

  const createActivity = useCallback(
    async <
      TAttributes extends LiveActivityAttributes,
      TContentState extends LiveActivityContentState,
    >(
      request: CreateLiveActivityRequest<TAttributes, TContentState>,
    ): Promise<LiveActivity<TAttributes, TContentState> | null> => {
      if (!serviceRef.current) {
        setError(
          new LiveActivityError(
            LiveActivityErrorType.notSupported,
            'Service not initialized',
          ),
        );
        return null;
      }

      try {
        setError(null);
        const activity = await serviceRef.current.createActivity(request);
        return activity;
      } catch (err) {
        console.error('Error creating Live Activity:', err);
        setError(err as LiveActivityError);
        return null;
      }
    },
    [],
  );

  const updateActivity = useCallback(
    async <TContentState extends LiveActivityContentState>(
      request: UpdateLiveActivityRequest<TContentState>,
    ): Promise<boolean> => {
      if (!serviceRef.current) {
        setError(
          new LiveActivityError(
            LiveActivityErrorType.notSupported,
            'Service not initialized',
          ),
        );
        return false;
      }

      try {
        setError(null);
        await serviceRef.current.updateActivity(request);
        return true;
      } catch (err) {
        console.error('Error updating Live Activity:', err);
        setError(err as LiveActivityError);
        return false;
      }
    },
    [],
  );

  const endActivity = useCallback(
    async (request: EndLiveActivityRequest): Promise<boolean> => {
      if (!serviceRef.current) {
        setError(
          new LiveActivityError(
            LiveActivityErrorType.notSupported,
            'Service not initialized',
          ),
        );
        return false;
      }

      try {
        setError(null);
        await serviceRef.current.endActivity(request);
        return true;
      } catch (err) {
        console.error('Error ending Live Activity:', err);
        setError(err as LiveActivityError);
        return false;
      }
    },
    [],
  );

  const getActivity = useCallback(
    async (id: string): Promise<LiveActivity | null> => {
      if (!serviceRef.current) {
        return null;
      }

      try {
        return await serviceRef.current.getActivity(id);
      } catch (err) {
        console.error('Error getting Live Activity:', err);
        setError(err as LiveActivityError);
        return null;
      }
    },
    [],
  );

  const requestPermissions = useCallback(async (): Promise<boolean> => {
    if (!serviceRef.current) {
      setError(
        new LiveActivityError(
          LiveActivityErrorType.notSupported,
          'Service not initialized',
        ),
      );
      return false;
    }

    try {
      setError(null);
      return await serviceRef.current.requestPermissions();
    } catch (err) {
      console.error('Error requesting permissions:', err);
      setError(err as LiveActivityError);
      return false;
    }
  }, []);

  const cleanupInactiveActivities = useCallback(async (): Promise<boolean> => {
    if (!serviceRef.current) {
      return false;
    }

    try {
      await serviceRef.current.cleanupInactiveActivities();

      // Refresh active activities list
      const activities = await serviceRef.current.getActiveActivities();
      setActiveActivities(activities);

      return true;
    } catch (err) {
      console.error('Error cleaning up activities:', err);
      setError(err as LiveActivityError);
      return false;
    }
  }, []);

  const syncWithNative = useCallback(async (): Promise<boolean> => {
    if (!serviceRef.current) {
      return false;
    }

    try {
      await serviceRef.current.syncWithNativeActivities();

      // Refresh active activities list
      const activities = await serviceRef.current.getActiveActivities();
      setActiveActivities(activities);

      return true;
    } catch (err) {
      console.error('Error syncing with native:', err);
      setError(err as LiveActivityError);
      return false;
    }
  }, []);

  return {
    // State
    isSupported,
    capabilities,
    activeActivities,
    isLoading,
    error,

    // Actions
    createActivity,
    updateActivity,
    endActivity,
    getActivity,
    requestPermissions,
    cleanupInactiveActivities,
    syncWithNative,
  };
}

/**
 * Hook for managing a specific type of Live Activity
 */
export function useLiveActivity<
  TAttributes extends LiveActivityAttributes,
  TContentState extends LiveActivityContentState,
>(activityId: string) {
  const [activity, setActivity] = useState<LiveActivity<
    TAttributes,
    TContentState
  > | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<LiveActivityError | null>(null);

  const {getActivity, updateActivity, endActivity} = useLiveActivities();

  // Load activity on mount
  useEffect(() => {
    const loadActivity = async () => {
      try {
        setIsLoading(true);
        const loadedActivity = await getActivity(activityId);
        setActivity(loadedActivity as LiveActivity<TAttributes, TContentState>);
        setError(null);
      } catch (err) {
        console.error('Error loading Live Activity:', err);
        setError(err as LiveActivityError);
      } finally {
        setIsLoading(false);
      }
    };

    if (activityId) {
      loadActivity();
    }
  }, [activityId, getActivity]);

  const update = useCallback(
    async (contentState: Partial<TContentState>): Promise<boolean> => {
      if (!activity) return false;

      const success = await updateActivity({
        id: activity.id,
        contentState,
      });

      if (success) {
        // Reload activity to get updated state
        const updatedActivity = await getActivity(activityId);
        setActivity(
          updatedActivity as LiveActivity<TAttributes, TContentState>,
        );
      }

      return success;
    },
    [activity, activityId, updateActivity, getActivity],
  );

  const end = useCallback(
    async (
      dismissalPolicy?: 'immediate' | 'default' | 'after-date',
      finalContentState?: Partial<TContentState>,
    ): Promise<boolean> => {
      if (!activity) return false;

      return await endActivity({
        id: activity.id,
        dismissalPolicy,
        finalContentState,
      });
    },
    [activity, endActivity],
  );

  return {
    activity,
    isLoading,
    error,
    update,
    end,
    isActive: activity?.status === LiveActivityStatus.active,
  };
}
