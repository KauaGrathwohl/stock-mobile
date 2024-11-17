import { useCallback } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

type UseLocalStorageReturn = {
    setItem: (key: string, value: string) => Promise<void>;
    getItem: (key: string) => Promise<string | null>;
    removeItem: (key: string) => Promise<void>;
};

export const useLocalStorage = (): UseLocalStorageReturn => {
    const setItem = useCallback(async (key: string, value: string) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.error('Error setting item in AsyncStorage', error);
        }
    }, []);

    const getItem = useCallback(async (key: string) => {
        try {
            const value = await AsyncStorage.getItem(key);
            return value;
        } catch (error) {
            console.error('Error getting item from AsyncStorage', error);
            return null;
        }
    }, []);

    const removeItem = useCallback(async (key: string) => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing item from AsyncStorage', error);
        }
    }, []);

    return {
        setItem,
        getItem,
        removeItem
    };
};
