import {TextNames} from '@atb/theme';
import {ActivityIndicator} from 'react-native';
import {useBonusBalanceQuery} from '..';
import {ThemeText} from '@atb/components/text';
import {isDefined} from '@atb/utils/presence';

type Props = {
  typography: TextNames;
  color: string;
};

export const UserBonusBalance = ({color, typography}: Props) => {
  const {data: userBonusBalance, status: userBonusBalanceStatus} =
    useBonusBalanceQuery();

  return (
    <>
      {userBonusBalanceStatus === 'pending' ? (
        <ActivityIndicator />
      ) : (
        <ThemeText typography={typography} color={color}>
          {isDefined(userBonusBalance) &&
          typeof userBonusBalance === 'number' &&
          !Number.isNaN(userBonusBalance)
            ? userBonusBalance
            : '--'}
        </ThemeText>
      )}
    </>
  );
};
