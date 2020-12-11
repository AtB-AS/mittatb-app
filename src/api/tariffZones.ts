import {LanguageAndText} from './utils';
import client from './client';

export async function list() {
  const url = 'reference-data/v1/ATB/tariff-zones';
  const response = await client.get<TariffZone[]>(url);
  return response.data;
}

export type TariffZone = {
  id: string;
  name: LanguageAndText;
  version: string;
  geometry: {
    interior: number[][];
    exterior: number[][];
  };
};
