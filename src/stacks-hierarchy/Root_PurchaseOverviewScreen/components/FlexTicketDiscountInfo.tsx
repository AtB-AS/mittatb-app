import React, {useState} from 'react';
import {ThemeText} from '@atb/components/text';
import {Linking, StyleProp, View, ViewStyle} from 'react-native';
import {
  getTextForLanguage,
  PurchaseOverviewTexts,
  useTranslation,
} from '@atb/translations';
import {UserProfileWithCountAndOffer} from '@atb/stacks-hierarchy/Root_PurchaseOverviewScreen/use-offer-state';
import {
  getReferenceDataName,
  useFirestoreConfiguration,
} from '@atb/configuration';
import {formatDecimalNumber} from '@atb/utils/numbers';
import {StyleSheet} from '@atb/theme';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {
  ExpandableSectionItem,
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {ContentHeading} from '@atb/components/heading';
import {BorderedInfoBox} from '@atb/components/bordered-info-box';

type Props = {
  userProfiles: UserProfileWithCountAndOffer[];
  style: StyleProp<ViewStyle>;
};

export const FlexTicketDiscountInfo = ({userProfiles, style}: Props) => {
  const {t, language} = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const styles = useStyles();
  const {appTexts} = useFirestoreConfiguration();
  const {flex_ticket_url} = useRemoteConfig();

  if (!userProfiles.some((u) => u.offer.flex_discount_ladder)) return null;

  const description =
    getTextForLanguage(appTexts?.discountInfo, language) ||
    t(PurchaseOverviewTexts.flexDiscount.description);

  return (
    <View style={style}>
      <ContentHeading text={t(PurchaseOverviewTexts.flexDiscount.heading)} />
      <Section>
        <ExpandableSectionItem
          text={t(PurchaseOverviewTexts.flexDiscount.expandableLabel)}
          textType="heading__component"
          label="new"
          expanded={expanded}
          onPress={setExpanded}
        />
        {expanded && (
          <GenericSectionItem accessibility={{accessible: true}}>
            <ThemeText type="body__secondary" color="secondary">
              {description}
            </ThemeText>
          </GenericSectionItem>
        )}
        {expanded &&
          userProfiles.map((u) => {
            const ladder = u.offer.flex_discount_ladder;
            const discountPercent = ladder?.steps[ladder.current].discount;

            const userProfileName = getReferenceDataName(u, language);
            const discountText =
              discountPercent !== undefined &&
              t(
                PurchaseOverviewTexts.flexDiscount.discountPercentage(
                  discountPercent.toFixed(0),
                ),
              );
            const priceText =
              formatDecimalNumber(
                u.offer.prices[0].amount_float || 0,
                language,
                2,
              ) + ' kr';

            const accessibilityLabel = `${userProfileName}, ${
              discountText ? discountText : ''
            }, ${priceText}`;

            return (
              <GenericSectionItem
                accessibility={{
                  accessible: true,
                  accessibilityLabel: accessibilityLabel,
                }}
                key={u.id}
              >
                <View style={styles.userProfileDiscountInfo}>
                  <ThemeText type="body__secondary" color="secondary">
                    {t(
                      PurchaseOverviewTexts.flexDiscount.per(
                        userProfileName.toLowerCase(),
                      ),
                    )}
                  </ThemeText>
                  <View style={styles.discountInfoContainer}>
                    {discountText && (
                      <BorderedInfoBox
                        style={styles.discountInfo}
                        type="small"
                        backgroundColor="background_0"
                        text={discountText}
                      />
                    )}
                    <ThemeText
                      style={styles.priceInfo}
                      type="body__tertiary"
                      color="primary"
                    >
                      {priceText}
                    </ThemeText>
                  </View>
                </View>
              </GenericSectionItem>
            );
          })}
        {expanded && (
          <LinkSectionItem
            text={t(PurchaseOverviewTexts.flexDiscount.link)}
            icon="external-link"
            onPress={() => Linking.openURL(flex_ticket_url)}
            accessibility={{
              accessibilityHint: t(PurchaseOverviewTexts.flexDiscount.a11yHint),
              accessibilityRole: 'link',
            }}
          />
        )}
      </Section>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  userProfileDiscountInfo: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  discountInfoContainer: {flexDirection: 'row'},
  discountInfo: {marginRight: theme.spacings.small},
  priceInfo: {alignSelf: 'center'},
}));
