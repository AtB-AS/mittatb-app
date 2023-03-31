import {PurchaseOverviewTexts, TranslateFunction} from '@atb/translations';

export function getValidOnTrainNoticeText(
  t: TranslateFunction,
  fareProductType?: string,
) {
  if (fareProductType === 'single')
    return t(PurchaseOverviewTexts.samarbeidsbillettenInfo.single);
  if (fareProductType === 'hour24')
    return t(PurchaseOverviewTexts.samarbeidsbillettenInfo.hour24);
  return t(PurchaseOverviewTexts.samarbeidsbillettenInfo.period);
}
