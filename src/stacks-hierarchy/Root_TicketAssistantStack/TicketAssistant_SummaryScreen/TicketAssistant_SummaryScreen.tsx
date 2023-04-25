import {ActivityIndicator, ScrollView, View} from 'react-native';
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
import {useTicketAssistantDataFetch} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_SummaryScreen/fetch-data';
import {ThemeIcon} from '@atb/components/theme-icon';
import SvgInfo from '@atb/assets/svg/color/icons/status/Info';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {ContactSheet} from '@atb/chat/ContactSheet';
import {getIndexOfLongestDurationTicket} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_SummaryScreen/TicketSummary/utils';

type SummaryProps = TicketAssistantScreenProps<'TicketAssistant_SummaryScreen'>;

export const TicketAssistant_SummaryScreen = ({navigation}: SummaryProps) => {
  const styles = useThemeStyles();
  const {t, language} = useTranslation();
  const {open: openBottomSheet} = useBottomSheet();

  const openContactSheet = () => {
    openBottomSheet((close, focusRef) => (
      <ContactSheet close={close} ref={focusRef} />
    ));
  };

  let {response, data, hasDataChanged, purchaseDetails, error} =
    useTicketAssistantState();

  useTicketAssistantDataFetch(navigation);

  const durationDays = data.duration * 24 * 60 * 60 * 1000;

  const endDate: string = new Date(
    Date.now() + durationDays,
  ).toLocaleDateString(language, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const description = t(
    TicketAssistantTexts.summary.description({
      frequency: data.frequency,
      date: endDate,
    }),
  );
  let index = response ? getIndexOfLongestDurationTicket(response.tickets) : 0;

  const ticket = response?.tickets[index];

  const doesTicketCoverEntirePeriod = ticket
    ? ticket.duration < data.duration && ticket.duration !== 0
    : false;

  const onBuyButtonPress = () => {
    if (!purchaseDetails?.purchaseTicketDetails) return;
    navigation.navigate('Root_PurchaseConfirmationScreen', {
      fareProductTypeConfig:
        purchaseDetails.purchaseTicketDetails[index].fareProductTypeConfig,
      fromTariffZone: purchaseDetails.tariffZones[0],
      toTariffZone: purchaseDetails.tariffZones[1],
      userProfilesWithCount: purchaseDetails.userProfileWithCount,
      preassignedFareProduct:
        purchaseDetails.purchaseTicketDetails[index].preassignedFareProduct,
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
      {hasDataChanged ? (
        <View style={styles.loadingSpinner}>
          <ActivityIndicator animating={true} size="large" />
        </View>
      ) : error ? (
        <View style={styles.mainView}>
          <ThemeText
            type={'heading--big'}
            color={themeColor}
            style={styles.header}
          >
            {t(TicketAssistantTexts.summary.crashedHeader)}
          </ThemeText>
          <ThemeText
            type={'body__primary'}
            color={themeColor}
            style={styles.description}
          >
            {t(TicketAssistantTexts.summary.crashedDescription)}
          </ThemeText>
        </View>
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
                  onPress={onBuyButtonPress}
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
                <ThemeIcon style={styles.icon} svg={SvgInfo} />
                <ThemeText
                  style={styles.noticeText}
                  type={'body__tertiary'}
                  color={themeColor}
                  accessibilityLabel={t(
                    TicketAssistantTexts.summary.a11yDurationNoticeLabel,
                  )}
                >
                  {t(TicketAssistantTexts.summary.durationNotice)}
                </ThemeText>
              </View>
            )}
          </View>
          <Button
            style={styles.feedback}
            interactiveColor="interactive_0"
            mode="secondary"
            text={t(TicketAssistantTexts.summary.feedback)}
            onPress={() => openContactSheet()}
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
    marginTop: theme.spacings.medium,
    marginBottom: theme.spacings.large,
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
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacings.large,
  },
  noticeText: {
    textAlign: 'center',
    flexShrink: 1,
  },
  feedback: {
    marginTop: theme.spacings.large,
  },
  icon: {
    marginRight: theme.spacings.small,
  },
  loadingSpinner: {
    flex: 1,
    justifyContent: 'center',
  },
}));
