import {createContext, FunctionComponent, useState} from 'react';

export interface TicketAssistantContextValue {
  data: TicketAssistantData;
  updateData: (newData: TicketAssistantData) => void;
  response?: Response;
  setResponse?: (response: any) => void;
}

export interface TicketAssistantData {
  frequency: number;
  duration: number;
  traveller: {id: string; user_type: string};
  zones: string[];
}

export interface TicketAssistantResponse {
  product_id: string;
  duration: number;
  quantity: number;
  price: number;
  traveller: {id: string; user_type: string};
}

export interface Response {
  totalCost: number;
  tickets: TicketAssistantResponse[];
  zones: string[];
}

const TicketAssistantContext =
  createContext<TicketAssistantContextValue | null>(null);

export const TicketAssistantProvider: FunctionComponent = ({children}) => {
  const [data, setData] = useState<TicketAssistantData>({
    frequency: 7,
    traveller: {id: 'ADULT', user_type: 'ADULT'},
    duration: 7,
    zones: ['ATB:TariffZone:1', 'ATB:TariffZone:2'],
  });
  const [response, setResponse] = useState<Response>();

  const updateData = (newData: TicketAssistantData) => {
    setData((prevState) => ({...prevState, ...newData}));
  };
  return (
    <TicketAssistantContext.Provider
      value={{data, updateData, response, setResponse}}
    >
      {children}
    </TicketAssistantContext.Provider>
  );
};

export default TicketAssistantContext;
