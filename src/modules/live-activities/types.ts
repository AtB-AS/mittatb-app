import {z} from 'zod';

/**
 * Live Activity status types
 */
export enum LiveActivityStatus {
  active = 'active',
  ended = 'ended',
  dismissed = 'dismissed',
  stale = 'stale',
}

/**
 * Live Activity types for different features in the app
 */
export enum LiveActivityType {
  departure = 'departure',
  journey = 'journey',
  ticket = 'ticket',
  serviceUpdate = 'serviceUpdate',
}

/**
 * Base interface for all Live Activity attributes
 * This contains static data that doesn't change during the activity's lifetime
 */
export interface BaseLiveActivityAttributes {
  id: string;
  type: LiveActivityType;
  title: string;
  description?: string;
  deepLink?: string;
  activityName: string; // For debugging purposes
}

/**
 * Base interface for Live Activity content state
 * This contains dynamic data that can be updated during the activity's lifetime
 * All dates are ISO 8601 strings for consistent serialization
 */
export interface BaseLiveActivityContentState {
  updatedAt: string; // ISO 8601 string
  relevantUntil?: string; // ISO 8601 string
  staleDate?: string; // ISO 8601 string
}

/**
 * Departure-specific Live Activity attributes
 */
export interface DepartureLiveActivityAttributes
  extends BaseLiveActivityAttributes {
  type: LiveActivityType.departure;
  stopId: string;
  stopName: string;
  lineNumber: string;
  destination: string;
  departureId: string;
}

/**
 * Departure-specific Live Activity content state
 * All dates are ISO 8601 strings for consistent serialization
 */
export interface DepartureLiveActivityContentState
  extends BaseLiveActivityContentState {
  scheduledTime: string; // ISO 8601 string
  estimatedTime?: string; // ISO 8601 string
  realtimeStatus: 'on-time' | 'delayed' | 'cancelled' | 'no-data';
  delay?: number; // in minutes
  platform?: string;
  occupancy?: 'low' | 'medium' | 'high';
}

/**
 * Journey-specific Live Activity attributes
 */
export interface JourneyLiveActivityAttributes
  extends BaseLiveActivityAttributes {
  type: LiveActivityType.journey;
  fromStopName: string;
  toStopName: string;
  routeId: string;
}

/**
 * Journey-specific Live Activity content state
 * All dates are ISO 8601 strings for consistent serialization
 */
export interface JourneyLiveActivityContentState
  extends BaseLiveActivityContentState {
  currentProgress: number; // 0-1
  nextStopName: string;
  estimatedArrival: string; // ISO 8601 string
  totalDuration: number; // in minutes
}

/**
 * Ticket-specific Live Activity attributes
 */
export interface TicketLiveActivityAttributes
  extends BaseLiveActivityAttributes {
  type: LiveActivityType.ticket;
  ticketId: string;
  productName: string;
  zoneNames: string[];
}

/**
 * Ticket-specific Live Activity content state
 * All dates are ISO 8601 strings for consistent serialization
 */
export interface TicketLiveActivityContentState
  extends BaseLiveActivityContentState {
  validFrom: string; // ISO 8601 string
  validTo: string; // ISO 8601 string
  remainingTime: number; // in minutes
  usageStatus: 'unused' | 'active' | 'expired';
}

/**
 * Service Update-specific Live Activity attributes
 */
export interface ServiceUpdateLiveActivityAttributes
  extends BaseLiveActivityAttributes {
  type: LiveActivityType.serviceUpdate;
  affectedLines: string[];
  severity: 'info' | 'warning' | 'critical';
}

/**
 * Service Update-specific Live Activity content state
 * All dates are ISO 8601 strings for consistent serialization
 */
export interface ServiceUpdateLiveActivityContentState
  extends BaseLiveActivityContentState {
  message: string;
  expectedResolution?: string; // ISO 8601 string
  status: 'ongoing' | 'resolved' | 'escalated';
}

/**
 * Union types for type-safe handling of different activity types
 */
