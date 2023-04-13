import {Image, ScrollView, View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import React, {useContext, useEffect} from 'react';
import TicketAssistantContext from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistantContext';
import {themeColor} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_WelcomeScreen';
import {TicketAssistantTexts, useTranslation} from '@atb/translations';
import {Button} from '@atb/components/button';
import {DashboardBackground} from '@atb/assets/svg/color/images';
import {TicketAssistantScreenProps} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/navigation-types';
import {TicketSummary} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/components/TicketSummary';
import {handleData} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/purchaseDetails';
import {useFirestoreConfiguration} from '@atb/configuration';

type SummaryProps = TicketAssistantScreenProps<'TicketAssistant_SummaryScreen'>;

export const TicketAssistant_SummaryScreen = ({navigation}: SummaryProps) => {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  const {
    tariffZones,
    userProfiles,
    preassignedFareProducts,
    fareProductTypeConfigs,
  } = useFirestoreConfiguration();

  const contextValue = useContext(TicketAssistantContext);

  if (!contextValue) throw new Error('Context is undefined!');

  let {
    response,
    data,
    loading,
    purchaseDetails,
    setPurchaseDetails,
    setActiveTicket,
  } = contextValue;
  setActiveTicket(0);

  useEffect(() => {
    const updatePurchaseDetails = () => {
      console.log('updatePurchaseDetails');
      setPurchaseDetails(
        handleData(
          response,
          tariffZones,
          userProfiles,
          preassignedFareProducts,
          fareProductTypeConfigs,
        ),
      );
    };
    updatePurchaseDetails();
  }, [response]);

  const startDate = new Date();
  const endDate: string = new Date(
    startDate.getTime() + data.duration * 24 * 60 * 60 * 1000,
  ).toLocaleDateString('nb-NO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.backdrop}>
        <DashboardBackground
          width={'100%'}
          height={'100%'}
          fill={'#AAE6EC'}
          fillOpacity={1}
        />
      </View>
      {loading ? (
        // Gif here
        <Image source={require('@atb/assets/images/loading/Bus.gif')} />
      ) : (
        <View style={styles.mainView}>
          <ThemeText
            type={'body__primary--jumbo--bold'}
            style={styles.header}
            color={themeColor}
            accessibilityLabel={t(TicketAssistantTexts.welcome.titleA11yLabel)}
          >
            {t(TicketAssistantTexts.summary.title)}
          </ThemeText>
          <ThemeText
            color={themeColor}
            type={'body__primary--big'}
            style={styles.description}
          >
            {t(
              TicketAssistantTexts.summary.description({
                frequency: data.frequency,
                date: endDate,
              }),
            )}
          </ThemeText>
          {purchaseDetails?.purchaseTicketDetails && (
            <>
              <TicketSummary
                duration={data.duration}
                frequency={data.frequency}
              />
              <Button
                interactiveColor="interactive_0"
                onPress={() => {
                  {
                    /** Navigate to PurchaseConfirmationScreen **/
                    navigation.navigate('Root_PurchaseConfirmationScreen', {
                      fareProductTypeConfig:
                        purchaseDetails?.purchaseTicketDetails[0]
                          .fareProductTypeConfig,
                      fromTariffZone: purchaseDetails?.tariffZones[0],
                      toTariffZone: purchaseDetails?.tariffZones[1],
                      userProfilesWithCount:
                        purchaseDetails?.userProfileWithCount,
                      preassignedFareProduct:
                        purchaseDetails?.purchaseTicketDetails[0]
                          .preassignedFareProduct,
                      travelDate: undefined,
                      headerLeftButton: {type: 'back'},
                      mode: 'Ticket',
                    });
                  }
                }}
                text={t(TicketAssistantTexts.summary.buyButton)}
                testID="nextButton"
              />
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  contentContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: theme.static.background[themeColor].background,
    width: '100%',
  },
  mainView: {
    flex: 1,
    paddingHorizontal: theme.spacings.large,
    paddingBottom: theme.spacings.xLarge,
    width: '100%',
  },
  bottomView: {
    paddingHorizontal: theme.spacings.xLarge,
    paddingBottom: theme.spacings.xLarge,
  },
  header: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    paddingHorizontal: theme.spacings.xLarge,
    paddingTop: theme.spacings.small,
    paddingBottom: theme.spacings.xLarge,
  },
  savingsText: {
    textAlign: 'center',
    paddingHorizontal: theme.spacings.xLarge,
    paddingVertical: theme.spacings.xLarge,
  },
  backdrop: {
    position: 'absolute',
    height: 250,
    left: 0,
    right: 0,
    top: 90,
    padding: 0,
    margin: 0,
  },
}));
