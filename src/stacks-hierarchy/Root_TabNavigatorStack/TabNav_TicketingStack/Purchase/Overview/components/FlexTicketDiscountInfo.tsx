import * as Sections from '@atb/components/sections';
import {useState} from 'react';
import {ThemeText} from '@atb/components/text';
import {StyleProp, View, ViewStyle} from 'react-native';
import {InfoChip} from '@atb/components/info-chip';
import {
  getTextForLanguage,
  PurchaseOverviewTexts,
  useTranslation,
} from '@atb/translations';
import {UserProfileWithCountAndOffer} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/Purchase/Overview/use-offer-state';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {formatDecimalNumber} from '@atb/utils/numbers';
import {StyleSheet} from '@atb/theme';

type Props = {
  userProfiles: UserProfileWithCountAndOffer[];
  style: StyleProp<ViewStyle>;
};

export const FlexTicketDiscountInfo = ({userProfiles, style}: Props) => {
  const {t, language} = useTranslation();
  const [expanded, setExpanded] = useState(true);
  const styles = useStyles();
  const {appTexts} = useFirestoreConfiguration();

  if (!userProfiles.some((u) => u.offer.flex_discount_ladder)) return null;
  const description =
    getTextForLanguage(appTexts?.discountInfo, language) ||
    t(PurchaseOverviewTexts.flexDiscount.description);

  return (
    <View style={style}>
      <ThemeText
        type="body__secondary"
        color="secondary"
        style={styles.heading}
      >
        {t(PurchaseOverviewTexts.flexDiscount.heading)}
      </ThemeText>
      <Sections.Section>
        <Sections.ExpandableSectionItem
          text={t(PurchaseOverviewTexts.flexDiscount.expandableLabel)}
          textType="heading__component"
          expanded={expanded}
          onPress={setExpanded}
        />
        {expanded && (
          <Sections.GenericSectionItem accessibility={{accessible: true}}>
            <ThemeText>{description}</ThemeText>
          </Sections.GenericSectionItem>
        )}
        {expanded &&
          [...userProfiles].map((u) => {
            const ladder = u.offer.flex_discount_ladder;
            const discountPercent = ladder?.steps[ladder.current].discount;
            if (!discountPercent) return null;

            const userProfileName = getReferenceDataName(u, language);
            const discountText = discountPercent.toFixed(0) + ' %';
            const priceText =
              formatDecimalNumber(
                u.offer.prices[0].amount_float || 0,
                language,
                2,
              ) + ' kr';

            return (
              <Sections.GenericSectionItem
                accessibility={{
                  accessible: true,
                  accessibilityLabel: `${userProfileName}, ${discountText}, ${priceText}`,
                }}
                key={userProfileName}
              >
                <View style={styles.userProfileDiscountInfo}>
                  <ThemeText type="body__secondary" color="secondary">
                    {userProfileName}
                  </ThemeText>
                  <View style={styles.infoChips}>
                    <InfoChip
                      style={styles.infoChips_first}
                      text={discountText}
                    />
                    <InfoChip text={priceText} />
                  </View>
                </View>
              </Sections.GenericSectionItem>
            );
          })}
      </Sections.Section>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  heading: {marginBottom: theme.spacings.medium},
  userProfileDiscountInfo: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoChips: {flexDirection: 'row'},
  infoChips_first: {marginRight: theme.spacings.small},
}));