export type LiveActivityAttributes =
  | DepartureLiveActivityAttributes
  | JourneyLiveActivityAttributes
  | TicketLiveActivityAttributes
  | ServiceUpdateLiveActivityAttributes;

export type LiveActivityContentState =
  | DepartureLiveActivityContentState
  | JourneyLiveActivityContentState
  | TicketLiveActivityContentState
  | ServiceUpdateLiveActivityContentState;

/**
 * Complete Live Activity data structure
 */
export interface LiveActivity<
  TAttributes extends LiveActivityAttributes = LiveActivityAttributes,
  TContentState extends LiveActivityContentState = LiveActivityContentState,
> {
  id: string;
  attributes: TAttributes;
  contentState: TContentState;
  status: LiveActivityStatus;
  createdAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
  nativeActivityId?: string; // iOS ActivityKit ID or Android notification ID
  pushToken?: string; // For push updates
}

/**
 * Configuration for Live Activity creation
 */
export interface LiveActivityConfig {
  enablePushUpdates?: boolean;
  priority?: 'low' | 'default' | 'high';
  relevanceScore?: number; // 0-1, higher = more prominent in Dynamic Island
  dismissalPolicy?: 'immediate' | 'default' | 'after-date';
  dynamicIslandContentMargins?: {
    leading?: number;
    trailing?: number;
    top?: number;
    bottom?: number;
  };
}

/**
 * Request to create a new Live Activity
 */
export interface CreateLiveActivityRequest<
  TAttributes extends LiveActivityAttributes = LiveActivityAttributes,
  TContentState extends LiveActivityContentState = LiveActivityContentState,
> {
  attributes: TAttributes;
  contentState: TContentState;
  config?: LiveActivityConfig;
}

/**
 * Request to update an existing Live Activity
 */
export interface UpdateLiveActivityRequest<
  TContentState extends LiveActivityContentState = LiveActivityContentState,
> {
  id: string;
  contentState: Partial<TContentState>;
  config?: Partial<LiveActivityConfig>;
}

/**
 * Request to end a Live Activity
 */
export interface EndLiveActivityRequest {
  id: string;
  dismissalPolicy?: 'immediate' | 'default' | 'after-date';
  finalContentState?: Partial<LiveActivityContentState>;
}

/**
 * Live Activity event types for listeners
 */
export enum LiveActivityEventType {
  created = 'created',
  updated = 'updated',
  ended = 'ended',
  dismissed = 'dismissed',
  error = 'error',
}

/**
 * Live Activity event data
 */
export interface LiveActivityEvent {
  type: LiveActivityEventType;
  activityId: string;
  activity?: LiveActivity;
  error?: string;
  timestamp: string; // ISO 8601 string
}

/**
 * Persistent storage schema for Live Activities
 */
export const LiveActivityStorageSchema = z.object({
  id: z.string(),
  attributes: z.record(z.any()),
  contentState: z.record(z.any()),
  status: z.nativeEnum(LiveActivityStatus),
  createdAt: z.string().transform((val) => new Date(val)),
  updatedAt: z.string().transform((val) => new Date(val)),
  nativeActivityId: z.string().optional(),
  pushToken: z.string().optional(),
});

export type LiveActivityStorageData = z.infer<typeof LiveActivityStorageSchema>;

/**
 * Error types for Live Activities
 */
export enum LiveActivityErrorType {
  notSupported = 'not_supported',
  permissionDenied = 'permission_denied',
  invalidConfiguration = 'invalid_configuration',
  activityNotFound = 'activity_not_found',
  nativeError = 'native_error',
  storageError = 'storage_error',
}

export class LiveActivityError extends Error {
  constructor(
    public type: LiveActivityErrorType,
    message: string,
    public originalError?: Error,
  ) {
    super(message);
    this.name = 'LiveActivityError';
  }
}

/**
 * Platform-specific Live Activity capabilities
 */
export interface LiveActivityCapabilities {
  isSupported: boolean;
  supportsDynamicIsland: boolean;
  supportsLockScreen: boolean;
  supportsPushUpdates: boolean;
  maxActiveActivities: number;
}
