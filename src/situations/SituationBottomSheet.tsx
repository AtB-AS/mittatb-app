import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {
  dictionary,
  getTextForLanguage,
  ScreenHeaderTexts,
  SituationsTexts,
  useTranslation,
} from '@atb/translations';
import {ScrollView} from 'react-native-gesture-handler';
import {ThemeText} from '@atb/components/text';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {Button} from '@atb/components/button';
import React, {forwardRef} from 'react';
import {Linking, TouchableOpacity, View} from 'react-native';
import {InfoLinkFragment} from '@atb/api/types/generated/fragments/shared';
import {StyleSheet} from '@atb/theme';
import {SituationType} from './types';
import * as Sections from '@atb/components/sections';
import {SituationOrNoticeIcon} from './SituationOrNoticeIcon';
import {daysBetween, formatToLongDateTime} from '@atb/utils/date';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Time} from '@atb/assets/svg/mono-icons/time';
import {screenReaderPause} from '@atb/components/text';

type Props = {
  situation: SituationType;
  close: () => void;
};

export const SituationBottomSheet = forwardRef<View, Props>(
  ({situation, close}, focusRef) => {
    const {t, language} = useTranslation();
    const styles = useStyles();
    const summary = getTextForLanguage(situation.summary, language);
    const description = getTextForLanguage(situation.description, language);
    const advice = getTextForLanguage(situation.advice, language);
    const infoLinks = filterInfoLinks(situation.infoLinks);
    const validityPeriodText = useValidityPeriodText(situation.validityPeriod);

    return (
      <BottomSheetContainer>
        <ScreenHeaderWithoutNavigation
          leftButton={{
            type: 'close',
            onPress: close,
            text: t(ScreenHeaderTexts.headerButton.close.text),
            testID: 'closeButton',
          }}
          color="background_1"
          setFocusOnLoad={false}
        />

        <ScrollView centerContent={true}>
          <View>
            <Sections.Section style={styles.section}>
              <Sections.GenericItem type="spacious">
                <View
                  accessibilityLabel={[summary, description, advice].join(
                    screenReaderPause,
                  )}
                  ref={focusRef}
                  accessible={true}
                  style={styles.textContainer}
                >
                  <View style={styles.summaryContainer}>
                    <SituationOrNoticeIcon
                      situation={situation}
                      style={styles.summaryIcon}
                    />
                    <ThemeText type="heading__title" style={styles.summaryText}>
                      {summary || description}
                    </ThemeText>
                  </View>
                  {description && summary && (
                    <ThemeText style={styles.description}>
                      {description}
                    </ThemeText>
                  )}
                  {advice && (
                    <ThemeText style={styles.advice}>{advice}</ThemeText>
                  )}
                </View>
                {infoLinks?.length ? (
                  <View style={styles.infoLinksContainer}>
                    {infoLinks.map((il) => (
                      <InfoLink key={il.uri} infoLink={il} />
                    ))}
                  </View>
                ) : null}
                {validityPeriodText && (
                  <View style={styles.validityContainer}>
                    <ThemeIcon
                      svg={Time}
                      colorType={'secondary'}
                      style={styles.validityIcon}
                    />
                    <ThemeText
                      type="body__secondary"
                      color="secondary"
                      style={styles.validityText}
                    >
                      {validityPeriodText}
                    </ThemeText>
                  </View>
                )}
              </Sections.GenericItem>
            </Sections.Section>
          </View>
        </ScrollView>
        <FullScreenFooter>
          <Button
            style={styles.button}
            onPress={close}
            interactiveColor="interactive_0"
            text={t(SituationsTexts.bottomSheet.button)}
            testID="closeButton"
          />
        </FullScreenFooter>
      </BottomSheetContainer>
    );
  },
);

const filterInfoLinks = (
  infoLinks?: Partial<InfoLinkFragment>[],
): InfoLinkFragment[] =>
  infoLinks?.filter(
    (il: Partial<InfoLinkFragment>): il is InfoLinkFragment => !!il.uri,
  ) || [];

const useValidityPeriodText = (period?: SituationType['validityPeriod']) => {
  const {t, language} = useTranslation();

  const endTime = validateEndTime(period?.endTime);
  if (period?.startTime && endTime) {
    return t(
      SituationsTexts.bottomSheet.validity.fromAndTo(
        formatToLongDateTime(period.startTime, language),
        formatToLongDateTime(endTime, language),
      ),
    );
  }
  if (period?.startTime) {
    return t(
      SituationsTexts.bottomSheet.validity.from(
        formatToLongDateTime(period.startTime, language),
      ),
    );
  }
  if (endTime) {
    return t(
      SituationsTexts.bottomSheet.validity.to(
        formatToLongDateTime(endTime, language),
      ),
    );
  }

  return undefined;
};

/**
 * If end time is further ahead than 1 year, than return undefined. This is
 * because some companies set an end time really far ahead (2050, 9999 etc.)
 * when they don't know when the situation message will end.
 */
const validateEndTime = (endTime?: string) =>
  endTime && daysBetween(new Date(), endTime) <= 365 ? endTime : undefined;

const InfoLink = ({infoLink}: {infoLink: InfoLinkFragment}) => {
  const {t} = useTranslation();
  const styles = useStyles();

  return (
    <TouchableOpacity
      onPress={() => Linking.openURL(infoLink.uri)}
      accessibilityRole="link"
      style={styles.infoLink}
    >
      <ThemeText type="body__primary--underline" color="secondary">
        {infoLink.label || t(dictionary.readMore)}
      </ThemeText>
    </TouchableOpacity>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  section: {paddingHorizontal: theme.spacings.medium},
  textContainer: {flex: 1},
  summaryContainer: {flexDirection: 'row'},
  summaryIcon: {marginRight: theme.spacings.small},
  summaryText: {flex: 1},
  description: {marginTop: theme.spacings.medium},
  advice: {marginTop: theme.spacings.medium},
  infoLinksContainer: {marginTop: theme.spacings.medium, flexDirection: 'row'},
  infoLink: {marginRight: theme.spacings.medium},
  validityContainer: {flexDirection: 'row', marginTop: theme.spacings.medium},
  validityIcon: {marginRight: theme.spacings.small},
  validityText: {flex: 1},
  button: {marginTop: theme.spacings.medium},
}));
