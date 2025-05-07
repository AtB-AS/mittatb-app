import {MessageInfoBox} from '@atb/components/message-info-box';
import {getReferenceDataName} from '@atb/configuration';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  dictionary,
  getTextForLanguage,
  PurchaseOverviewTexts,
  useTranslation,
} from '@atb/translations';
import React, {useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {ProductSelection} from './components/ProductSelection';
import {StartTimeSelection} from './components/StartTimeSelection';
import {Summary} from './components/Summary';
import {TravellerSelection} from './components/TravellerSelection';
import {useOfferState} from './use-offer-state';
import {FlexTicketDiscountInfo} from './components/FlexTicketDiscountInfo';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {useAnalyticsContext} from '@atb/analytics';
import {FromToSelection} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/FromToSelection';
import {
  GlobalMessage,
  GlobalMessageContextEnum,
} from '@atb/modules/global-messages';
import {useFocusRefs} from '@atb/utils/use-focus-refs';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FullScreenView} from '@atb/components/screen-view';
import {FareProductHeader} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/FareProductHeader';
import {Root_PurchaseConfirmationScreenParams} from '@atb/stacks-hierarchy/Root_PurchaseConfirmationScreen';
import {ToggleSectionItem} from '@atb/components/sections';
import {useAuthContext} from '@atb/auth';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useProductAlternatives} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/use-product-alternatives';
import {useOtherDeviceIsInspectableWarning} from '@atb/modules/fare-contracts';
import {useParamAsState} from '@atb/utils/use-param-as-state';
import {
  PurchaseSelectionType,
  useSelectableUserProfiles,
} from '@atb/modules/purchase-selection';
import {ContentHeading} from '@atb/components/heading';
import {isUserProfileSelectable} from './utils';

type Props = RootStackScreenProps<'Root_PurchaseOverviewScreen'>;

