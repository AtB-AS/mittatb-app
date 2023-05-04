import {FullScreenHeader} from '@atb/components/screen-header';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, Theme} from '@atb/theme';
import React, {useEffect, useState} from 'react';
import {Alert, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Clipboard from '@react-native-clipboard/clipboard';
import {useAuthState} from '@atb/auth';
import {useAppDispatch, useAppState} from '@atb/AppContext';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {KeyValuePair, storage, StorageModelKeysEnum} from '@atb/storage';
import {
  useHasEnabledMobileToken,
  useMobileTokenContextState,
} from '@atb/mobile-token/MobileTokenContext';
import Slider from '@react-native-community/slider';
import {usePreferences, UserPreferences} from '@atb/preferences';
import {get, keys} from 'lodash';
import {Button} from '@atb/components/button';
import {
  RemoteConfigContextState,
  useRemoteConfig,
} from '@atb/RemoteConfigContext';
import {useGlobalMessagesState} from '@atb/global-messages';
import {APP_GROUP_NAME} from '@env';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ExpandLess, ExpandMore} from '@atb/assets/svg/mono-icons/navigation';
import {useTravelSearchFiltersDebugOverride} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/use-travel-search-filters-enabled';
import {useVehiclesInMapDebugOverride} from '@atb/mobility';
import {DebugOverride} from './components/DebugOverride';
import {useNewTravelSearchDebugOverride} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/use_new_travel_search_enabled';
import {useRealtimeMapDebugOverride} from '@atb/components/map';
import {useFromTravelSearchToTicketDebugOverride} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/use_from_travel_search_to_ticket_enabled';
import {useMapDebugOverride} from '@atb/components/map';
import {useTicketingAssistantDebugOverride} from '../../Root_TicketAssistantStack/use-ticketing-assistant-enabled';
import {useTipsAndInformationDebugOverride} from '@atb/stacks-hierarchy/Root_TipsAndInformation/use-tips-and-information-enabled';
import {useCityBikesInMapDebugOverride} from '@atb/mobility/use-city-bikes-enabled';
import {useFlexibleTransportDebugOverride} from '../TabNav_DashboardStack/Dashboard_TripSearchScreen/use-flexible-transport-enabled';
import {
  ExpandableSectionItem,
  GenericSectionItem,
  HeaderSectionItem,
  LinkSectionItem,
  Section,
  ToggleSectionItem,
} from '@atb/components/sections';
import {useDebugOverride} from '@atb/debug';

function setClipboard(content: string) {
  Clipboard.setString(content);
  Alert.alert('Copied!', `Copied: ${content}`);
}

