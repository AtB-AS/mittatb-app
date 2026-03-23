## Full event catalog

### Event contexts

Defined in `src/modules/analytics/types.ts`:

| Context | Description |
|---|---|
| `AnnouncementSheet` | Announcement interactions |
| `Bonus` | Bonus points features |
| `Contact` | Contact/support interactions |
| `Dashboard` | Dashboard screen interactions |
| `Departure details` | Departure detail views |
| `Favorites` | Favorite management |
| `Flexible transport` | Flexible/on-demand transport |
| `In App Review` | App review prompts |
| `Journey aid` | Journey aid / travel assistance |
| `Loading boundary` | Loading states |
| `Location search` | Location search interactions |
| `Map` | Map interactions |
| `Mobility` | Scooters, bikes, car sharing |
| `Onboarding` | Onboarding flows |
| `OnPress event` | Automatic button press tracking |
| `Parking violations` | Parking violation reports |
| `Profile` | Profile screen interactions |
| `Receipt` | Receipt/email interactions |
| `Smart Park & Ride` | Park and ride features |
| `Ticket assistant` | Ticket assistant interactions |
| `Ticketing` | Ticket purchasing and management |
| `Trip details` | Trip detail views |
| `Trip search` | Trip search interactions |

---

### Bonus

| Event | Properties | File |
|---|---|---|
| `Bonus: bonus points checkbox toggled` | `{checked}` | `src/modules/mobility/components/CarSharingStationBottomSheet.tsx` |
| `Bonus: bonus points checkbox toggled` | `{checked}` | `src/modules/mobility/components/BikeStationBottomSheet.tsx` |
| `Bonus: Dashboard bonus info button clicked` | _(none)_ | `src/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_RootScreen/components/BonusDashboard.tsx` |
| `Bonus: Feedback button clicked` | _(none)_ | `src/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/Profile_BonusScreen.tsx` |

### Dashboard

| Event | Properties | File |
|---|---|---|
| `Dashboard: Announcement dismissed` | `{announcementId}` | `src/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_RootScreen/components/AnnouncementSection.tsx` |
| `Dashboard: Announcement pressed` | `{announcementId}` | `src/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_RootScreen/components/hooks.ts` |
| `Dashboard: Purchase ticket button clicked` | _(none)_ | `src/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_RootScreen/Dashboard_RootScreen.tsx` |

### Departure details

| Event | Properties | File |
|---|---|---|
| `Departure details: See live bus clicked` | `{fromQuayId}` | `src/screen-components/travel-details-screens/DepartureDetailsScreenComponent.tsx` |
| `Departure details: Add to Favourite clicked` | `{quayId}` | `src/screen-components/travel-details-screens/DepartureDetailsScreenComponent.tsx` |

### Flexible transport

| Event | Properties | File |
|---|---|---|
| `Flexible transport: Book online url opened` | `{name, orderUrl}` | `src/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/components/CityZoneMessage.tsx` |
| `Flexible transport: Book by phone url opened` | `{name, phoneNumber}` | `src/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/components/CityZoneMessage.tsx` |
| `Flexible transport: More info url opened` | `{name, moreInfoUrl}` | `src/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/components/CityZoneMessage.tsx` |
| `Flexible transport: Message box dismissed` | _(none)_ | `src/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/Dashboard_TripSearchScreen.tsx` |

### In App Review

| Event | Properties | File |
|---|---|---|
| `In App Review: Criteria met` | _(none)_ | `src/utils/use-in-app-review.ts` |
| `In App Review: Completed` | _(none)_ | `src/utils/use-in-app-review.ts` |
| `In App Review: Error` | _(none)_ | `src/utils/use-in-app-review.ts` |

### Journey aid

| Event | Properties | File |
|---|---|---|
| `Journey aid: Open journey aid clicked` | `{serviceJourneyId}` | `src/screen-components/travel-details-screens/DepartureDetailsScreenComponent.tsx` |
| `Journey aid: Stop signal button pressed` | _(none)_ | `src/screen-components/travel-aid/components/StopSignalButton.tsx` |

### Location search

| Event | Properties | File |
|---|---|---|
| `Location search: Previous location selected` | `{locationType}` | `src/stacks-hierarchy/Root_LocationSearchByTextScreen/components/LocationSearchContent.tsx` |

### Map

