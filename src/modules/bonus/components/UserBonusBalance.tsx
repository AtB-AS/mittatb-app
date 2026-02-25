import {TextNames} from '@atb/theme';
import {useBonusBalanceQuery} from '..';
import {ThemeText} from '@atb/components/text';
import {isDefined} from '@atb/utils/presence';
import {Loading} from '@atb/components/loading';

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
        <Loading />
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
