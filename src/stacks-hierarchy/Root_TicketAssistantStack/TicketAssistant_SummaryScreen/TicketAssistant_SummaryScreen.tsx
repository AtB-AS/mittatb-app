import {ScrollView, View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {useTicketAssistantState} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistantContext';
import {themeColor} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_WelcomeScreen';
import {TicketAssistantTexts, useTranslation} from '@atb/translations';
import {Button} from '@atb/components/button';
import {DashboardBackground} from '@atb/assets/svg/color/images';
import SvgFeedback from '@atb/assets/svg/mono-icons/actions/Feedback';
import {TicketAssistantScreenProps} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/navigation-types';
import {TicketSummary} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_SummaryScreen/TicketSummary';
import {getIndexOfLongestDurationTicket} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_SummaryScreen/TicketSummary/utils';
import {useTicketAssistantDataFetch} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_SummaryScreen/fetch-data';

type SummaryProps = TicketAssistantScreenProps<'TicketAssistant_SummaryScreen'>;

export const TicketAssistant_SummaryScreen = ({navigation}: SummaryProps) => {
  const styles = useThemeStyles();
  const {t, language} = useTranslation();

  let {response, data, loading, purchaseDetails} = useTicketAssistantState();

  useTicketAssistantDataFetch(navigation);

  const endDate: string = new Date(
    Date.now() + data.duration * 24 * 60 * 60 * 1000,
  ).toLocaleDateString(language, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  let index = getIndexOfLongestDurationTicket(response.tickets);
  const description = t(
    TicketAssistantTexts.summary.description({
      frequency: data.frequency,
      date: endDate,
    }),
  );

  const doesTicketCoverEntirePeriod =
    response.tickets[index].duration < data.duration &&
    response.tickets[index].duration !== 0;

  const onBuyButtonPress = () => {
    navigation.navigate('Root_PurchaseConfirmationScreen', {
      fareProductTypeConfig:
        purchaseDetails?.purchaseTicketDetails[index].fareProductTypeConfig,
      fromTariffZone: purchaseDetails?.tariffZones[0],
      toTariffZone: purchaseDetails?.tariffZones[1],
      userProfilesWithCount: purchaseDetails?.userProfileWithCount,
      preassignedFareProduct:
        purchaseDetails?.purchaseTicketDetails[index].preassignedFareProduct,
      travelDate: undefined,
      headerLeftButton: {type: 'back'},
      mode: 'Ticket',
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.backdrop}>
        <DashboardBackground width={'100%'} height={'100%'} />
      </View>
      {loading ? (
        // Gif here
        <ThemeText
          type={'body__primary--jumbo--bold'}
          style={styles.header}
          color={themeColor}
          accessibilityLabel={t(TicketAssistantTexts.summary.titleA11yLabel)}
        >
          Loading...
        </ThemeText>
      ) : (
        <View style={styles.mainView}>
          <View>
            <ThemeText
              type={'heading--big'}
              style={styles.header}
              color={themeColor}
              accessibilityLabel={t(
                TicketAssistantTexts.summary.titleA11yLabel,
              )}
            >
              {t(TicketAssistantTexts.summary.title)}
            </ThemeText>
            <ThemeText
              color={themeColor}
              type={'body__primary'}
              style={styles.description}
              accessibilityLabel={description}
            >
              {description}
            </ThemeText>
            {purchaseDetails?.purchaseTicketDetails && (
              <>
                <TicketSummary />
                <Button
                  interactiveColor="interactive_0"
                  onPress={() => onBuyButtonPress()}
                  text={t(TicketAssistantTexts.summary.buyButton)}
                  testID="nextButton"
                  accessibilityHint={t(
                    TicketAssistantTexts.summary.a11yBuyButtonHint,
                  )}
                />
              </>
            )}
            {doesTicketCoverEntirePeriod && (
              <View style={styles.notice}>
                <ThemeText
                  color={themeColor}
                  type={'body__secondary'}
                  style={styles.noticeText}
                  accessibilityLabel={t(
                    TicketAssistantTexts.summary.a11yNoticeLabel,
                  )}
                >
                  {t(TicketAssistantTexts.summary.noticeLabel1)}
                </ThemeText>
              </View>
            )}
          </View>
          <Button
            style={styles.feedback}
            interactiveColor="interactive_0"
            mode="secondary"
            text={t(TicketAssistantTexts.summary.feedback)}
            onPress={() => {
              //TODO
            }}
            rightIcon={{
              svg: SvgFeedback,
            }}
          />
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
    justifyContent: 'space-between',
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
  notice: {
    textAlign: 'center',
    paddingTop: theme.spacings.large,
    color: theme.static.status.info,
  },
  noticeText: {
    textAlign: 'left',
  },
  feedback: {
    marginTop: theme.spacings.large,
  },
}));
