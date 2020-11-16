import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {ArrowLeft} from '../../assets/svg/icons/navigation';
import ThemeIcon from '../../components/theme-icon';
import ScreenHeader from '../../ScreenHeader';

type BackHeaderProps = {
  title: string;
};
export default function BackHeader({title}: BackHeaderProps) {
  const navigation = useNavigation();
  const goBack = () => navigation.goBack();

  return (
    <ScreenHeader
      leftButton={{
        onPress: goBack,
        icon: <ThemeIcon svg={ArrowLeft} />,
        accessible: true,
        accessibilityRole: 'button',
        accessibilityLabel: 'Gå tilbake',
      }}
      title={title}
    />
  );
}