| Event | Properties | File |
|---|---|---|
| `Map: Stop place selected` | `{id}` | `src/modules/map/hooks/use-map-selection-analytics.tsx` |
| `Map: City bike station selected` | `{id}` | `src/modules/map/hooks/use-map-selection-analytics.tsx` |
| `Map: Car sharing station selected` | `{id}` | `src/modules/map/hooks/use-map-selection-analytics.tsx` |
| `Map: Scooter selected` | `{id}` | `src/modules/map/hooks/use-map-selection-analytics.tsx` |
| `Map: Bike selected` | `{id}` | `src/modules/map/hooks/use-map-selection-analytics.tsx` |
| `Map: Scooter selected` | `{id}` | `src/stacks-hierarchy/Root_ScanQrCodeScreen.tsx` |
| `Map: Filter changed` | `{filter}` | `src/modules/map/MapBottomSheets.tsx` |
| `Map: Filter button clicked` | _(none)_ | `src/modules/mobility/components/filter/MapFilter.tsx` |
| `Map: Scan` | _(none)_ | `src/modules/map/components/ScanButton.tsx` |
| `Map: Stop place travelFrom button clicked` | `{id, name}` | `src/screen-components/place-screen/components/MapStopPlacesListHeader.tsx` |
| `Map: Stop place travelTo button clicked` | `{id, name}` | `src/screen-components/place-screen/components/MapStopPlacesListHeader.tsx` |

### Mobility

| Event | Properties | File |
|---|---|---|
| `Mobility: Report parking violation clicked` | _(none)_ | `src/modules/map/MapBottomSheets.tsx` |
| `Mobility: Open terms` | _(none)_ | `src/modules/mobility/components/onboarding/RulesScreenComponent.tsx` |
| `Mobility: Take a photo to end booking from mapscreen` | `{bookingId}` | `src/modules/mobility/components/sheets/FinishingScooterSheet.tsx` |
| `Mobility: Shmo booking start finishing` | `{bookingId}` | `src/modules/mobility/components/sheets/ActiveScooterSheet.tsx` |
| `Mobility: Open operator app` | `{operator, vehicleId}` | `src/modules/mobility/components/OperatorActionButton.tsx` |
| `Mobility: Shmo booking started` | `{operator, vehicleId}` | `src/modules/mobility/components/ShmoActionButton.tsx` |
| `Mobility: Shmo booking finished` | `{bookingId}` | `src/stacks-hierarchy/Root_ParkingPhotoScreen.tsx` |
| `Mobility: Parking violation report sent` | _(none)_ | `src/stacks-hierarchy/Root_ScooterHelp/Root_ParkingViolationsConfirmationScreen.tsx` |
| `Mobility: Scooter Operator Contact form sent` | _(none)_ | `src/stacks-hierarchy/Root_ScooterHelp/Root_ContactScooterOperatorConfirmationScreen.tsx` |

### OnPress event (automatic)

| Event | Properties | File |
|---|---|---|
| `OnPress event: <testID>` | _(none)_ | `src/components/native-button/NativeBorderlessButton.tsx` |
| `OnPress event: <testID>` | _(none)_ | `src/components/native-button/NativeBlockButton.tsx` |

These fire automatically for any `NativeBorderlessButton` or `NativeBlockButton` that has a `testID` prop.

The `HeaderButton` component also optionally logs `"<context>: Header button of type <type> clicked"` when an `analyticsEventContext` prop is provided (`src/components/screen-header/HeaderButton.tsx`).

### Profile

| Event | Properties | File |
|---|---|---|
| `Profile: User logging out` | _(none)_ | `src/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/Profile_RootScreen.tsx` |
| `Profile: Retry auth` | _(none)_ | `src/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/components/UserInfo.tsx` |
| `Profile: Toggle notifications` | `{enabled}` | `src/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/Profile_RootScreen.tsx` |
| `Profile: Open privacy statement` | _(none)_ | `src/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/Profile_RootScreen.tsx` |
| `Profile: Toggle travel aid` | `{enabled}` | `src/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/Profile_TravelAidScreen.tsx` |

### Receipt

| Event | Properties | File |
|---|---|---|
| `Receipt: Email sent` | _(none)_ | `src/stacks-hierarchy/Root_ReceiptScreen.tsx` |

### Smart Park & Ride

