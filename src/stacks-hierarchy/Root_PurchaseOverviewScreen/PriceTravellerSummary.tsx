import {View} from 'react-native';
import type {UserProfileWithCount} from '@atb/modules/fare-contracts';
import {ThemeText} from '@atb/components/text';
import {getReferenceDataName} from '@atb/modules/configuration';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import {useThemeContext} from '@atb/theme';

type Props = {
  travellers: UserProfileWithCount[];
  price: number;
};

export function PriceTravellerSummary({travellers, price}: Props) {
  const {t, language} = useTranslation();
  const {theme} = useThemeContext();
  if (travellers.length === 0) return null;
  return (
    <View>
      <ThemeText
        typography="body__primary"
        color={theme.color.foreground.dynamic.secondary}
      >
        {travellers.length === 1
          ? `${getReferenceDataName(travellers[0], language)} ${price} kr`
          : t(PurchaseOverviewTexts.summary.price(price.toString()))}
      </ThemeText>
    </View>
  );
}
