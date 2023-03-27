import {createContext, FunctionComponent, useState} from 'react';

export interface TicketAssistantContextValue {
  data: TicketAssistantData;
  updateData: (newData: TicketAssistantData) => void;
}

export interface TicketAssistantData {
  frequency: number;
  category: string;
  duration: number;
  zones: string[];
}

const TicketAssistantContext =
  createContext<TicketAssistantContextValue | null>(null);

export const TicketAssistantProvider: FunctionComponent = ({children}) => {
  const [data, setData] = useState<TicketAssistantData>({
    frequency: 0,
    category: '',
    duration: 0,
    zones: [],
  });

  const updateData = (newData: TicketAssistantData) => {
    setData((prevState) => ({...prevState, ...newData}));
  };
  return (
    <TicketAssistantContext.Provider value={{data, updateData}}>
      {children}
    </TicketAssistantContext.Provider>
  );
};

export default TicketAssistantContext;
