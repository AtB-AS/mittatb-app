import {StyleSheet, useThemeContext} from '@atb/theme';
import {ThemeText} from '../text';
import {View} from 'react-native';
import {ThemeIcon} from '@atb/components/theme-icon';
import {statusTypeToIcon} from '@atb/utils/status-type-to-icon';
import {SvgProps} from 'react-native-svg';
import React from 'react';

type TagStatuses =
  | 'primary'
  | 'secondary'
  | 'valid'
  | 'error'
  | 'warning'
  | 'info';

type TagSize = 'small' | 'regular';

type BaseTagProps = {
  labels: string[];
  size?: TagSize;
};

type TagProps = BaseTagProps & {
  tagType: TagStatuses;
  icon?: (props: SvgProps) => JSX.Element;
};

export const Tag = ({labels, size, tagType, icon}: TagProps) => {
  switch (tagType) {
    case 'primary':
      return <PrimaryTag labels={labels} size={size} />;
    case 'secondary':
      return <SecondaryTag labels={labels} size={size} icon={icon} />;
    default:
      return <GenericTag labels={labels} size={size} tagType={tagType} />;
  }
};

const PrimaryTag: React.FC<BaseTagProps> = ({labels, size = 'regular'}) => {
  const {theme} = useThemeContext();
  const styles = useStyles(theme.color.status.info.primary.background, size)();

  return (
    <View style={styles.container}>
      {labels.map((content) => (
        <ThemeText
          color={theme.color.foreground.light.primary}
          typography="body__tertiary"
          key={content}
        >
          {content}
        </ThemeText>
      ))}
    </View>
  );
};

const SecondaryTag: React.FC<
  BaseTagProps & {icon?: (props: SvgProps) => JSX.Element}
> = ({labels, size = 'regular', icon}) => {
  const {theme} = useThemeContext();
  const styles = useStyles(
    theme.color.background.neutral[0].background,
    size,
  )();

  return (
    <View style={[styles.container, styles.nonPrimaryContainer]}>
      {icon && (
        <ThemeIcon svg={icon} size={size === 'regular' ? 'small' : 'xSmall'} />
      )}
      {labels.map((content) => (
        <ThemeText
          color={theme.color.foreground.dynamic.primary}
          typography="body__tertiary"
          key={content}
        >
          {content}
        </ThemeText>
      ))}
    </View>
  );
};

const GenericTag: React.FC<
  BaseTagProps & {tagType: Exclude<TagStatuses, 'primary' | 'secondary'>}
> = ({labels, tagType, size = 'regular'}) => {
  const {theme, themeName} = useThemeContext();
  const styles = useStyles(
    theme.color.status[tagType].secondary.background,
    size,
  )();
  const icon = statusTypeToIcon(tagType, true, themeName);

  return (
    <View style={[styles.container, styles.nonPrimaryContainer]}>
      {icon && (
        <ThemeIcon svg={icon} size={size === 'regular' ? 'small' : 'xSmall'} />
      )}
      {labels.map((content) => (
        <ThemeText
          color={theme.color.foreground.dynamic.primary}
          typography="body__tertiary"
          key={content}
        >
          {content}
        </ThemeText>
      ))}
    </View>
  );
};

const useStyles = (fillColor: string, size: TagSize) =>
  StyleSheet.createThemeHook((theme) => ({
    container: {
      backgroundColor: fillColor,
      flexDirection: 'row',
      gap: theme.spacing.xSmall,
      alignItems: 'center',
      alignSelf: 'flex-start',
      borderRadius:
        size === 'small'
          ? theme.border.radius.small
          : theme.border.radius.regular,
      paddingVertical: theme.spacing.xSmall,
      paddingRight: theme.spacing[size === 'regular' ? 'small' : 'xSmall'],
      paddingLeft:
        size === 'small' ? theme.spacing.xSmall : theme.spacing.small,
    },
    nonPrimaryContainer: {
      borderWidth: theme.border.width.slim,
      borderColor: theme.color.foreground.inverse.disabled,
    },
  }));
