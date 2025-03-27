import AsyncStorage from '@react-native-async-storage/async-storage';

export const asyncStorage_setItem = async (key, value) => {
    try {
        console.log(`AsyncStorage/setItem:  ${key} ${JSON.stringify(value)}`);
        await AsyncStorage.setItem(key, JSON.stringify(value));
        console.log("Data saved");
    } catch (error) {
        console.error("Error saving data", error);
    }
};

export const asyncStorage_getItem = async (key) => {
    try {
        console.log("AsyncStorage/getItem: ", key);
        const value = await AsyncStorage.getItem(key);
        // console.log("return ", value);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        console.error("Error fetching data", error);
        return null;
    }
};

export const asyncStorage_removeItem = async (key) => {
    try {
        console.log("AsyncStorage/removeItem: ", key);
        await AsyncStorage.removeItem(key);
        console.log("Data removed");
    } catch (error) {
        console.error("Error removing data", error);
    }
};
