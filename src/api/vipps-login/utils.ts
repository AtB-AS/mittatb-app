import {v4 as uuid} from 'uuid';
import {storage} from '@atb/modules/storage';

export const generateState = async () => {
  const state = uuid();
  await storage.set('vipps_state', state);
  return state;
};

export const generateNonce = async () => {
  const nonce = uuid();
  await storage.set('vipps_nonce', nonce);
  return nonce;
};