export const Root_PurchaseOverviewScreen: React.FC<Props> = ({
  navigation,
  route: {params},
}) => {
  const styles = useStyles();
  const {t, language} = useTranslation();
  const {theme} = useThemeContext();
  const {authenticationType} = useAuthContext();

  const [selection, setSelection] = useParamAsState(params.selection);

  const isFree = params.selection.stopPlaces?.to?.isFree || false;

  const preassignedFareProductAlternatives = useProductAlternatives(selection);
  const selectableUserProfiles = useSelectableUserProfiles(
    selection.preassignedFareProduct,
  );
  const inspectableTokenWarningText = useOtherDeviceIsInspectableWarning();

  const [isOnBehalfOfToggle, setIsOnBehalfOfToggle] = useState<boolean>(false);

  const analytics = useAnalyticsContext();

  const {travellerSelectionMode, zoneSelectionMode} =
    selection.fareProductTypeConfig.configuration;

  const fareProductOnBehalfOfEnabled =
    selection.fareProductTypeConfig.configuration.onBehalfOfEnabled;

  const {
    isSearchingOffer,
    error,
    originalPrice,
    totalPrice,
    refreshOffer,
    userProfilesWithCountAndOffer,
  } = useOfferState(
    selection,
    preassignedFareProductAlternatives,
    isOnBehalfOfToggle,
  );

  const preassignedFareProduct =
    preassignedFareProductAlternatives.find(
      (p) => p.id === userProfilesWithCountAndOffer[0]?.offer.fareProduct,
    ) ?? preassignedFareProductAlternatives[0];

  const rootPurchaseConfirmationScreenParams: Root_PurchaseConfirmationScreenParams =
    {
      selection: {
        ...selection,
        preassignedFareProduct,
      },
      mode: params.mode,
    };

  const canSelectUserProfile = isUserProfileSelectable(
    travellerSelectionMode,
    selectableUserProfiles,
  );

  const isOnBehalfOfEnabled =
    useFeatureTogglesContext().isOnBehalfOfEnabled &&
    fareProductOnBehalfOfEnabled;

  const isLoggedIn = authenticationType === 'phone';

  const isOnBehalfOfAllowed = isOnBehalfOfEnabled && isLoggedIn;

  const hasSelection =
    selection.userProfilesWithCount.some((u) => u.count) &&
    userProfilesWithCountAndOffer.some((u) => u.count);

  const handleTicketInfoButtonPress = () => {
    const parameters = {
      fareProductTypeConfigType: selection.fareProductTypeConfig.type,
      preassignedFareProductId: preassignedFareProduct.id,
    };
    analytics.logEvent(
      'Ticketing',
      'Ticket information button clicked',
      parameters,
    );
    navigation.navigate('Root_TicketInformationScreen', parameters);
  };

  useEffect(() => {
    if (params?.refreshOffer) {
      refreshOffer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.refreshOffer]);

  const closeModal = () => navigation.popToTop();

  const focusRefs = useFocusRefs(params.onFocusElement);

  const userTypeStrings = userProfilesWithCountAndOffer
    .filter((u) => u.count > 0)
    .map((u) => u.userTypeString);

  const shouldShowOnBehalfOf = useShouldShowOnBehalfOf(selection);
  const [isTravelerOnBehalfOfToggle] = useState<boolean>(isOnBehalfOfToggle);

  return (
    <FullScreenView
      headerProps={{
        title: getTextForLanguage(
          selection.fareProductTypeConfig.name,
          language,
        ),
        leftButton: {
          type: 'cancel',
          onPress: closeModal,
        },
        setFocusOnLoad: false,
        globalMessageContext: GlobalMessageContextEnum.appTicketing,
      }}
      parallaxContent={(focusRef) => (
        <FareProductHeader
          ref={params.onFocusElement ? undefined : focusRef}
          style={styles.header}
          fareProductTypeConfig={selection.fareProductTypeConfig}
          preassignedFareProduct={preassignedFareProduct}
          onTicketInfoButtonPress={handleTicketInfoButtonPress}
        />
      )}
    >
      <ScrollView>
        <View style={styles.contentContainer}>
          {params.mode === 'TravelSearch' && (
            <MessageInfoBox
              type="valid"
              message={t(PurchaseOverviewTexts.travelSearchInfo)}
            />
          )}
          {error &&
            (error.type === 'not-available' ? (
              <MessageInfoBox
                type="warning"
                title={t(
                  PurchaseOverviewTexts.errorMessageBox.productUnavailable.title(
                    getReferenceDataName(preassignedFareProduct, language),
                  ),
                )}
                message={t(
                  PurchaseOverviewTexts.errorMessageBox.productUnavailable
                    .message,
                )}
                style={styles.selectionComponent}
              />
            ) : (
              <MessageInfoBox
                type="error"
                title={t(PurchaseOverviewTexts.errorMessageBox.title)}
                message={t(PurchaseOverviewTexts.errorMessageBox.message)}
                onPressConfig={{
                  action: refreshOffer,
                  text: t(dictionary.retry),
                }}
                style={styles.selectionComponent}
              />
            ))}

          <ProductSelection
            selection={selection}
            setSelection={setSelection}
            style={styles.selectionComponent}
          />

          <TravellerSelection
            selection={selection}
            onSave={(selection) => {
              setSelection(selection);
            }}
            style={styles.selectionComponent}
          />

          {shouldShowOnBehalfOf && (
            <View style={styles.selectionComponent}>
              {isOnBehalfOfAllowed && !canSelectUserProfile && (
                <ContentHeading
                  text={t(PurchaseOverviewTexts.onBehalfOf.sectionTitle)}
                />
              )}
              <ToggleSectionItem
                text={t(PurchaseOverviewTexts.onBehalfOf.sendToOthersText)}
                value={isTravelerOnBehalfOfToggle}
                onValueChange={setIsOnBehalfOfToggle}
                testID="onBehalfOfToggle"
                type="slim"
                radiusSize="regular"
                radius="top-bottom"
              />
            </View>
          )}

          <FromToSelection
            selection={selection}
            style={styles.selectionComponent}
            onSelect={(selection) => {
              navigation.setParams({onFocusElement: undefined});
              navigation.push(
                zoneSelectionMode === 'multiple-stop-harbor'
                  ? 'Root_PurchaseHarborSearchScreen'
                  : 'Root_PurchaseTariffZonesSearchByMapScreen',
                {selection},
              );
            }}
            ref={focusRefs}
          />

          <StartTimeSelection
            selection={selection}
            setSelection={setSelection}
            style={styles.selectionComponent}
          />

          <FlexTicketDiscountInfo
            userProfiles={userProfilesWithCountAndOffer}
            style={styles.selectionComponent}
          />

          {isFree ? (
            <MessageInfoBox
              type="valid"
              message={t(PurchaseOverviewTexts.summary.free)}
              style={styles.messages}
            />
          ) : (
            <View style={styles.messages}>
              {inspectableTokenWarningText && (
                <MessageInfoBox
                  type="warning"
                  message={inspectableTokenWarningText}
                  isMarkdown={true}
                />
              )}
              <GlobalMessage
                globalMessageContext={
                  GlobalMessageContextEnum.appPurchaseOverview
                }
                textColor={theme.color.background.neutral[0]}
                ruleVariables={{
                  preassignedFareProductType: preassignedFareProduct.type,
                  fromTariffZone: selection.zones?.from.id || 'none',
                  toTariffZone: selection.zones?.to.id || 'none',
                  userTypes: userTypeStrings,
                }}
              />
            </View>
          )}

          <Summary
            selection={selection}
            isLoading={isSearchingOffer}
            isFree={isFree}
            isError={!!error || !hasSelection}
            originalPrice={originalPrice}
            price={totalPrice}
            summaryButtonText={
              isOnBehalfOfToggle
                ? t(PurchaseOverviewTexts.summary.button.sendToOthers)
                : t(PurchaseOverviewTexts.summary.button.payment)
            }
            onPressBuy={() => {
              analytics.logEvent('Ticketing', 'Purchase summary clicked', {
                fareProduct: selection.fareProductTypeConfig.name,
                tariffZone: {
                  from: selection.zones?.from.id,
                  to: selection.zones?.to.id,
                },
                stopPlaces: {
                  from: selection.stopPlaces?.from?.id,
                  to: selection.stopPlaces?.to?.id,
                },
                userProfilesWithCount: selection.userProfilesWithCount.map(
                  (t) => ({
                    userType: t.userTypeString,
                    count: t.count,
                  }),
                ),
                preassignedFareProduct: {
                  id: selection.preassignedFareProduct.id,
                  name: selection.preassignedFareProduct.name.value,
                },
                travelDate: selection.travelDate,
                mode: params.mode,
              });
              isOnBehalfOfToggle
                ? navigation.navigate(
                    'Root_ChooseTicketRecipientScreen',
                    rootPurchaseConfirmationScreenParams,
                  )
                : navigation.navigate(
                    'Root_PurchaseConfirmationScreen',
                    rootPurchaseConfirmationScreenParams,
                  );
            }}
          />
        </View>
      </ScrollView>
    </FullScreenView>
  );
};

const useShouldShowOnBehalfOf = (selection: PurchaseSelectionType) => {
  const isOnBehalfOfEnabled =
    useFeatureTogglesContext().isOnBehalfOfEnabled &&
    selection.fareProductTypeConfig.configuration.onBehalfOfEnabled;
  const isLoggedIn = useAuthContext().authenticationType === 'phone';
  return isOnBehalfOfEnabled && isLoggedIn;
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  const {bottom} = useSafeAreaInsets();
  return {
    header: {
      marginHorizontal: theme.spacing.medium,
    },
    contentContainer: {
      rowGap: theme.spacing.medium,
      margin: theme.spacing.medium,
      marginBottom: Math.max(bottom, theme.spacing.medium),
    },
    messages: {
      rowGap: theme.spacing.medium,
      marginTop: theme.spacing.medium,
    },
    selectionComponent: {
      rowGap: theme.spacing.medium,
    },
  };
});
