import AsyncStorage from '@react-native-async-storage/async-storage';

export const getStringValue = async (key) => {
    try {
        return await AsyncStorage.getItem(key)
    } catch(e) {
        return ""
    }
}

export const getObjectValue = async (key) => { 
    try {
        const value = await AsyncStorage.getItem(key)
        if(value !== null) {
            return JSON.parse(value)
        }
        return {}
    } catch(e) {
        return {}
    }
}


export const storeObject = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(key, jsonValue)
    } catch (e) {
        console.log(e)
    }
}

export const storeString = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value)
    } catch (e) {
        console.log(e)
    }
}

export const multiSet = async (elements) => {
    //const firstPair = ["@MyApp_user", "value_1"]
    //const secondPair = ["@MyApp_key", "value_2"]
    try {
        await AsyncStorage.multiSet(elements)
    } catch(e) {
        console.log(e);
    }
}

export const removeOne = async (key) =>{
    try {
        await AsyncStorage.removeItem(elements)
    } catch(e) {
        console.log(e);
    }
}

export const removeAll = async () =>{
    try {
        await AsyncStorage.clear()
    } catch(e) {
        console.log(e);
    }
}