import {
  Mode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {TouchableOpacity, View} from 'react-native';
import ThemeText from '@atb/components/text';
import React from 'react';
import {StyleSheet, useTheme} from '@atb/theme';
import ThemedFareProductIllustration, {
  FareProductIllustration,
} from '@atb/components/ticket-illustration';
import {TicketsTexts, useTranslation} from '@atb/translations';
import {getStaticColor, StaticColor} from '@atb/theme/colors';
import TransportMode from '@atb/screens/Ticketing/FareContracts/Component/TransportMode';
import {PreassignedFareProductType} from '@atb/reference-data/types';

export type TransportationModeIconProperties = {
  mode: Mode;
  subMode?: TransportSubmode;
};

const FareProductTile = ({
  transportationModeTexts,
  illustration,
  accented = false,
  onPress,
  testID,
  type,
}: {
  transportationModeTexts: string;
  illustration: FareProductIllustration;
  accented?: boolean;
  onPress: () => void;
  testID: string;
  type: Exclude<PreassignedFareProductType | 'summerPass', 'carnet'>;
}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {themeName} = useTheme();
  const color: StaticColor = accented ? 'background_accent_3' : 'background_0';
  const themeColor = getStaticColor(themeName, color);
  const title = t(TicketsTexts.availableFareProducts[type].title);
  const description = t(TicketsTexts.availableFareProducts[type].description);
  const accessibilityLabel = [title, transportationModeTexts, description].join(
    '. ',
  );

  return (
    <View
      style={[styles.fareProduct, {backgroundColor: themeColor.background}]}
      testID={testID}
    >
      <TouchableOpacity
        onPress={onPress}
        accessible={true}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={t(TicketsTexts.availableFareProducts.navigateToBuy)}
        style={styles.spreadContent}
      >
        <View style={styles.contentContainer}>
          <TransportMode fareProductType={type} iconSize={'small'} />
          <ThemeText
            type="body__secondary--bold"
            style={styles.title}
            accessibilityLabel={title}
            color={themeColor}
            testID={testID + 'Title'}
          >
            {title}
          </ThemeText>
          <ThemeText
            type="body__tertiary"
            style={styles.description}
            color={'secondary'}
          >
            {description}
          </ThemeText>
        </View>
        <View style={styles.illustrationContainer}>
          <ThemedFareProductIllustration name={illustration} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  fareProduct: {
    width: '100%',
    flexShrink: 1,
    alignSelf: 'stretch',
    marginRight: theme.spacings.medium,
    padding: theme.spacings.xLarge,
    borderRadius: theme.border.radius.regular,
  },
  contentContainer: {
    flexShrink: 1,
  },
  iconContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  spreadContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  label: {marginLeft: theme.spacings.xSmall},
  illustrationContainer: {
    marginTop: theme.spacings.small,
  },
  title: {
    marginBottom: theme.spacings.small,
    marginTop: theme.spacings.medium,
  },
  description: {marginBottom: theme.spacings.small},
}));

export default FareProductTile;
