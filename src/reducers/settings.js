// @flow

import uniq from 'lodash.uniq';
import { actionTypes as localStorageActionTypes } from 'redux-localstorage';
import { SIGNED_OUT } from '../actions/auth';
import {
  FIREBASE_SYNCED,
  LOAD_SETTINGS_FROM_FIREBASE,
  RESET_FILTERS,
  RESET_SETTINGS,
  UPDATE_FILTERS,
  UPDATE_SETTING,
} from '../actions/settings';

import availableColumns from '../data/availableColumns';
import { tracks, cars } from '../data';

export type SortOptions = {
  key: string,
  order: string,
};

export type FilterOptions = {
  type: Array<string>,
  licence: Array<string>,
  official: Array<boolean>,
  fixed: boolean[],
  ownedCars: boolean,
  ownedTracks: boolean,
  favouriteSeries: boolean,
  favouriteCarsOnly: boolean,
  favouriteTracksOnly: boolean,
};

export const defaultFilters: FilterOptions = {
  type: ['Road', 'Oval', 'Dirt', 'RX'],
  licence: ['R', 'D', 'C', 'B', 'A', 'P'],
  official: [false, true],
  fixed: [false, true],
  ownedCars: false,
  ownedTracks: false,
  favouriteSeries: false,
  favouriteTracksOnly: false,
  favouriteCarsOnly: false,
};

export type SettingOptions = {
  filters: FilterOptions,
  ownedCars: Array<number>,
  ownedTracks: Array<number>,
  favouriteSeries: Array<number>,
  favouriteCars: Array<number>,
  favouriteTracks: Array<number>,
  sort: SortOptions,
  columns: Array<number>,
  firebaseSynced: boolean,
};

export const defaultSettings: SettingOptions = {
  filters: defaultFilters,
  ownedCars: cars.filter((car) => car.freeWithSubscription === true).map((car) => car.sku),
  ownedTracks: tracks.filter((track) => track.default).map((track) => track.pkgid),
  favouriteSeries: [],
  favouriteCars: [],
  favouriteTracks: [],
  sort: { key: 'licence', order: 'asc' },
  columns: availableColumns.filter((column) => column.default === true).map((column) => column.id),
  firebaseSynced: false,
};

const LEGACY_STORAGE_KEY = 'iracing-state';

export default function settings(initState: SettingOptions, { type, payload }): SettingOptions {
  let state = initState;
  if (initState === undefined) {
    const legacyStored = window.localStorage.getItem(LEGACY_STORAGE_KEY);

    if (legacyStored) {
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    }

    state = legacyStored ? JSON.parse(legacyStored) : defaultSettings;
  }

  if (type === localStorageActionTypes.INIT) {
    if (!payload) {
      return state;
    }

    const persistedStateSettings = { ...payload.settings };

    persistedStateSettings.ownedCars = uniq([
      ...persistedStateSettings.ownedCars,
      ...defaultSettings.ownedCars,
    ]);

    persistedStateSettings.ownedTracks = uniq([
      ...persistedStateSettings.ownedTracks,
      ...defaultSettings.ownedTracks,
    ]);

    return { ...state, ...persistedStateSettings };
  }

  if (type === UPDATE_FILTERS) {
    return { ...state, filters: payload.filters, firebaseSynced: false };
  }

  if (type === RESET_FILTERS) {
    return { ...state, filters: defaultFilters, firebaseSynced: false };
  }

  if (type === RESET_SETTINGS || type === SIGNED_OUT) {
    return { ...defaultSettings, firebaseSynced: false };
  }

  if (type === UPDATE_SETTING) {
    return { ...state, [payload.key]: payload.value, firebaseSynced: false };
  }

  if (type === LOAD_SETTINGS_FROM_FIREBASE) {
    return { ...state, ...defaultSettings, ...payload, firebaseSynced: true };
  }

  if (type === FIREBASE_SYNCED) {
    return { ...state, firebaseSynced: true };
  }

  return state;
}
