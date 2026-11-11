import React from 'react';
import {PostHogMaskView, type PostHogMaskViewProps} from 'posthog-react-native';

/**
 * Hides its children from PostHog session replays, without affecting
 * accessibility.
 */
export const SessionReplayMask = (props: PostHogMaskViewProps) => (
  <PostHogMaskView {...props} />
);
