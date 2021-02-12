import AsyncStorage from '@react-native-community/async-storage';

export const setSession = async Value => {
  await AsyncStorage.setItem('Session', Value);
};
export const getSession = async () => {
  return await AsyncStorage.getItem('Session');
};

export const setUserId = async Value => {
  await AsyncStorage.setItem('UserId', Value);
};

export const getUserId = async () => {
  return await AsyncStorage.getItem('UserId');
};

export const setMainUrl = async Value => {
  await AsyncStorage.setItem('mainUrl', Value);
};

export const getMainUrl = async () => {
  return await AsyncStorage.getItem('mainUrl');
};

export const setScreen = async Value => {
  await AsyncStorage.setItem('screen', Value);
};

export const getScreen = async () => {
  return await AsyncStorage.getItem('screen');
};

export const setRoleId = async Value => {
  await AsyncStorage.setItem('RoleId', Value);
};

export const getRoleId = async () => {
  return await AsyncStorage.getItem('RoleId');
};

export const setRoleAccess = async Value => {
  await AsyncStorage.setItem('RoleAccess', Value);
};

export const getRoleAccess = async () => {
  return await AsyncStorage.getItem('RoleAccess');
};

export const setUserName = async Value => {
  await AsyncStorage.setItem('UserName', Value);
};
export const getUserName = async () => {
  return await AsyncStorage.getItem('UserName');
};

export const setUserEmail = async Value => {
  await AsyncStorage.setItem('UserEmail', Value);
};
export const getUserEmail = async () => {
  return await AsyncStorage.getItem('UserEmail');
};

export const setSOSEmail = async Value => {
  await AsyncStorage.setItem('SosEmail', Value);
};
export const getSOSEmail = async () => {
  return await AsyncStorage.getItem('SosEmail');
};

export const setSOSCall = async Value => {
  await AsyncStorage.setItem('SosCall', Value);
};
export const getSOSCall = async () => {
  return await AsyncStorage.getItem('SosCall');
};

export const setOrgId = async Value => {
  await AsyncStorage.setItem('OrgId', Value);
};
export const getOrgId = async () => {
  return await AsyncStorage.getItem('OrgId');
};

export const setSubDomain = async Value => {
  await AsyncStorage.setItem('SubDomain', Value);
};
export const getSubDomain = async () => {
  return await AsyncStorage.getItem('SubDomain');
};

export const setBaseUrl = async Value => {
  await AsyncStorage.setItem('BaseUrl', Value);
};
export const getBaseUrl = async () => {
  return await AsyncStorage.getItem('BaseUrl');
};

export const setRole = async Value => {
  await AsyncStorage.setItem('Role', Value);
};
export const getRole = async () => {
  return await AsyncStorage.getItem('Role');
};

export const setRefreshToken = async Value => {
  await AsyncStorage.setItem('RefreshToken', Value);
};

export const getRefreshToken = async () => {
  return await AsyncStorage.getItem('RefreshToken');
};

export const saveData = async (key, state) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(state));
    return true;
  } catch (error) {
    // Error saving data
    return false;
  }
};

export const _retrieveData = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // We have data!!
      let val = JSON.parse(value);
      return val;
    }
  } catch (error) {
    // Error retrieving data
    return undefined;
  }
};
