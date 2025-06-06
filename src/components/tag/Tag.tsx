import {StyleSheet, useThemeContext} from '@atb/theme';
import {ThemeText} from '../text';
import {View, StyleProp, ViewStyle} from 'react-native';
import {ThemeIcon} from '@atb/components/theme-icon';
import {statusTypeToIcon} from '@atb/utils/status-type-to-icon';
import {SvgProps} from 'react-native-svg';
import {addOpacity} from '@atb/utils/add-opacity';

type TagStatuses =
  | 'primary'
  | 'secondary'
  | 'valid'
  | 'error'
  | 'warning'
  | 'info';

type BaseTagProps = {
  label: string[];
  size?: 'small' | 'regular';
  customStyle?: StyleProp<ViewStyle>;
};

type SecondaryTagProps = BaseTagProps & {
  tagType: 'secondary';
  icon?: (props: SvgProps) => JSX.Element;
};

type OtherTagProps = BaseTagProps & {
  tagType: Exclude<TagStatuses, 'secondary'>;
  icon?: never;
};

export type TagProps = SecondaryTagProps | OtherTagProps;

export const Tag = ({
  label,
  tagType,
  size = 'regular',
  icon,
  customStyle,
}: TagProps) => {
  const {theme, themeName} = useThemeContext();

  const getTagColor = () => {
    switch (tagType) {
      case 'primary':
        return theme.color.status.info.primary.background;
      case 'secondary':
        return theme.color.background.neutral[0].background;
      default:
        return theme.color.status[tagType].secondary.background;
    }
  };

  const isPrimary = tagType === 'primary';
  const fillColor = getTagColor();
  const iconSize = size === 'regular' ? 'small' : 'xSmall';

  const getPaddingLeft = () => {
    if (size === 'small') return theme.spacing.xSmall;
    if (tagType === 'primary') return theme.spacing.small;
    return icon ? theme.spacing.xSmall : theme.spacing.small;
  };

  const getIcon = () => {
    if (tagType === 'secondary') {
      return icon || null;
    }
    if (tagType === 'primary') {
      return null;
    }
    return statusTypeToIcon(tagType, true, themeName);
  };

  const containerStyles: StyleProp<ViewStyle> = {
    borderColor:
      tagType === 'secondary'
        ? themeName == 'light'
          ? theme.color.background.neutral[2].background
          : addOpacity(theme.color.foreground.dynamic.primary, 0.2)
        : undefined,
    borderWidth: tagType === 'secondary' ? theme.border.width.slim : undefined,
    borderRadius:
      size === 'small'
        ? theme.border.radius.small
        : theme.border.radius.regular,
    paddingVertical: theme.spacing.xSmall,
    paddingRight: theme.spacing[size === 'regular' ? 'small' : 'xSmall'],
    paddingLeft: getPaddingLeft(),
  };

  const styles = useStyles(fillColor)();
  const iconToShow = getIcon();

  return (
    <View style={[styles.flag, containerStyles, customStyle]}>
      {iconToShow && <ThemeIcon svg={iconToShow} size={iconSize} />}
      <View>
        {label.map((content) => (
          <ThemeText
            color={
              theme.color.foreground[isPrimary ? 'inverse' : 'dynamic'].primary
            }
            typography="body__tertiary"
            key={content}
          >
            {content}
          </ThemeText>
        ))}
      </View>
    </View>
  );
};

const useStyles = (fillColor: string) =>
  StyleSheet.createThemeHook((theme) => ({
    flag: {
      backgroundColor: fillColor,
      flexDirection: 'row',
      gap: theme.spacing.xSmall,
      alignItems: 'center',
      marginRight: theme.spacing.medium,
      alignSelf: 'flex-start',
    },
  }));
