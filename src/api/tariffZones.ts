import {LanguageAndText} from './utils';
import client from './client';

export async function list() {
  const url = 'reference-data/v1/ATB/tariff-zones';
  const response = await client.get<TariffZone[]>(url);
  return response.data.sort((t1, t2) =>
    t1.name.value.localeCompare(t2.name.value),
  );
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
