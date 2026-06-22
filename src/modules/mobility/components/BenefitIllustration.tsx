import React from 'react';
import {View, ViewStyle} from 'react-native';
import {SvgProps} from 'react-native-svg';
import {
  ThemedBonusBag,
  ThemedBonusStar,
  ThemedTicket,
} from '@atb/theme/ThemedAssets';

type ThemedAsset = (props: SvgProps) => React.JSX.Element;

/**
 * Maps the open-enum `illustration` string from the vehicle benefit to an asset.
 * The set of values is server-driven, so unknown values fall back to nothing
 * rather than crashing.
 */
const ILLUSTRATION_REGISTRY: Record<string, ThemedAsset> = {
  TicketValid: ThemedTicket,
  Bonus: ThemedBonusStar,
  BonusBag: ThemedBonusBag,
};

type BenefitIllustrationProps = {
  illustration: string | undefined;
  style?: ViewStyle;
};

export const BenefitIllustration = ({
  illustration,
  style,
}: BenefitIllustrationProps): React.JSX.Element | null => {
  const Asset = illustration ? ILLUSTRATION_REGISTRY[illustration] : undefined;
  if (!Asset) return null;
  return (
    <View style={style}>
      <Asset height={54} width={54} />
    </View>
  );
};
