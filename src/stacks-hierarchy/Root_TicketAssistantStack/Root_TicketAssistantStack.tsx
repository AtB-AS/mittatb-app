import React, {useState} from 'react';

import {FullScreenHeader} from '@atb/components/screen-header';
import {TicketAssistantContextProvider} from './TicketAssistantContext';
import {RootStackScreenProps} from '@atb/stacks-hierarchy';
import {TicketAssistantTabScreen} from './TicketAssistant_TabScreen';

type Props = RootStackScreenProps<'Root_TicketAssistantStack'>;

export const Root_TicketAssistantStack = ({navigation}: Props) => {
  const [activeTab, setActiveTab] = useState(0);
  const [previousTab, setPreviousTab] = useState<any>();
  return (
    <TicketAssistantContextProvider>
      {activeTab !== 0 ? (
        <FullScreenHeader
          leftButton={{
            type: 'back',
            //Navigate to previous tab
            onPress: () => {
              navigation.navigate(previousTab);
            },
          }}
          rightButton={{type: 'close'}}
        />
      ) : (
        <FullScreenHeader rightButton={{type: 'close'}} />
      )}
      <TicketAssistantTabScreen
        setActiveTab={setActiveTab}
        setPreviousTab={setPreviousTab}
      />
    </TicketAssistantContextProvider>
  );
};
