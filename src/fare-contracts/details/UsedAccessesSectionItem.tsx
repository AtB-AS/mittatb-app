import {UsedAccess} from '@atb-as/utils';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {fullDateTime} from '@atb/utils/date';
import React from 'react';
import {useSectionItem} from '@atb/components/sections';

type Props = {usedAccesses: UsedAccess[]};

export const UsedAccessesSectionItem = ({usedAccesses}: Props) => {
  const {topContainer} = useSectionItem({});
  const {t, language} = useTranslation();

  const dateStrings = usedAccesses
    .map((ua) => ua.startDateTime)
    .sort((d1, d2) => d2.getTime() - d1.getTime())
    .map((d) => fullDateTime(d, language));

  return (
    <View style={topContainer} accessible={true}>
      <ThemeText typography="body__secondary">
        {t(FareContractTexts.details.usedAccesses)}
      </ThemeText>
      {dateStrings.map((dateString) => (
        <ThemeText
          key={dateString}
          typography="body__secondary"
          color="secondary"
        >
          {dateString}
        </ThemeText>
      ))}
    </View>
  );
};