| Event | Properties | File |
|---|---|---|
| `Smart Park & Ride: Vehicle added` | `{licensePlateLength}` | `src/stacks-hierarchy/Root_SmartParkAndRide/Root_SmartParkAndRideAddScreen.tsx` |
| `Smart Park & Ride: Add vehicle clicked` | _(none)_ | `src/stacks-hierarchy/Root_SmartParkAndRide/Root_SmartParkAndRideAddScreen.tsx` |
| `Smart Park & Ride: Delete vehicle clicked` | `{vehicleId}` | `src/stacks-hierarchy/Root_SmartParkAndRide/Root_SmartParkAndRideEditScreen.tsx` |
| `Smart Park & Ride: Delete vehicle cancelled` | _(none)_ | `src/stacks-hierarchy/Root_SmartParkAndRide/Root_SmartParkAndRideEditScreen.tsx` |
| `Smart Park & Ride: Delete vehicle confirmed` | `{vehicleId}` | `src/stacks-hierarchy/Root_SmartParkAndRide/Root_SmartParkAndRideEditScreen.tsx` |
| `Smart Park & Ride: Edit vehicle clicked` | `{vehicleId}` | `src/stacks-hierarchy/Root_SmartParkAndRide/Root_SmartParkAndRideEditScreen.tsx` |
| `Smart Park & Ride: How it works clicked` | _(none)_ | `src/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/Profile_SmartParkAndRideScreen.tsx` |
| `Smart Park & Ride: Toggle Smart Park & Ride` | `{enabled}` | `src/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/Profile_SmartParkAndRideScreen.tsx` |
| `Smart Park & Ride: Toggle auto register` | `{enabled}` | `src/stacks-hierarchy/Root_TabNavigatorStack/TabNav_ProfileStack/Profile_SmartParkAndRideScreen.tsx` |
| `Smart Park & Ride: Onboarding completed` | _(none)_ | `src/modules/smart-park-and-ride/onboarding/SmartParkAndRideOnboarding_InformationScreen.tsx` |
| `Smart Park & Ride: Onboarding automatic registration toggled` | `{enabled}` | `src/modules/smart-park-and-ride/onboarding/SmartParkAndRideOnboarding_AutomaticRegistrationScreen.tsx` |
| `Smart Park & Ride: Onboarding contact info saved` | _(none)_ | `src/modules/smart-park-and-ride/onboarding/SmartParkAndRideOnboarding_ContactInfoScreen.tsx` |

### Ticketing

| Event | Properties | File |
|---|---|---|
| `Ticketing: Ticket details clicked` | _(none)_ | `src/modules/fare-contracts/FareContractAndReservationsList.tsx` |
| `Ticketing: Activated fare contract ahead of time` | `{orderId}` | `src/modules/fare-contracts/components/ActivateNowBottomSheet.tsx` |
| `Ticketing: Consumed carnet` | `{orderId}` | `src/modules/fare-contracts/components/ConsumeCarnetBottomSheet.tsx` |
| `Ticketing: Ticket refunded` | `{orderId}` | `src/modules/fare-contracts/components/RefundBottomSheet.tsx` |
| `Ticketing: Ticket details clicked` | _(none)_ | `src/screen-components/purchase-history/PurchaseHistoryScreenComponent.tsx` |
| `Ticketing: Fare product selected` | `{productType}` | `src/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/TicketTabNav_PurchaseTabScreen.tsx` |
| `Ticketing: Recently used fare product selected` | `{productType}` | `src/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/TicketTabNav_PurchaseTabScreen.tsx` |
| `Ticketing: Pull to refresh products` | `{productCount}` | `src/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/TicketTabNav_PurchaseTabScreen.tsx` |
| `Ticketing: Pull to refresh tickets` | `{ticketCount}` | `src/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/TicketTabNav_AvailableFareContractsTabScreen.tsx` |
| `Ticketing: Payment cancelled` | _(none)_ | `src/stacks-hierarchy/Root_PurchaseConfirmationScreen/Root_PurchaseConfirmationScreen.tsx` |
| `Ticketing: Complete free purchase selected` | _(none)_ | `src/stacks-hierarchy/Root_PurchaseConfirmationScreen/Root_PurchaseConfirmationScreen.tsx` |
| `Ticketing: Apple Pay selected` | _(none)_ | `src/stacks-hierarchy/Root_PurchaseConfirmationScreen/Root_PurchaseConfirmationScreen.tsx` |
| `Ticketing: Pay with card selected` | `{paymentMethod}` | `src/stacks-hierarchy/Root_PurchaseConfirmationScreen/Root_PurchaseConfirmationScreen.tsx` |
| `Ticketing: Confirm purchase clicked` | `{mode, ...tripAnalytics?}` — spreads `TripAnalytics` fields: `zones`, `zoneCount`, `legCount`, `nonFootLegCount`, `legModes`, `duration` | `src/stacks-hierarchy/Root_PurchaseConfirmationScreen/Root_PurchaseConfirmationScreen.tsx` |
| `Ticketing: Pay with previous payment method clicked` | `{paymentMethod, mode, ...tripAnalytics?}` — spreads `TripAnalytics` fields: `zones`, `zoneCount`, `legCount`, `nonFootLegCount`, `legModes`, `duration` | `src/stacks-hierarchy/Root_PurchaseConfirmationScreen/Root_PurchaseConfirmationScreen.tsx` |
| `Ticketing: Purchase summary clicked` | `{fareProduct, fareZone: {from, to}, stopPlaces: {from, to}, userProfilesWithCount: [{userType, count}], baggageProductsWithCount: [{id, count}], preassignedFareProduct: {id, name}, travelDate, mode}` | `src/stacks-hierarchy/Root_PurchaseOverviewScreen/Root_PurchaseOverviewScreen.tsx` |
| `Ticketing: Ticket information button clicked` | `{preassignedFareProductId, userProfilesWithCountAndOffer}` | `src/stacks-hierarchy/Root_PurchaseOverviewScreen/Root_PurchaseOverviewScreen.tsx` |
| `Ticketing: Expand flex discount info` | _(none)_ | `src/stacks-hierarchy/Root_PurchaseOverviewScreen/components/FlexTicketDiscountInfo.tsx` |
| `Ticketing: Retry auth` | _(none)_ | `src/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Components/ErrorWithAccountMessage.tsx` |

