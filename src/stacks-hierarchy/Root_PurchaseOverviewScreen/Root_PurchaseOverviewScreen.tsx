import {MessageInfoBox} from '@atb/components/message-info-box';
import {getReferenceDataName, PreassignedFareProduct} from '@atb/configuration';
import {StyleSheet} from '@atb/theme';
import {
  dictionary,
  getTextForLanguage,
  PurchaseOverviewTexts,
  useTranslation,
} from '@atb/translations';
import React, {useEffect, useState} from 'react';
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

type Props = RootStackScreenProps<'Root_PurchaseOverviewScreen'>;

export const Root_PurchaseOverviewScreen: React.FC<Props> = ({
  navigation,
  route: {params},
}) => {
  const styles = useStyles();
  const {t, language} = useTranslation();
  const isFree = params.toPlace
    ? 'isFree' in params.toPlace && !!params.toPlace.isFree
    : false;

  const {preassignedFareProduct, selectableTravellers, fromPlace, toPlace} =
    useOfferDefaults(
      params.preassignedFareProduct,
      params.fareProductTypeConfig.type,
      params.userProfilesWithCount,
      params.fromPlace,
      params.toPlace,
    );

  const onSelectPreassignedFareProduct = (fp: PreassignedFareProduct) => {
    navigation.setParams({
      preassignedFareProduct: fp,
    });
    if (fp.limitations.latestActivationDate && travelDate) {
      if (
        isAfter(
          travelDate,
          new Date(fp.limitations.latestActivationDate * 1000),
        )
      )
        setTravelDate(undefined);
      else if (showActivationDateWarning) {
        setShowActivationDateWarning(false);
      }
    } else if (showActivationDateWarning) {
      setShowActivationDateWarning(false);
    }
  };
  const [travellerSelection, setTravellerSelection] =
    useState(selectableTravellers);

  const [isOnBehalfOfToggle, setIsOnBehalfOfToggle] = useState<boolean>(false);

  const [travelDate, setTravelDate] = useState<string | undefined>(
    params.travelDate,
  );
  const [showActivationDateWarning, setShowActivationDateWarning] =
    useState<boolean>(false);
  const analytics = useAnalytics();

  const {
    timeSelectionMode,
    travellerSelectionMode,
    zoneSelectionMode,
    requiresTokenOnMobile,
  } = params.fareProductTypeConfig.configuration;

  const offerEndpoint =
    zoneSelectionMode === 'none'
      ? 'authority'
      : zoneSelectionMode === 'multiple-stop-harbor'
      ? 'stop-places'
      : 'zones';

  const {
    isSearchingOffer,
    error,
    totalPrice,
    refreshOffer,
    userProfilesWithCountAndOffer,
  } = useOfferState(
    offerEndpoint,
    preassignedFareProduct,
    fromPlace,
    toPlace,
    travellerSelection,
    travelDate,
  );

  const maximumDateObjectIfExisting = preassignedFareProduct.limitations
    ?.latestActivationDate
    ? new Date(preassignedFareProduct.limitations.latestActivationDate * 1000)
    : undefined;

  const hasSelection =
    travellerSelection.some((u) => u.count) &&
    userProfilesWithCountAndOffer.some((u) => u.count);

  const isEmptyOffer = error?.type === 'empty-offers';

  const handleTicketInfoButtonPress = () => {
    const parameters = {
      fareProductTypeConfigType: params.fareProductTypeConfig.type,
      preassignedFareProductId: preassignedFareProduct?.id,
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
      parallaxContent={(focusRef?: React.MutableRefObject<null>) => (
        <FareProductHeader
          ref={params.onFocusElement ? undefined : focusRef}
          style={styles.header}
          fareProductTypeConfig={params.fareProductTypeConfig}
          preassignedFareProduct={preassignedFareProduct}
          onTicketInfoButtonPress={handleTicketInfoButtonPress}
        />
      )}
    >
      <ScrollView testID="ticketingScrollView">
        <View style={styles.contentContainer}>
          {params.mode === 'TravelSearch' && (
            <MessageInfoBox
              style={styles.travelSearchInfo}
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
            preassignedFareProduct={preassignedFareProduct}
            fareProductTypeConfig={params.fareProductTypeConfig}
            setSelectedProduct={onSelectPreassignedFareProduct}
            style={styles.selectionComponent}
          />

          <TravellerSelection
            setTravellerSelection={setTravellerSelection}
            fareProductType={preassignedFareProduct.type}
            selectionMode={travellerSelectionMode}
            selectableUserProfiles={selectableTravellers}
            style={styles.selectionComponent}
            setIsOnBehalfOfToggle={setIsOnBehalfOfToggle}
            isOnBehalfOfToggle={isOnBehalfOfToggle}
          />
          <FromToSelection
            fareProductTypeConfig={params.fareProductTypeConfig}
            fromPlace={fromPlace}
            toPlace={toPlace}
            preassignedFareProduct={preassignedFareProduct}
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
            travelDate={travelDate}
            setTravelDate={setTravelDate}
            validFromTime={travelDate}
            maximumDate={maximumDateObjectIfExisting}
            style={styles.selectionComponent}
            showActivationDateWarning={showActivationDateWarning}
            setShowActivationDateWarning={setShowActivationDateWarning}
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
              <PurchaseMessages requiresTokenOnMobile={requiresTokenOnMobile} />
              <GlobalMessage
                globalMessageContext={
                  GlobalMessageContextEnum.appPurchaseOverview
                }
                textColor="background_0"
                ruleVariables={{
                  preassignedFareProductType: preassignedFareProduct.type,
                  fromTariffZone: fromPlace.id,
                  toTariffZone: toPlace.id,
                }}
              />
            </View>
          )}

          <Summary
            isLoading={isSearchingOffer}
            isFree={isFree}
            isError={!!error || !hasSelection}
            price={totalPrice}
            userProfilesWithCount={travellerSelection}
            onPressBuy={() => {
              analytics.logEvent('Ticketing', 'Purchase summary clicked', {
                fareProduct: params.fareProductTypeConfig.name,
                tariffZone: {from: fromPlace.id, to: toPlace.id},
                userProfilesWithCount: travellerSelection.map((t) => ({
                  userType: t.userTypeString,
                  count: t.count,
                })),
                preassignedFareProduct: {
                  id: preassignedFareProduct.id,
                  name: preassignedFareProduct.name.value,
                },
                travelDate,
                mode: params.mode,
              });
              isOnBehalfOfToggle ?
                navigation.navigate('Root_ChooseTicketReceiverScreen', {
                  fareProductTypeConfig: params.fareProductTypeConfig,
                  fromPlace: fromPlace,
                  toPlace: toPlace,
                  userProfilesWithCount: travellerSelection,
                  preassignedFareProduct,
                  travelDate,
                  headerLeftButton: {type: 'back'},
                  mode: params.mode,
                }) :
                navigation.navigate('Root_PurchaseConfirmationScreen', {
                  fareProductTypeConfig: params.fareProductTypeConfig,
                  fromPlace: fromPlace,
                  toPlace: toPlace,
                  userProfilesWithCount: travellerSelection,
                  preassignedFareProduct,
                  travelDate,
                  headerLeftButton: {type: 'back'},
                  mode: params.mode,
                });
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
    travelSearchInfo: {
      marginHorizontal: theme.spacings.medium,
      marginTop: theme.spacings.xLarge,
      marginBottom: theme.spacings.medium,
    },
  };
});
