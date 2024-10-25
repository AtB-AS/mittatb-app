import {MessageInfoBox} from '@atb/components/message-info-box';
import {getReferenceDataName, PreassignedFareProduct} from '@atb/configuration';
import {StyleSheet} from '@atb/theme';
import {
  dictionary,
  getTextForLanguage,
  PurchaseOverviewTexts,
  useTranslation,
} from '@atb/translations';
import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {ProductSelection} from './components/ProductSelection';
import {PurchaseMessages} from './components/PurchaseMessages';
import {StartTimeSelection} from './components/StartTimeSelection';
import {Summary} from './components/Summary';
import {TravellerSelection} from './components/TravellerSelection';
import {useOfferDefaults} from './use-offer-defaults';
import {useOfferState} from './use-offer-state';
import {FlexTicketDiscountInfo} from './components/FlexTicketDiscountInfo';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {useAnalytics} from '@atb/analytics';
import {FromToSelection} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/FromToSelection';
import {GlobalMessage, GlobalMessageContextEnum} from '@atb/global-messages';
import {useFocusRefs} from '@atb/utils/use-focus-refs';
import {isAfter} from '@atb/utils/date';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {FullScreenView} from '@atb/components/screen-view';
import {FareProductHeader} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/components/FareProductHeader';
import {Root_PurchaseConfirmationScreenParams} from '@atb/stacks-hierarchy/Root_PurchaseConfirmationScreen';
import {Section, ToggleSectionItem} from '@atb/components/sections';
import {HoldingHands} from '@atb/assets/svg/color/images';
import {ContentHeading} from '@atb/components/heading';
import {isUserProfileSelectable} from './utils';
import {useAuthState} from '@atb/auth';
import {UserProfileWithCount} from '@atb/fare-contracts';
import {useFeatureToggles} from "@atb/feature-toggles";

type Props = RootStackScreenProps<'Root_PurchaseOverviewScreen'>;