### Trip details

| Event | Properties | File |
|---|---|---|
| `Trip details: See live bus clicked` | `{fromPlace, toPlace, ...TripAnalytics}` | `src/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripDetailsScreen.tsx` |
| `Trip details: Map clicked` | `TripAnalytics` (all fields) | `src/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripDetailsScreen.tsx` |
| `Trip details: Buy ticket clicked` | `TripAnalytics` (all fields) | `src/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripDetailsScreen.tsx` |
| `Trip details: Stop place clicked` | `TripAnalytics` (all fields) | `src/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripDetailsScreen.tsx` |
| `Trip details: Departure clicked` | `TripAnalytics` (all fields) | `src/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripDetailsScreen.tsx` |
| `Trip details: Trip saved` | `TripAnalytics` (all fields) | `src/modules/experimental-store-trip-patterns/SaveTripPatternButtonComponent.tsx` |
| `Trip details: Trip removed` | `TripAnalytics` (all fields) | `src/modules/experimental-store-trip-patterns/SaveTripPatternButtonComponent.tsx` |

### Trip search

| Event | Properties | File |
|---|---|---|
| `Trip search: Search performed` | `{searchTime, filtersSelection}` | `src/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/use-trips.ts` |
| `Trip search: Trip details opened` | `{analyticsMetadata?}` (passed from caller) | `src/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/Dashboard_TripSearchScreen.tsx` |
| `Trip search: Locations to/from swapped` | _(none)_ | `src/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/Dashboard_TripSearchScreen.tsx` |

### Direct capture events (not using `logEvent`)

These bypass the `logEvent` helper and call `posthogClient.capture()` directly:

| Event Name | Properties | File |
|---|---|---|
| `ScreenshotTaken` | _(none)_ | `src/modules/analytics/AnalyticsContext.tsx` |
| `TripDetailsScreenshotTaken` | `TripAnalytics` (all fields) | `src/screen-components/travel-details-screens/TripDetailsScreenComponent.tsx` |

---

## Key files index

| File | Role |
|---|---|
| `src/modules/analytics/AnalyticsContext.tsx` | PostHog initialization, provider, `useAnalyticsContext` hook, `getPosthogClientGlobal`, screenshot tracking |
| `src/modules/analytics/types.ts` | `AnalyticsEventContext` type definition |
| `src/modules/analytics/index.ts` | Barrel exports: `AnalyticsContextProvider`, `useAnalyticsContext`, `getPosthogClientGlobal`, `AnalyticsEventContext` |
| `src/screen-components/travel-details-screens/utils.ts` | `TripAnalytics` type, `getTripPatternAnalytics` function |
| `src/screen-components/travel-details-screens/index.tsx` | Barrel exports for `getTripPatternAnalytics` and `TripAnalytics` |
| `src/modules/diagnostics/trackNavigation.ts` | Manual screen view tracking via `postHogClient.screen()` |
| `src/stacks-hierarchy/RootStack.tsx` | Navigation state change listener calling `trackNavigation` |
| `src/stacks-hierarchy/navigation-types.ts` | `RootStackParamList` — central navigation param type map |
| `src/modules/feature-toggles/toggle-specifications.ts` | `isPosthogEnabled` feature toggle definition |
| `types/react-native-dotenv.d.ts` | Type declarations for `POSTHOG_API_KEY` and `POSTHOG_HOST` env vars |
| `src/components/native-button/NativeBorderlessButton.tsx` | Auto-logs `OnPress event` for buttons with `testID` |
| `src/components/native-button/NativeBlockButton.tsx` | Auto-logs `OnPress event` for buttons with `testID` |
| `src/components/screen-header/HeaderButton.tsx` | Optional header button press tracking with `analyticsEventContext` prop |
| `src/modules/experimental-store-trip-patterns/SaveTripPatternButtonComponent.tsx` | Trip saved/removed events |
