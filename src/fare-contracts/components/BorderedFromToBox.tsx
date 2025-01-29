import {FareContractTexts, useTranslation} from '@atb/translations';
import {TravelRightDirection} from '@atb/ticketing';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ArrowDown, ArrowUpDown} from '@atb/assets/svg/mono-icons/navigation';
import {BorderedInfoBox} from '@atb/components/bordered-info-box';
import {ContrastColor} from '@atb-as/theme';
import {StyleSheet} from '@atb/theme';

type BorderedFromToBoxProps = {
  fromText: string;
  toText?: string;
  direction?: TravelRightDirection;
  mode: 'small' | 'large';
  backgroundColor: ContrastColor;
};

export const BorderedFromToBox = ({
  fromText,
  toText,
  direction,
  mode,
  backgroundColor,
}: BorderedFromToBoxProps) => {
  const styles = useStyles();
  const {t} = useTranslation();

  const accessibilityLabel = !!toText
    ? t(
        FareContractTexts.details.fromTo(
          fromText,
          toText ?? fromText,
          direction === TravelRightDirection.Both,
        ),
      )
    : t(FareContractTexts.details.validIn(fromText));

  const smallLayout = () => {
    if (!toText)
      return (
        <View style={styles.smallContent}>
          <ThemeText color={backgroundColor} typography="body__tertiary">
            {fromText}
          </ThemeText>
        </View>
      );
    return (
      <View style={styles.smallContent}>
        <ThemeIcon
          color={backgroundColor}
          svg={
            direction === TravelRightDirection.Both ? ArrowUpDown : ArrowDown
          }
          size="small"
        />
        <View style={styles.smallContentText}>
          <ThemeText color={backgroundColor} typography="body__tertiary">
            {fromText}
          </ThemeText>
          <ThemeText color={backgroundColor} typography="body__tertiary">
            {toText}
          </ThemeText>
        </View>
      </View>
    );
  };

  const largeLayout = () => (
    <View style={styles.largeContent}>
      <ThemeText color={backgroundColor} typography="body__primary--bold">
        {fromText}
      </ThemeText>
      {toText && (
        <>
          <ThemeIcon
            color={backgroundColor}
            svg={
              direction === TravelRightDirection.Both ? ArrowUpDown : ArrowDown
            }
            size="normal"
          />
          <ThemeText color={backgroundColor} typography="body__primary--bold">
            {toText}
          </ThemeText>
        </>
      )}
    </View>
  );

  return (
    <View accessible accessibilityLabel={accessibilityLabel}>
      <BorderedInfoBox backgroundColor={backgroundColor} type={mode}>
        {mode === 'large' ? largeLayout() : smallLayout()}
      </BorderedInfoBox>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  largeContent: {
    flexDirection: 'column',
    alignItems: 'center',
    rowGap: theme.spacing.xSmall,
  },
  smallContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    columnGap: theme.spacing.xSmall,
  },
  smallContentText: {
    flexDirection: 'column',
    paddingLeft: theme.spacing.xSmall,
  },
}));