export const Root_PurchaseOverviewScreen: React.FC<Props> = ({
  navigation,
  route: {params},
}) => {
  const styles = useStyles();
  const {t, language} = useTranslation();
  const {authenticationType} = useAuthState();

  const isFree = params.toPlace
    ? 'isFree' in params.toPlace && !!params.toPlace.isFree
    : false;

  const {selection, preassignedFareProductAlternatives} = useOfferDefaults(
    params.preassignedFareProduct,
    params.fareProductTypeConfig,
    params.userProfilesWithCount,
    params.fromPlace,
    params.toPlace,
    params.travelDate,
  );

  const onSelectPreassignedFareProduct = (fp: PreassignedFareProduct) => {
    navigation.setParams({
      preassignedFareProduct: fp,
    });
    if (fp.limitations.latestActivationDate && selection.travelDate) {
      if (
        isAfter(
          selection.travelDate,
          new Date(fp.limitations.latestActivationDate * 1000),
        )
      )
        navigation.setParams({travelDate: undefined});
      else if (showActivationDateWarning) {
        setShowActivationDateWarning(false);
      }
    } else if (showActivationDateWarning) {
      setShowActivationDateWarning(false);
    }
  };

  const setUserProfilesWithCount = useCallback(
    (userProfilesWithCount: UserProfileWithCount[]) => {
      navigation.setParams({userProfilesWithCount});
    },
    [navigation],
  );

  const [isOnBehalfOfToggle, setIsOnBehalfOfToggle] = useState<boolean>(false);

  const [showActivationDateWarning, setShowActivationDateWarning] =
    useState<boolean>(false);
  const analytics = useAnalytics();

  const {
    timeSelectionMode,
    travellerSelectionMode,
    zoneSelectionMode,
    requiresTokenOnMobile,
  } = selection.fareProductTypeConfig.configuration;

  const fareProductOnBehalfOfEnabled =
    selection.fareProductTypeConfig.configuration.onBehalfOfEnabled;

  const offerEndpoint =
    zoneSelectionMode === 'none'
      ? 'authority'
      : zoneSelectionMode === 'multiple-stop-harbor'
      ? 'stop-places'
      : 'zones';

  const {
    isSearchingOffer,
    error,
    originalPrice,
    totalPrice,
    refreshOffer,
    userProfilesWithCountAndOffer,
  } = useOfferState(
    selection,
    offerEndpoint,
    preassignedFareProductAlternatives,
    isOnBehalfOfToggle,
  );

  const preassignedFareProduct =
    preassignedFareProductAlternatives.find(
      (p) => p.id === userProfilesWithCountAndOffer[0]?.offer.fare_product,
    ) ?? preassignedFareProductAlternatives[0];

  const rootPurchaseConfirmationScreenParams: Root_PurchaseConfirmationScreenParams =
    {
      selection: {
        ...selection,
        preassignedFareProduct,
      },
      mode: params.mode,
    };

  const maximumDateObjectIfExisting = selection.preassignedFareProduct.limitations
    ?.latestActivationDate
    ? new Date(selection.preassignedFareProduct.limitations.latestActivationDate * 1000)
    : undefined;

  const canSelectUserProfile = isUserProfileSelectable(
    travellerSelectionMode,
    selection.userProfilesWithCount,
  );

  const isOnBehalfOfEnabled =
      useFeatureToggles().isOnBehalfOfEnabled && fareProductOnBehalfOfEnabled;

  const isLoggedIn = authenticationType === 'phone';

  const isOnBehalfOfAllowed = isOnBehalfOfEnabled && isLoggedIn;

  const hasSelection =
    selection.userProfilesWithCount.some((u) => u.count) &&
    userProfilesWithCountAndOffer.some((u) => u.count);

  const isEmptyOffer = error?.type === 'empty-offers';

  const handleTicketInfoButtonPress = () => {
    const parameters = {
      fareProductTypeConfigType: params.fareProductTypeConfig.type,
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

  return (
    <FullScreenView
      headerProps={{
        title: getTextForLanguage(params.fareProductTypeConfig.name, language),
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
          fareProductTypeConfig={params.fareProductTypeConfig}
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
            (isEmptyOffer ? (
              <MessageInfoBox
                type="info"
                message={t(
                  PurchaseOverviewTexts.errorMessageBox.productUnavailable(
                    getReferenceDataName(preassignedFareProduct, language),
                  ),
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
            preassignedFareProduct={selection.preassignedFareProduct}
            fareProductTypeConfig={params.fareProductTypeConfig}
            setSelectedProduct={onSelectPreassignedFareProduct}
            style={styles.selectionComponent}
          />

          <TravellerSelection
            setUserProfilesWithCount={setUserProfilesWithCount}
            fareProductTypeConfig={selection.fareProductTypeConfig}
            selectionMode={travellerSelectionMode}
            userProfilesWithCount={selection.userProfilesWithCount}
            style={styles.selectionComponent}
            setIsOnBehalfOfToggle={setIsOnBehalfOfToggle}
            isOnBehalfOfToggle={isOnBehalfOfToggle}
          />
          <FromToSelection
            fareProductTypeConfig={params.fareProductTypeConfig}
            fromPlace={selection.fromPlace}
            toPlace={selection.toPlace}
            preassignedFareProduct={selection.preassignedFareProduct}
            style={styles.selectionComponent}
            onSelect={(params) => {
              navigation.setParams({onFocusElement: undefined});
              navigation.push(
                zoneSelectionMode === 'multiple-stop-harbor'
                  ? 'Root_PurchaseHarborSearchScreen'
                  : 'Root_PurchaseTariffZonesSearchByMapScreen',
                params,
              );
            }}
            ref={focusRefs}
          />

          <StartTimeSelection
            selectionMode={timeSelectionMode}
            color="interactive_2"
            travelDate={selection.travelDate}
            setTravelDate={(travelDate) => navigation.setParams({travelDate})}
            validFromTime={selection.travelDate}
            maximumDate={maximumDateObjectIfExisting}
            style={styles.selectionComponent}
            showActivationDateWarning={showActivationDateWarning}
            setShowActivationDateWarning={setShowActivationDateWarning}
          />

          {isOnBehalfOfAllowed && !canSelectUserProfile && (
            <>
              <ContentHeading
                text={t(PurchaseOverviewTexts.onBehalfOf.sectionTitle)}
              />
              <Section>
                <ToggleSectionItem
                  leftImage={<HoldingHands />}
                  text={t(PurchaseOverviewTexts.onBehalfOf.sectionTitle)}
                  subtext={t(PurchaseOverviewTexts.onBehalfOf.sectionSubText)}
                  value={isOnBehalfOfToggle}
                  textType="body__primary--bold"
                  onValueChange={(checked) => {
                    setIsOnBehalfOfToggle(checked);
                  }}
                  testID="onBehalfOfToggle"
                />
              </Section>
            </>
          )}

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
              <PurchaseMessages requiresTokenOnMobile={requiresTokenOnMobile} />
              <GlobalMessage
                globalMessageContext={
                  GlobalMessageContextEnum.appPurchaseOverview
                }
                textColor="background_0"
                ruleVariables={{
                  preassignedFareProductType: preassignedFareProduct.type,
                  fromTariffZone: selection.fromPlace.id,
                  toTariffZone: selection.toPlace.id,
                  userTypes: userTypeStrings,
                }}
              />
            </View>
          )}

          <Summary
            isLoading={isSearchingOffer}
            isFree={isFree}
            isError={!!error || !hasSelection}
            originalPrice={originalPrice}
            price={totalPrice}
            userProfilesWithCount={selection.userProfilesWithCount}
            summaryButtonText={
              isOnBehalfOfToggle
                ? t(PurchaseOverviewTexts.summary.button.sendToOthers)
                : t(PurchaseOverviewTexts.summary.button.payment)
            }
            onPressBuy={() => {
              analytics.logEvent('Ticketing', 'Purchase summary clicked', {
                fareProduct: params.fareProductTypeConfig.name,
                tariffZone: {
                  from: selection.fromPlace.id,
                  to: selection.toPlace.id,
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
            style={styles.summary}
          />
        </View>
      </ScrollView>
    </FullScreenView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  const {bottom} = useSafeAreaInsets();
  return {
    header: {
      marginHorizontal: theme.spacings.medium,
    },
    contentContainer: {
      rowGap: theme.spacings.medium,
      margin: theme.spacings.medium,
      marginBottom: Math.max(bottom, theme.spacings.medium),
    },
    messages: {
      rowGap: theme.spacings.medium,
      marginTop: theme.spacings.medium,
    },
    selectionComponent: {
      rowGap: theme.spacings.medium,
    },
    summary: {
      marginVertical: theme.spacings.medium,
    },
  };
});
