import * as SecureStore from 'expo-secure-store';

/**
 * Save a key-value pair securely
 * @param {string} key
 * @param {string} value
 */

export const saveToSecureStore = async (key, value) => {
  try {
    await SecureStore.setItemAsync(key, value, {
      keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK, // iOS specific
      // For Android, SecureStore uses the equivalent secure storage
    });
    console.log(`Saved ${key} to SecureStore`);
  } catch (error) {
    console.error(`Error saving ${key} to SecureStore`, error);
  }
};

/**
 * Retrieve a value by key from secure storage
 * @param {string} key
 * @returns {Promise<string | null>}
 */

export const getFromSecureStore = async (key) => {
  try {
    const result = await SecureStore.getItemAsync(key);
    return result;
  } catch (error) {
    console.error(`Error retrieving ${key} from SecureStore`, error);
    return null;
  }
};

/**
 * Delete a key-value pair from secure storage
 * @param {string} key
 */
export const deleteFromSecureStore = async (key) => {
  try {
    await SecureStore.deleteItemAsync(key);
    console.log(`Deleted ${key} from SecureStore`);
  } catch (error) {
    console.error(`Error deleting ${key} from SecureStore`, error);
  }
};

