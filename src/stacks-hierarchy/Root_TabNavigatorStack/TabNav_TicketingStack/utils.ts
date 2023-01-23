import {Language, PurchaseOverviewTexts} from '@atb/translations';
import {TFunc} from '@leile/lobo-t';

export function getValidOnTrainNoticeText(
  t: TFunc<typeof Language>,
  fareProductType?: string,
) {
  if (fareProductType === 'single')
    return t(PurchaseOverviewTexts.samarbeidsbillettenInfo.single);
  if (fareProductType === 'hour24')
    return t(PurchaseOverviewTexts.samarbeidsbillettenInfo.hour24);
  return t(PurchaseOverviewTexts.samarbeidsbillettenInfo.period);
}
