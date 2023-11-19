import {Image, ImageStyle, View} from 'react-native';
import React from 'react';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Car} from '@atb/assets/svg/mono-icons/transportation-entur';
import {StyleSheet, useTheme} from '@atb/theme';
import {ThemeText} from '@atb/components/text';

type Props = {
  uri?: string | undefined;
  plus?: number | undefined;
};

export const CarImage = ({uri, plus}: Props) => {
  const style = useSheetStyle();

  return uri ? (
    <Image
      style={[style.container as ImageStyle, style.image as ImageStyle]}
      source={{uri}}
    />
  ) : plus ? (
    <PlusContainer plus={plus} />
  ) : (
    <DefaultCarImage />
  );
};

const DefaultCarImage = () => {
  const {theme} = useTheme();
  const style = useSheetStyle();
  return (
    <View style={[style.container, style.defaultImage]}>
      <ThemeIcon size="large" fill={theme.text.colors.secondary} svg={Car} />
    </View>
  );
};

const PlusContainer = ({plus}: Props) => {
  const style = useSheetStyle();
  return (
    <View style={[style.container, style.defaultImage]}>
      <ThemeText style={style.defaultImage}>+{plus}</ThemeText>
    </View>
  );
};

const useSheetStyle = StyleSheet.createThemeHook(() => {
  return {
    container: {
      height: 40,
      width: 40,
      borderRadius: 8,
      backgroundColor: '#d8d8d8',
    },
    image: {
      resizeMode: 'cover',
    },
    defaultImage: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  };
});
