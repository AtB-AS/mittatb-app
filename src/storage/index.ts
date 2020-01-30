import LegacyStorage from '@react-native-community/async-storage-backend-legacy';
import AsyncStorageFactory from '@react-native-community/async-storage';
import {UserLocations} from '../AppContext';

type StorageModel = {
  stored_user_locations: UserLocations;
};

const legacyStorage = new LegacyStorage();

const storage = AsyncStorageFactory.create<StorageModel>(legacyStorage, {
  errorHandler: err => console.log(err),
  logger: action => console.log(action),
});

export default storage;
