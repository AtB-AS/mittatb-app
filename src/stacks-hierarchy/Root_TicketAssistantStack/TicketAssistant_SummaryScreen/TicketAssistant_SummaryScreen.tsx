import {ActivityIndicator, ScrollView, View} from 'react-native';
import {StyleSheet, useTheme} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {useTicketAssistantState} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistantContext';
import {
  getInteractiveColor,
  getThemeColor,
} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_WelcomeScreen';
import {TicketAssistantTexts, useTranslation} from '@atb/translations';
import {Button} from '@atb/components/button';
import {DashboardBackground} from '@atb/assets/svg/color/images';
import {TicketAssistantScreenProps} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/navigation-types';
import {TicketSummary} from '@atb/stacks-hierarchy/Root_TicketAssistantStack/TicketAssistant_SummaryScreen/TicketSummary';
import {useAuthState} from '@atb/auth';
import {Root_PurchaseConfirmationScreenParams} from '@atb/stacks-hierarchy/Root_PurchaseConfirmationScreen';
import {useAnalytics} from '@atb/analytics';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';

type SummaryProps = TicketAssistantScreenProps<'TicketAssistant_SummaryScreen'>;

export const TicketAssistant_SummaryScreen = ({navigation}: SummaryProps) => {
  const styles = useThemeStyles();
  const {t, language} = useTranslation();
  const {theme} = useTheme();
  const themeColor = getThemeColor(theme);
  const interactiveColor = getInteractiveColor(theme);
  const {authenticationType} = useAuthState();
  const analytics = useAnalytics();
  const {loading, inputParams, recommendedTicketSummary, error} =
    useTicketAssistantState();
  const focusRef = useFocusOnLoad();
  const durationDays = inputParams.duration
    ? inputParams.duration * 24 * 60 * 60 * 1000
    : 0;

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
      frequency: inputParams.frequency ?? 0,
      date: endDate,
    }),
  );

  const doesTicketCoverEntirePeriod =
    recommendedTicketSummary && inputParams.duration
      ? recommendedTicketSummary.ticket.duration < inputParams.duration &&
        recommendedTicketSummary.ticket.duration !== 0
      : false;

  const onBuyButtonPress = () => {
    analytics.logEvent('Ticket assistant', 'Clicked buy recommended ticket');
    if (!recommendedTicketSummary) return;
    const purchaseConfirmationScreenParams: Root_PurchaseConfirmationScreenParams =
      {
        selection: {
          fareProductTypeConfig: recommendedTicketSummary.fareProductTypeConfig,
          fromPlace: recommendedTicketSummary.tariffZones[0],
          toPlace: recommendedTicketSummary.tariffZones[1],
          userProfilesWithCount: recommendedTicketSummary.userProfileWithCount,
          preassignedFareProduct:
            recommendedTicketSummary.preassignedFareProduct,
          travelDate: undefined,
        },
        mode: 'Ticket',
      };
    const {fareProductTypeConfig} = recommendedTicketSummary;
    if (
      fareProductTypeConfig.configuration.requiresLogin &&
      authenticationType !== 'phone'
    ) {
      navigation.navigate('Root_LoginRequiredForFareProductScreen', {
        fareProductTypeConfig,
      });
    } else {
      navigation.navigate(
        'Root_PurchaseConfirmationScreen',
        purchaseConfirmationScreenParams,
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.backdrop}>
        <DashboardBackground width="100%" height="100%" />
      </View>
      <View style={styles.mainView}>
        {error ? (
          <View ref={focusRef} accessible={true}>
            <ThemeText
              type="heading--big"
              color={themeColor}
              style={styles.header}
            >
              {t(TicketAssistantTexts.summary.crashedHeader)}
            </ThemeText>
            <ThemeText
              type="body__primary"
              color={themeColor}
              style={styles.description}
            >
              {t(TicketAssistantTexts.summary.crashedDescription)}
            </ThemeText>
          </View>
        ) : loading ? (
          <View style={styles.loadingSpinner}>
            <ActivityIndicator animating={true} size="large" />
          </View>
        ) : (
          <View>
            <View ref={focusRef} accessible={true}>
              <ThemeText
                type="heading--big"
                style={styles.header}
                color={themeColor}
                accessibilityRole="header"
                accessibilityLabel={t(
                  TicketAssistantTexts.summary.titleA11yLabel,
                )}
              >
                {t(TicketAssistantTexts.summary.title)}
              </ThemeText>

              <ThemeText
                color={themeColor}
                type="body__primary"
                style={styles.description}
                accessibilityLabel={description}
              >
                {description}
              </ThemeText>
            </View>

            <TicketSummary />
            {doesTicketCoverEntirePeriod && (
              <MessageInfoBox
                style={styles.infoBox}
                type="info"
                title={t(TicketAssistantTexts.summary.durationNotice.title)}
                message={t(
                  TicketAssistantTexts.summary.durationNotice.description,
                )}
              />
            )}
            <Button
              interactiveColor={interactiveColor}
              onPress={onBuyButtonPress}
              text={t(TicketAssistantTexts.summary.buyButton)}
              testID="nextButton"
              accessibilityHint={t(
                TicketAssistantTexts.summary.a11yBuyButtonHint,
              )}
            />
          </View>
        )}
        {(error || !loading) && (
          <Button
            style={styles.feedback}
            backgroundColor={themeColor}
            mode="secondary"
            text={t(TicketAssistantTexts.closeButton)}
            onPress={() => {
              analytics.logEvent(
                'Ticket assistant',
                'Closed from summary screen',
              );
              navigation.popToTop();
            }}
          />
        )}
      </View>
    </ScrollView>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  contentContainer: {
    flexGrow: 1,
  },
  infoBox: {
    marginBottom: theme.spacing.large,
  },
  container: {
    flex: 1,
    backgroundColor: getThemeColor(theme).background,
    width: '100%',
  },
  mainView: {
    flex: 1,
    paddingHorizontal: theme.spacing.large,
    paddingBottom: theme.spacing.xLarge,
    width: '100%',
    justifyContent: 'space-between',
  },
  bottomView: {
    paddingHorizontal: theme.spacing.xLarge,
    paddingBottom: theme.spacing.xLarge,
  },
  header: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xLarge,
    marginTop: theme.spacing.medium,
    marginBottom: theme.spacing.large,
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
    marginTop: theme.spacing.large,
  },
  noticeText: {
    textAlign: 'center',
    flexShrink: 1,
  },
  feedback: {
    marginTop: theme.spacing.large,
  },
  icon: {
    marginRight: theme.spacing.small,
  },
  loadingSpinner: {
    flex: 1,
    justifyContent: 'center',
  },
}));
