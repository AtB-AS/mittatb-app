import {FareContractTexts, useTranslation} from '@atb/translations';
import {TravelRightDirection} from '@atb-as/utils';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ArrowDown, ArrowUpDown} from '@atb/assets/svg/mono-icons/navigation';
import {BorderedInfoBox} from '@atb/components/bordered-info-box';
import {ContrastColor} from '@atb-as/theme';
import {StyleSheet} from '@atb/theme';
import {MapPin} from '@atb/assets/svg/mono-icons/tab-bar';
import {Size, getContentTypography} from '../utils';

type FromToBoxProps = {
  fromText: string;
  toText?: string;
  direction: TravelRightDirection;
  size: Size;
  backgroundColor: ContrastColor;
};

export const FromToBox = ({
  fromText,
  toText,
  direction,
  size,
  backgroundColor,
}: FromToBoxProps) => {
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
          <ThemeIcon color={backgroundColor} svg={MapPin} size={size} />
          <View style={styles.smallContentText}>
            <ThemeText
              color={backgroundColor}
              typography={getContentTypography(size)}
            >
              {fromText}
            </ThemeText>
          </View>
        </View>
      );
    return (
      <View style={styles.smallContent}>
        <ThemeIcon color={backgroundColor} svg={icons[direction]} size={size} />
        <View style={styles.smallContentText}>
          <ThemeText
            color={backgroundColor}
            typography={getContentTypography(size)}
          >
            {fromText}
          </ThemeText>
          <ThemeText
            color={backgroundColor}
            typography={getContentTypography(size)}
          >
            {toText}
          </ThemeText>
        </View>
      </View>
    );
  };

  const largeLayout = () => (
    <View style={styles.largeContent}>
      <View style={styles.largeContentFromText}>
        {!toText && (
          <ThemeIcon color={backgroundColor} svg={MapPin} size="normal" />
        )}
        <ThemeText color={backgroundColor} typography="body__m__strong">
          {fromText}
        </ThemeText>
      </View>
      {toText && (
        <>
          <ThemeIcon
            color={backgroundColor}
            svg={
              direction === TravelRightDirection.Both ? ArrowUpDown : ArrowDown
            }
            size="normal"
          />
          <ThemeText color={backgroundColor} typography="body__m__strong">
            {toText}
          </ThemeText>
        </>
      )}
    </View>
  );

  if (size === 'large') {
    return (
      <BorderedInfoBox backgroundColor={backgroundColor} type={size}>
        {largeLayout()}
      </BorderedInfoBox>
    );
  }

  return (
    <View accessible accessibilityLabel={accessibilityLabel}>
      {smallLayout()}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  largeContent: {
    flexDirection: 'column',
    alignItems: 'center',
    rowGap: theme.spacing.xSmall,
  },
  largeContentFromText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.small,
  },
  smallContent: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.small,
  },
  smallContentText: {
    flexDirection: 'column',
  },
}));

const icons = {
  [TravelRightDirection.Both]: ArrowUpDown,
  [TravelRightDirection.Forwards]: ArrowDown,
  [TravelRightDirection.Backwards]: ArrowDown,
  [TravelRightDirection.Unspecified]: ArrowDown,
};
