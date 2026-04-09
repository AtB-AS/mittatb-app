import React from 'react';
import {View} from 'react-native';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {getTranslatedModeName} from '@atb/utils/transportation-names';
import {useTransportColor} from '@atb/utils/use-transport-color';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ThemeText} from '@atb/components/text';
import {getIconBoxBorderRadius, getTransportModeSvg} from './utils';
import {AnyMode, AnySubMode} from '@atb/components/icon-box';
import {SvgProps} from 'react-native-svg';
import {WithNotificationBadge} from './WithNotificationBadge';

export type TransportationIconBoxProps = {
  mode?: AnyMode;
  subMode?: AnySubMode;
  isFlexible?: boolean;
  lineNumber?: string;
  iconSize?: keyof Theme['icon']['size'];
  type?: 'compact' | 'standard';
  displayType?: 'rounded' | 'square';
  disabled?: boolean;
  testID?: string;
  notification?: (props: SvgProps) => React.JSX.Element;
};

export const TransportationIconBox: React.FC<TransportationIconBoxProps> = ({
  mode,
  subMode,
  isFlexible = false,
  lineNumber,
  iconSize = 'normal',
  type = 'compact',
  displayType = 'square',
  disabled,
  testID,
  notification,
}) => {
  const {t} = useTranslation();
  const transportColor = useTransportColor(mode, subMode, isFlexible);
  const transportationColor = transportColor.primary;
  const backgroundColor = disabled
    ? transportationColor.foreground.disabled
    : transportationColor.background;
  const {svg} = getTransportModeSvg(mode, subMode);
  const styles = useStyles();
  const {theme} = useThemeContext();

  return (
    <WithNotificationBadge notification={notification}>
      {({extraPaddingRight}) => (
        <View
          style={[
            styles.transportationIconBox,
            type === 'standard' && styles.standardTransportationIconBox,
            {
              backgroundColor,
              borderRadius:
                displayType === 'rounded'
                  ? theme.border.radius.circle
                  : getIconBoxBorderRadius(iconSize, theme),
              paddingRight:
                (type === 'standard'
                  ? theme.spacing.small
                  : theme.spacing.xSmall) + extraPaddingRight,
            },
          ]}
        >
          <ThemeIcon
            size={iconSize}
            svg={svg}
            color={transportationColor.foreground.primary}
            accessibilityLabel={t(getTranslatedModeName(mode))}
            testID={testID}
          />
          {lineNumber && (
            <ThemeText
              typography="body__m__strong"
              color={transportationColor}
              style={styles.lineNumberText}
              testID="lineNumber"
            >
              {lineNumber}
            </ThemeText>
          )}
        </View>
      )}
    </WithNotificationBadge>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    transportationIconBox: {
      display: 'flex',
      flexDirection: 'row',
      padding: theme.spacing.xSmall,
      alignItems: 'center',
      justifyContent: 'center',
    },
    standardTransportationIconBox: {
      padding: theme.spacing.small,
    },
    lineNumberText: {
      marginLeft: theme.spacing.xSmall,
    },
  };
});
