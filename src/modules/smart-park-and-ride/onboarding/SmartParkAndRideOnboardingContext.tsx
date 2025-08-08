/**
 * Smart Park and Ride Local Onboarding System
 *
 * This module provides a local onboarding system for the Smart Park and Ride
 * feature, similar to the global onboarding but contained within the Smart Park
 * and Ride module.
 *
 * Key Features:
 * - State persistence in AsyncStorage
 * - Overall completion tracking
 * - React context for state management
 * - Utility functions for non-React contexts
 *
 * Usage:
 * 1. Wrap your component tree with SmartParkAndRideOnboardingProvider
 * 2. Use useSmartParkAndRideOnboarding() hook to access state and actions
 * 3. Call completeOnboarding() when the entire onboarding is done
 *
 * Example:
 * ```tsx
 * const {completeOnboarding, isCompleted} = useSmartParkAndRideOnboarding();
 *
 * // Complete the entire onboarding
 * completeOnboarding();
 *
 * // Check if onboarding is completed
 * if (isCompleted) {
 *   // Onboarding is done
 * }
 * ```
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import {storage} from '@atb/modules/storage';

export type SmartParkAndRideOnboardingState = {
  isLoading: boolean;
  isCompleted: boolean;
};

type SmartParkAndRideOnboardingContextState =
  SmartParkAndRideOnboardingState & {
    completeOnboarding: () => void;
    resetOnboarding: () => void;
  };

type SmartParkAndRideOnboardingAction =
  | {
      type: 'LOAD_ONBOARDING_STATE';
      isCompleted: boolean;
    }
  | {
      type: 'COMPLETE_ONBOARDING';
    }
  | {
      type: 'RESET_ONBOARDING';
    };

const SmartParkAndRideOnboardingContext = createContext<
  SmartParkAndRideOnboardingContextState | undefined
>(undefined);

const STORAGE_KEY_IS_ONBOARDED = '@ATB_smart_park_and_ride_onboarded';

const smartParkAndRideOnboardingReducer = (
  state: SmartParkAndRideOnboardingState,
  action: SmartParkAndRideOnboardingAction,
): SmartParkAndRideOnboardingState => {
  switch (action.type) {
    case 'LOAD_ONBOARDING_STATE':
      return {
        ...state,
        isLoading: false,
        isCompleted: action.isCompleted,
      };
    case 'COMPLETE_ONBOARDING':
      return {
        ...state,
        isCompleted: true,
      };
    case 'RESET_ONBOARDING':
      return {
        ...state,
        isCompleted: false,
      };
    default:
      return state;
  }
};

const defaultState: SmartParkAndRideOnboardingState = {
  isLoading: true,
  isCompleted: false,
};

type Props = {
  children: React.ReactNode;
};

export const SmartParkAndRideOnboardingProvider = ({children}: Props) => {
  const [state, dispatch] = useReducer(
    smartParkAndRideOnboardingReducer,
    defaultState,
  );

  useEffect(() => {
    const loadOnboardingState = async () => {
      try {
        const isCompletedData = await storage.get(STORAGE_KEY_IS_ONBOARDED);
        const isCompleted = isCompletedData
          ? JSON.parse(isCompletedData)
          : false;

        dispatch({
          type: 'LOAD_ONBOARDING_STATE',
          isCompleted,
        });
      } catch (error) {
        console.error(
          'Failed to load smart park and ride onboarding state:',
          error,
        );
        dispatch({
          type: 'LOAD_ONBOARDING_STATE',
          isCompleted: false,
        });
      }
    };

    loadOnboardingState();
  }, []);

  const completeOnboarding = useCallback(async () => {
    dispatch({type: 'COMPLETE_ONBOARDING'});

    try {
      await storage.set(STORAGE_KEY_IS_ONBOARDED, JSON.stringify(true));
    } catch (error) {
      console.error('Failed to save onboarding completion:', error);
    }
  }, []);

  const resetOnboarding = useCallback(async () => {
    dispatch({type: 'RESET_ONBOARDING'});

    try {
      await storage.remove(STORAGE_KEY_IS_ONBOARDED);
    } catch (error) {
      console.error('Failed to reset onboarding state:', error);
    }
  }, []);

  return (
    <SmartParkAndRideOnboardingContext.Provider
      value={{
        ...state,
        completeOnboarding,
        resetOnboarding,
      }}
    >
      {children}
    </SmartParkAndRideOnboardingContext.Provider>
  );
};

export const useSmartParkAndRideOnboarding = () => {
  const context = useContext(SmartParkAndRideOnboardingContext);
  if (context === undefined) {
    throw new Error(
      'useSmartParkAndRideOnboarding must be used within a SmartParkAndRideOnboardingProvider',
    );
  }
  return context;
};

export const useShouldShowSmartParkAndRideOnboarding = () => {
  const {isCompleted, isLoading} = useSmartParkAndRideOnboarding();
  return !isCompleted && !isLoading;
};
