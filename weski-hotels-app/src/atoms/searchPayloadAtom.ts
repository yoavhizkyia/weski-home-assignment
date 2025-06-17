import { atom } from 'jotai';

import { SearchPayload } from '../models/SearchPayload';

export const searchPayloadAtom = atom<SearchPayload | null>(null);
export const resortNameAtom = atom<string>('');