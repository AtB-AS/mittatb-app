import {
  BottomSheetContainer,
  useBottomSheetContext,
} from '@atb/components/bottom-sheet';
import {
  dictionary,
  getTextForLanguage,
  SituationsTexts,
  useTranslation,
} from '@atb/translations';
import {ScrollView} from 'react-native-gesture-handler';
import {ThemeText} from '@atb/components/text';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {Button} from '@atb/components/button';
import React, {forwardRef} from 'react';
import {Linking, View} from 'react-native';
import {InfoLinkFragment} from '@atb/api/types/generated/fragments/shared';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {SituationType} from './types';
import {SituationOrNoticeIcon} from './SituationOrNoticeIcon';
import {daysBetween, formatToLongDateTime} from '@atb/utils/date';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Time} from '@atb/assets/svg/mono-icons/time';
import {screenReaderPause} from '@atb/components/text';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {getMsgTypeForMostCriticalSituationOrNotice} from './utils';

type Props = {
  situation: SituationType;
};

export const SituationBottomSheet = forwardRef<View, Props>(
  ({situation}, focusRef) => {
    const {t, language} = useTranslation();
    const styles = useStyles();
    const {theme} = useThemeContext();
    const interactiveColor = theme.color.interactive[0];

    const summary = getTextForLanguage(situation.summary, language);
    const description = getTextForLanguage(situation.description, language);
    const advice = getTextForLanguage(situation.advice, language);
    const infoLinks = filterInfoLinks(situation.infoLinks);
    const validityPeriodText = useValidityPeriodText(situation.validityPeriod);
    const msgType = getMsgTypeForMostCriticalSituationOrNotice([situation]);
    const {close} = useBottomSheetContext();

    return (
      <BottomSheetContainer
        title={t(SituationsTexts.bottomSheet.title[msgType ?? 'info'])}
      >
        <ScrollView centerContent={true}>
          <View>
            <Section style={styles.section}>
              <GenericSectionItem type="spacious">
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
                    <ThemeText
                      typography="heading__m"
                      style={styles.summaryText}
                    >
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
                      color="secondary"
                      style={styles.validityIcon}
                    />
                    <ThemeText
                      typography="body__s"
                      color="secondary"
                      style={styles.validityText}
                    >
                      {validityPeriodText}
                    </ThemeText>
                  </View>
                )}
              </GenericSectionItem>
            </Section>
          </View>
        </ScrollView>
        <FullScreenFooter>
          <Button
            expanded={true}
            style={styles.button}
            onPress={close}
            interactiveColor={interactiveColor}
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
    <PressableOpacity
      onPress={() => Linking.openURL(infoLink.uri)}
      accessibilityRole="link"
      style={styles.infoLink}
    >
      <ThemeText typography="body__m__underline" color="secondary">
        {infoLink.label || t(dictionary.readMore)}
      </ThemeText>
    </PressableOpacity>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  section: {paddingHorizontal: theme.spacing.medium},
  textContainer: {flex: 1},
  summaryContainer: {flexDirection: 'row'},
  summaryIcon: {marginRight: theme.spacing.small},
  summaryText: {flex: 1},
  description: {marginTop: theme.spacing.medium},
  advice: {marginTop: theme.spacing.medium},
  infoLinksContainer: {marginTop: theme.spacing.medium, flexDirection: 'row'},
  infoLink: {marginRight: theme.spacing.medium},
  validityContainer: {flexDirection: 'row', marginTop: theme.spacing.medium},
  validityIcon: {marginRight: theme.spacing.small},
  validityText: {flex: 1},
  button: {marginTop: theme.spacing.medium},
}));
