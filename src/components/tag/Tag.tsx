import {StyleSheet, useThemeContext} from '@atb/theme';
import {ThemeText} from '../text';
import {type StyleProp, View, type ViewStyle} from 'react-native';
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
  a11yLabel?: string;
  size?: TagSize;
  customStyle?: StyleProp<ViewStyle>;
};

type TagProps = BaseTagProps & {
  tagType: TagStatuses;
  icon?: (props: SvgProps) => JSX.Element;
};

export const Tag = ({
  labels,
  a11yLabel,
  size,
  tagType,
  icon,
  customStyle,
}: TagProps) => {
  switch (tagType) {
    case 'primary':
      return (
        <PrimaryTag
          labels={labels}
          a11yLabel={a11yLabel}
          size={size}
          customStyle={customStyle}
        />
      );
    case 'secondary':
      return (
        <SecondaryTag
          labels={labels}
          a11yLabel={a11yLabel}
          size={size}
          icon={icon}
          customStyle={customStyle}
        />
      );
    default:
      return (
        <SemanticTag
          labels={labels}
          a11yLabel={a11yLabel}
          size={size}
          tagType={tagType}
          customStyle={customStyle}
        />
      );
  }
};

const PrimaryTag: React.FC<BaseTagProps> = ({
  labels,
  a11yLabel,
  size = 'regular',
  customStyle,
}) => {
  const styles = usePrimaryTagStyles();
  const commonStyles = useCommonTagStyles();
  const {theme} = useThemeContext();

  const sizeDependentStyle =
    size === 'small'
      ? commonStyles.smallContainer
      : commonStyles.regularContainer;

  return (
    <View
      style={[
        commonStyles.commonContainer,
        styles.container,
        sizeDependentStyle,
        customStyle,
      ]}
      accessibilityLabel={a11yLabel || labels.join(', ')}
    >
      {labels.map((content) => (
        <ThemeText
          color={theme.color.foreground.light.primary}
          typography="body__tertiary"
          style={commonStyles.text}
          key={content}
        >
          {content}
        </ThemeText>
      ))}
    </View>
  );
};

const usePrimaryTagStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.color.status.info.primary.background,
    borderColor: theme.color.status.info.primary.background,
  },
}));

const SecondaryTag: React.FC<
  BaseTagProps & {icon?: (props: SvgProps) => JSX.Element}
> = ({labels, a11yLabel, size = 'regular', icon, customStyle}) => {
  const commonStyles = useCommonTagStyles();
  const styles = useSecondaryTagStyles();
  const {theme} = useThemeContext();

  const sizeDependentStyle =
    size === 'small'
      ? commonStyles.smallContainer
      : commonStyles.regularContainer;

  return (
    <View
      style={[
        commonStyles.commonContainer,
        styles.container,
        sizeDependentStyle,
        customStyle,
      ]}
      accessibilityLabel={a11yLabel || labels.join(', ')}
    >
      {icon && (
        <ThemeIcon svg={icon} size={size === 'regular' ? 'small' : 'xSmall'} />
      )}
      {labels.map((content) => (
        <ThemeText
          color={theme.color.foreground.dynamic.primary}
          typography="body__tertiary"
          key={content}
          style={commonStyles.text}
        >
          {content}
        </ThemeText>
      ))}
    </View>
  );
};

const useSecondaryTagStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.color.background.neutral[0].background,
    borderWidth: theme.border.width.slim,
    borderColor: theme.color.foreground.inverse.disabled,
  },
}));

const SemanticTag: React.FC<
  BaseTagProps & {tagType: Exclude<TagStatuses, 'primary' | 'secondary'>}
> = ({labels, a11yLabel, tagType, size = 'regular', customStyle}) => {
  const {theme, themeName} = useThemeContext();
  const commonStyles = useCommonTagStyles();
  const styles = useSemanticTagStyles();

  const icon = statusTypeToIcon(tagType, true, themeName);
  const sizeDependentStyle =
    size === 'small'
      ? commonStyles.smallContainer
      : commonStyles.regularContainer;

  return (
    <View
      style={[
        styles[tagType],
        commonStyles.commonContainer,
        sizeDependentStyle,
        customStyle,
      ]}
      accessibilityLabel={a11yLabel || `${tagType}: ${labels.join(', ')}`}
    >
      {icon && (
        <ThemeIcon svg={icon} size={size === 'regular' ? 'small' : 'xSmall'} />
      )}
      {labels.map((content) => (
        <ThemeText
          color={theme.color.foreground.dynamic.primary}
          typography="body__tertiary"
          key={content}
          style={commonStyles.text}
        >
          {content}
        </ThemeText>
      ))}
    </View>
  );
};

const useSemanticTagStyles = StyleSheet.createThemeHook((theme) => ({
  info: {
    backgroundColor: theme.color.status.info.secondary.background,
    borderColor: theme.color.status.info.primary.background,
  },
  valid: {
    backgroundColor: theme.color.status.valid.secondary.background,
    borderColor: theme.color.status.valid.primary.background,
  },
  error: {
    backgroundColor: theme.color.status.error.secondary.background,
    borderColor: theme.color.status.error.primary.background,
  },
  warning: {
    backgroundColor: theme.color.status.warning.secondary.background,
    borderColor: theme.color.status.warning.primary.background,
  },
}));

const useCommonTagStyles = StyleSheet.createThemeHook((theme) => ({
  text: {
    flexShrink: 1,
  },
  commonContainer: {
    flexShrink: 1,
    flexDirection: 'row',
    gap: theme.spacing.xSmall,
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: theme.border.width.slim,
    paddingVertical: theme.spacing.xSmall,
  },
  smallContainer: {
    borderRadius: theme.border.radius.small,
    paddingHorizontal: theme.spacing.xSmall,
  },
  regularContainer: {
    borderRadius: theme.border.radius.regular,
    paddingHorizontal: theme.spacing.small,
  },
}));
