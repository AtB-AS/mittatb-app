import React from 'react';
import {FareContract} from '../../../api/fareContracts';
import ThemeText from '../../../components/text';
import * as Sections from '../../../components/sections';
import ValidityHeader from './ValidityHeader';
import ValidityLine from './ValidityLine';
type Props = {
  fareContract: FareContract;
  now: number;
  onPressDetails: () => void;
};

const Ticket: React.FC<Props> = ({fareContract: fc, now, onPressDetails}) => {
  const nowSeconds = now / 1000;
  const isValidTicket = fc.usage_valid_to >= nowSeconds;
  const timeLeft = fc.usage_valid_to - nowSeconds;

  return (
    <Sections.Section withBottomPadding>
      <Sections.GenericItem>
        <ValidityHeader
          isValid={isValidTicket}
          timeLeft={timeLeft}
          validFrom={fc.usage_valid_from}
          onPressDetails={onPressDetails}
        />
        <ValidityLine
          isValid={isValidTicket}
          validityLeftSeconds={timeLeft}
          validFrom={fc.usage_valid_from}
          validTo={fc.usage_valid_to}
        />
        <ThemeText>
          {fc.user_profiles.length > 1
            ? `${fc.user_profiles.length} voksne`
            : `1 voksen`}
        </ThemeText>
        <ThemeText type="lead" color="faded">
          {fc.product_name}
        </ThemeText>
        <ThemeText type="lead" color="faded">
          Sone A - Stor-Trondheim
        </ThemeText>
      </Sections.GenericItem>
      {isValidTicket && <Sections.LinkItem text="Vis for kontroll" disabled />}
    </Sections.Section>
  );
};

export default Ticket;