export const Profile_DebugInfoScreen = () => {
  const style = useProfileHomeStyle();
  const appDispatch = useAppDispatch();
  const {restartMobileTokenOnboarding} = useAppState();
  const {resetDismissedGlobalMessages} = useGlobalMessagesState();
  const {user, abtCustomerId} = useAuthState();
  const [idToken, setIdToken] = useState<
    FirebaseAuthTypes.IdTokenResult | undefined
  >(undefined);

  const travelSearchDebugOverride = useTravelSearchFiltersDebugOverride();
  const flexibleTransportDebugOverride = useFlexibleTransportDebugOverride();
  const flexibleTransportAccessModeDebugOverride = useDebugOverride(
    StorageModelKeysEnum.UseFlexibleTransportAccessModeDebugOverride,
  );
  const flexibleTransportDirectModeDebugOverride = useDebugOverride(
    StorageModelKeysEnum.UseFlexibleTransportDirectModeDebugOverride,
  );
  const flexibleTransportEgressModeDebugOverride = useDebugOverride(
    StorageModelKeysEnum.UseFlexibleTransportEgressModeDebugOverride,
  );
  const newTravelSearchDebugOverride = useNewTravelSearchDebugOverride();
  const fromTravelSearchToTicketDebugOverride =
    useFromTravelSearchToTicketDebugOverride();
  const vehiclesInMapDebugOverride = useVehiclesInMapDebugOverride();
  const cityBikesInMapDebugOverride = useCityBikesInMapDebugOverride();
  const realtimeMapDebugOverride = useRealtimeMapDebugOverride();
  const mapDebugOverride = useMapDebugOverride();
  const ticketingAssistantOverride = useTicketingAssistantDebugOverride();
  const tipsAndInformationOverride = useTipsAndInformationDebugOverride();

  useEffect(() => {
    async function run() {
      if (!!user) {
        const idToken = await user.getIdTokenResult();
        setIdToken(idToken);
      } else {
        setIdToken(undefined);
      }
    }

    run();
  }, [user]);

  const {
    token,
    remoteTokens,
    retry,
    createToken,
    wipeToken,
    validateToken,
    removeRemoteToken,
    renewToken,
    fallbackEnabled,
    isLoading,
    isError,
  } = useMobileTokenContextState();

  const remoteConfig = useRemoteConfig();

  const mobileTokenEnabled = useHasEnabledMobileToken();

  const [storedValues, setStoredValues] = useState<
    readonly KeyValuePair[] | null
  >(null);

  useEffect(() => {
    storage.getAll().then(setStoredValues);
  }, []);

  function copyFirestoreLink() {
    if (abtCustomerId)
      setClipboard(
        `https://console.firebase.google.com/u/1/project/atb-mobility-platform-staging/firestore/data/~2Fcustomers~2F${abtCustomerId}`,
      );
  }

  const {setPreference, preferences} = usePreferences();
  const {showTestIds, tripSearchPreferences, debugShowSeconds} = preferences;

  const tripSearchDefaults = {
    transferPenalty: 10,
    waitReluctance: 1.5,
    walkReluctance: 1.5,
    walkSpeed: 1.3,
  };

  return (
    <View style={style.container}>
      <FullScreenHeader
        title="Debug info"
        leftButton={{type: 'back'}}
        rightButton={{type: 'chat'}}
      />

      <ScrollView testID="debugInfoScrollView">
        <Section withPadding withTopPadding>
          <ToggleSectionItem
            text="Toggle test-ID"
            value={showTestIds}
            onValueChange={(showTestIds) => {
              setPreference({showTestIds});
            }}
          />
          <ToggleSectionItem
            text="Display seconds in trip planner"
            value={debugShowSeconds}
            onValueChange={(debugShowSeconds) => {
              setPreference({debugShowSeconds});
            }}
          />
          <LinkSectionItem
            text="Restart onboarding"
            onPress={() => {
              appDispatch({type: 'RESTART_ONBOARDING'});
            }}
          />
          <LinkSectionItem
            text="Set mobile token onboarded to false"
            onPress={restartMobileTokenOnboarding}
          />
          <LinkSectionItem
            text="Reset dismissed Global messages"
            onPress={resetDismissedGlobalMessages}
          />
          <LinkSectionItem
            text="Copy link to customer in Firestore (staging)"
            icon="arrow-upleft"
            onPress={() => copyFirestoreLink()}
          />

          <LinkSectionItem
            text="Force refresh id token"
            onPress={() => auth().currentUser?.getIdToken(true)}
          />

          <LinkSectionItem
            text="Force refresh remote config"
            onPress={remoteConfig.refresh}
          />

          <LinkSectionItem
            text="Reset feedback displayStats"
            onPress={() => storage.set('@ATB_feedback_display_stats', '')}
          />

          <LinkSectionItem
            text="Reset frontpage favourite departures"
            onPress={() => storage.set('@ATB_user_frontpage_departures', '[]')}
          />

          <LinkSectionItem
            text="Reset user map filters"
            onPress={() => storage.set('@ATB_user_map_filters', '')}
          />

          <LinkSectionItem
            text="Reset has read filter onboarding"
            onPress={() =>
              storage.set(
                StorageModelKeysEnum.HasReadTravelSearchFilterOnboarding,
                JSON.stringify(false),
              )
            }
          />

          <LinkSectionItem
            text="Reset travel search filters"
            onPress={() =>
              storage.set('@ATB_user_travel_search_filters_v2', '')
            }
          />

          <LinkSectionItem
            text="Reset travel search filters hits"
            onPress={() => storage.set('@ATB_user_filter_hits', '[]')}
          />

          <LinkSectionItem
            text="Reset has read scooter onboarding"
            onPress={() =>
              storage.set(
                StorageModelKeysEnum.HasReadScooterOnboarding,
                JSON.stringify(false),
              )
            }
          />
        </Section>
        <Section withPadding withTopPadding>
          <HeaderSectionItem
            text="Remote config override"
            subtitle="If undefined the value
        from Remote Config will be used. Needs reload of app after change."
          />
          <GenericSectionItem>
            <DebugOverride
              description="Flexible transport enabled"
              override={flexibleTransportDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Use Flexible on AccessMode"
              override={flexibleTransportAccessModeDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Use Flexible on DirectMode"
              override={flexibleTransportDirectModeDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Use Flexible on EgressMode"
              override={flexibleTransportEgressModeDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Enable travel search filter."
              override={travelSearchDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Enable new travel search."
              override={newTravelSearchDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Enable from travel search to ticket purchase."
              override={fromTravelSearchToTicketDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Enable vehicles in map."
              override={vehiclesInMapDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Enable city bike stations in map."
              override={cityBikesInMapDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Enable realtime positions in map."
              override={realtimeMapDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Enable map"
              override={mapDebugOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Enable ticketing assistant"
              override={ticketingAssistantOverride}
            />
          </GenericSectionItem>
          <GenericSectionItem>
            <DebugOverride
              description="Enable tips and information for tickets"
              override={tipsAndInformationOverride}
            />
          </GenericSectionItem>
        </Section>

        <Section withPadding withTopPadding>
          <ExpandableSectionItem
            text={'Trip search parameters'}
            showIconText={true}
            expandContent={
              <View>
                <ThemeText type="body__secondary" color="secondary">
                  Press labels to reset to default
                </ThemeText>
                <LabeledSlider
                  max={50}
                  label="transferPenalty"
                  defaultValue={tripSearchDefaults.transferPenalty}
                  initialValue={tripSearchPreferences?.transferPenalty}
                  step={1}
                  onSetValue={(n: number) => {
                    setPreference({
                      tripSearchPreferences: {
                        ...tripSearchPreferences,
                        transferPenalty: n,
                      },
                    });
                  }}
                />
                <LabeledSlider
                  max={5}
                  label="waitReluctance"
                  defaultValue={tripSearchDefaults.waitReluctance}
                  initialValue={tripSearchPreferences?.waitReluctance}
                  onSetValue={(n: number) => {
                    setPreference({
                      tripSearchPreferences: {
                        ...tripSearchPreferences,
                        waitReluctance: n,
                      },
                    });
                  }}
                />
                <LabeledSlider
                  max={5}
                  label="walkReluctance"
                  defaultValue={tripSearchDefaults.walkReluctance}
                  initialValue={tripSearchPreferences?.walkReluctance}
                  onSetValue={(n: number) => {
                    setPreference({
                      tripSearchPreferences: {
                        ...tripSearchPreferences,
                        walkReluctance: n,
                      },
                    });
                  }}
                />
                <LabeledSlider
                  max={5}
                  label="walkSpeed"
                  defaultValue={tripSearchDefaults.walkSpeed}
                  initialValue={tripSearchPreferences?.walkSpeed}
                  onSetValue={(n: number) => {
                    setPreference({
                      tripSearchPreferences: {
                        ...tripSearchPreferences,
                        walkSpeed: n,
                      },
                    });
                  }}
                />
              </View>
            }
          />
        </Section>

        <Section withPadding withTopPadding>
          <ExpandableSectionItem
            text="Firebase Auth user info"
            showIconText={true}
            expandContent={
              <View>
                {Object.entries(user?.toJSON() ?? {}).map(([key, value]) => (
                  <MapEntry key={key} title={key} value={value} />
                ))}
              </View>
            }
          />
        </Section>

        <Section withPadding withTopPadding>
          <ExpandableSectionItem
            text="Firebase Auth user claims"
            showIconText={true}
            expandContent={
              <View>
                {!!idToken ? (
                  Object.entries(idToken).map(([key, value]) => (
                    <MapEntry key={key} title={key} value={value} />
                  ))
                ) : (
                  <ThemeText>No id token</ThemeText>
                )}
              </View>
            }
          />
        </Section>

        <Section withPadding withTopPadding>
          <ExpandableSectionItem
            text="Remote config"
            showIconText={true}
            expandContent={
              remoteConfig && (
                <View>
                  {Object.keys(remoteConfig).map((key) => (
                    <MapEntry
                      key={key}
                      title={key}
                      value={
                        remoteConfig[key as keyof RemoteConfigContextState]
                      }
                    />
                  ))}
                </View>
              )
            }
          />
        </Section>

        <Section withPadding withTopPadding>
          <ExpandableSectionItem
            text="Storage"
            showIconText={true}
            expandContent={
              <>
                <View>
                  <MapEntry title={'app_group_name'} value={APP_GROUP_NAME} />
                </View>
                {storedValues && (
                  <View>
                    {storedValues.map(([key, value]) => (
                      <MapEntry key={key} title={key} value={value} />
                    ))}
                  </View>
                )}
              </>
            }
          />
        </Section>

        <Section withPadding withTopPadding>
          <ExpandableSectionItem
            text="Preferences"
            showIconText={true}
            expandContent={
              preferences && (
                <View>
                  <ThemeText type="body__secondary">
                    Press a line to reset to undefined {'\n'}
                  </ThemeText>
                  {Object.keys(preferences).map((key) => (
                    <TouchableOpacity
                      key={key}
                      onPress={() => setPreference({[key]: undefined})}
                    >
                      <MapEntry
                        title={key}
                        value={preferences[key as keyof UserPreferences]}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              )
            }
          />
        </Section>

        <Section withPadding withTopPadding>
          <ExpandableSectionItem
            text="Mobile token state"
            showIconText={true}
            expandContent={
              mobileTokenEnabled ? (
                <View>
                  {token && (
                    <View>
                      <ThemeText>{`Token id: ${token.getTokenId()}`}</ThemeText>
                      <ThemeText>{`Token start: ${new Date(
                        token.getValidityStart(),
                      ).toISOString()}`}</ThemeText>
                      <ThemeText>{`Token end: ${new Date(
                        token.getValidityEnd(),
                      ).toISOString()}`}</ThemeText>
                    </View>
                  )}
                  <ThemeText>{`Fallback enabled: ${fallbackEnabled}`}</ThemeText>
                  <ThemeText>{`Is loading: ${isLoading}`}</ThemeText>
                  <ThemeText>{`Is error: ${isError}`}</ThemeText>
                  <Button
                    style={style.button}
                    text="Reload token(s)"
                    onPress={retry}
                  />
                  <Button
                    style={style.button}
                    text="Create token"
                    onPress={createToken}
                  />
                  {token && (
                    <Button
                      style={style.button}
                      text="Wipe token"
                      onPress={wipeToken}
                    />
                  )}
                  {token && (
                    <Button
                      style={style.button}
                      text="Validate token"
                      onPress={validateToken}
                    />
                  )}
                  {token && (
                    <Button
                      style={style.button}
                      text="Renew token"
                      onPress={renewToken}
                    />
                  )}
                  <ExpandableSectionItem
                    text="Remote tokens"
                    showIconText={true}
                    expandContent={remoteTokens?.map((token) => (
                      <View key={token.id} style={style.remoteToken}>
                        {keys(token).map((k) => (
                          <ThemeText key={token.id + k}>
                            {k + ': ' + JSON.stringify(get(token, k))}
                          </ThemeText>
                        ))}
                        <Button
                          onPress={() => removeRemoteToken(token.id)}
                          text="Remove"
                        />
                      </View>
                    ))}
                  />
                </View>
              ) : (
                <ThemeText>Mobile token not enabled</ThemeText>
              )
            }
          />
        </Section>
      </ScrollView>
    </View>
  );
};

function MapValue({value}: {value: any}) {
  if (value === undefined) {
    return <ThemeText>undefined</ThemeText>;
  }

  if (value === null) {
    return <ThemeText>null</ThemeText>;
  }

  const type = typeof value;

  switch (type) {
    case 'string':
      return (
        <ThemeText testID="debugValue" onPress={() => setClipboard(value)}>
          {value}
        </ThemeText>
      );
    case 'object':
      const entries = Object.entries(value);
      return (
        <View style={{flexDirection: 'column'}}>
          {entries.length ? (
            Object.entries(value).map(([key, value]) => (
              <MapEntry key={key} title={key} value={value} />
            ))
          ) : (
            <ThemeText color="secondary">Empty object</ThemeText>
          )}
        </View>
      );
    default:
      const stringified = value.toString();
      return (
        <ThemeText onPress={() => setClipboard(stringified)}>
          {stringified}
        </ThemeText>
      );
  }
}

function MapEntry({title, value}: {title: string; value: any}) {
  const styles = useProfileHomeStyle();
  const isLongString =
    !!value && typeof value === 'string' && value.length > 300;
  const [isExpanded, setIsExpanded] = useState<boolean>(!isLongString);

  if (!!value && typeof value === 'object') {
    return (
      <View key={title} style={styles.objectEntry}>
        <TouchableOpacity
          style={{flexDirection: 'row'}}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <ThemeText type="heading__title" color="secondary">
            {title}
          </ThemeText>
          <ThemeIcon svg={isExpanded ? ExpandLess : ExpandMore} />
        </TouchableOpacity>
        {isExpanded && <MapValue value={value} />}
      </View>
    );
  } else {
    return (
      <View
        key={title}
        style={{flexDirection: 'row', flexWrap: 'wrap'}}
        testID={title === 'user_id' ? 'userId' : ''}
      >
        {isLongString ? (
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={() => setIsExpanded(!isExpanded)}
          >
            <ThemeText type="body__primary--bold">{title}: </ThemeText>
            <ThemeIcon svg={isExpanded ? ExpandLess : ExpandMore} />
          </TouchableOpacity>
        ) : (
          <ThemeText type="body__primary--bold">{title}: </ThemeText>
        )}
        {isExpanded && <MapValue value={value} />}
      </View>
    );
  }
}
//TODO gå inn i mapValue() over og sett testID på verdien av userId -> deretter test på denne i account.e2e.ts
function LabeledSlider({
  label,
  min = 0,
  max,
  step = 0.1,
  defaultValue,
  initialValue,
  onSetValue,
}: {
  label: string;
  min?: number;
  max: number;
  step?: number;
  defaultValue?: number;
  initialValue?: number;
  onSetValue: (n: number) => void;
}): JSX.Element {
  const [pref, setPref] = useState(initialValue || defaultValue);

  return (
    <GenericSectionItem>
      <ThemeText
        onPress={
          defaultValue
            ? () => {
                onSetValue(defaultValue);
                setPref(defaultValue);
              }
            : undefined
        }
      >
        {label}: {pref?.toFixed(1)}
      </ThemeText>
      <Slider
        style={{width: '100%'}}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={pref}
        onValueChange={setPref}
        onSlidingComplete={onSetValue}
      />
    </GenericSectionItem>
  );
}

const useProfileHomeStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.static.background.background_1.background,
    flex: 1,
  },
  icons: {
    flexDirection: 'row',
  },
  buttons: {
    marginHorizontal: theme.spacings.medium,
  },
  button: {
    marginVertical: theme.spacings.small,
  },
  remoteToken: {
    marginBottom: theme.spacings.large,
  },
  objectEntry: {
    flexDirection: 'column',
    marginVertical: 12,
    borderLeftColor: theme.text.colors.secondary,
    borderLeftWidth: 1,
    paddingLeft: 4,
  },
}));
