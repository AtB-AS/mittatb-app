import Warning from '@atb/assets/svg/color/icons/status/Warning';
import Info from '@atb/assets/svg/color/icons/status/Info';
import Error from '@atb/assets/svg/color/icons/status/Error';
import {TravelTokenTexts, useTranslation} from '@atb/translations';
import {ActivityIndicator, View, ViewStyle} from 'react-native';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ThemeText} from '@atb/components/text';
import {
  formatToShortDateWithYear,
  formatToVerboseFullDate,
} from '@atb/utils/date';
import {StyleSheet} from '@atb/theme';
import {StaticColor} from '@atb/theme/colors';

type ComponentProps = {
  toggleLimit: number;
  shouldShowLoader?: boolean;
  componentType: 'plain' | 'sectioned';
  textColor?: StaticColor;
};

export const TokenToggleInfoComponent = ({
  toggleLimit,
  shouldShowLoader,
  componentType,
  textColor,
}: ComponentProps) => {
  const style = useStyles();

  const loader = Loader(
    componentType === 'plain' ? style.loader : style.sectionedLoader,
  );

  const content = Content({
    containerStyle:
      componentType === 'plain' ? style.container : style.sectionedContainer,
    toggleLimit: toggleLimit,
    textColor: textColor,
  });

  return shouldShowLoader ? loader : content;
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'row',
    marginTop: theme.spacings.small,
    marginBottom: theme.spacings.large,
  },
  content: {
    marginLeft: theme.spacings.xSmall,
    flex: 1,
  },
  loader: {
    alignSelf: 'center',
    flex: 1,
    marginTop: theme.spacings.small,
    marginBottom: theme.spacings.large,
  },
  sectionedContainer: {
    flexDirection: 'row',
  },
  sectionedLoader: {
    alignSelf: 'center',
    flex: 1,
  },
}));

const Loader = (style?: ViewStyle) => <ActivityIndicator style={style} />;

type ContentProps = {
  containerStyle?: ViewStyle;
  toggleLimit: number;
  textColor?: StaticColor;
};

const Content = ({containerStyle, toggleLimit, textColor}: ContentProps) => {
  const {t, language} = useTranslation();
  const style = useStyles();
  const now = new Date();
  const nextMonthStartDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const countRenewalDate = formatToShortDateWithYear(
    nextMonthStartDate,
    language,
  );

  const countRenewalDateA11yLabel = formatToVerboseFullDate(
    nextMonthStartDate,
    language,
  );

  const getToggleInfoIcon = (toggleLimit: number) => {
    switch (toggleLimit) {
      case 0:
        return Error;
      case 1:
        return Warning;
      default:
        return Info;
    }
  };

  const getToggleInfo = (toggleLimit: number, countRenewalDate: string) => {
    switch (toggleLimit) {
      case 0:
        return t(
          TravelTokenTexts.travelToken.zeroToggleCountLeftInfo(
            countRenewalDate,
          ),
        );
      case 1:
        return t(
          TravelTokenTexts.travelToken.oneToggleCountLeftInfo(countRenewalDate),
        );
      default:
        return t(
          TravelTokenTexts.travelToken.toggleCountLimitInfo(
            toggleLimit,
            countRenewalDate,
          ),
        );
    }
  };

  return (
    <View style={containerStyle}>
      <ThemeIcon svg={getToggleInfoIcon(toggleLimit)} />
      <ThemeText
        style={style.content}
        accessibilityLabel={getToggleInfo(
          toggleLimit,
          countRenewalDateA11yLabel,
        )}
        color={textColor}
        accessible={true}
      >
        {getToggleInfo(toggleLimit, countRenewalDate)}
      </ThemeText>
    </View>
  );
};
