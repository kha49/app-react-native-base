import mushroom from 'mushroomjs-auth';
import AsyncStorage from "@react-native-async-storage/async-storage";

('use strict');

// --------- helper methods ------------

async function saveToken(rootApiUrl, token, permanent) {
  try {
      await deleteToken(rootApiUrl);
      //console.log("deleted Token");
      //console.log("call setStorageItem(%o, %o)", "mushroom.tokens[" + rootApiUrl + "]", token);
      await setStorageItem("mushroom.tokens[" + rootApiUrl + "]", token);
      //console.log("set Token");
      //var s = await getStorageItem("mushroom.tokens[" + rootApiUrl + "]");
      //console.log("getStorageItem: token=" + s);
      if (!permanent)
          await setStorageItem("mushroom.tokens[" + rootApiUrl + "].expired", new Date().getTime() + mushroom.$auth.expiredTime * 60000 + "");
  }
  catch (ex) {
      console.warn(ex);
  }
}

async function deleteToken(rootApiUrl) {
  await removeStorageItem("mushroom.tokens[" + rootApiUrl + "]");
  await removeStorageItem("mushroom.tokens[" + rootApiUrl + "].expired");
}

async function setStorageItem(key, value) {
  if (value !== null && value !== undefined && typeof value !== "string") {
      value = value.toString();
  }

  await AsyncStorage.setItem(key, value);
}

async function removeStorageItem(key) {
  return await AsyncStorage.removeItem(key);
}

mushroom.$auth.loginAsync = (account, password, remember) => {
  var rootApiUrl = mushroom._fnGetRootApiUrl();

  return mushroom
    .__createAsyncRestFunction({
      name: '$auth.loginAsync',
      method: 'POST',
      blankBody: false,
      url: rootApiUrl + 'auth/login',
    })({
      account: account,
      password: password,
    })
    .then(response => {
      //console.log("login success, response: %o", response);
      console.log("response.result.token",response);
      tokenPool[rootApiUrl] = response.result.token;
      try {
        saveToken(rootApiUrl, tokenPool[rootApiUrl], remember);
      } catch (e) {
        console.warn('Cannot save token: %o', e);
      }

      fireEvent('loggedin');

      return response;
    });
};
mushroom.$auth.logoutAsync = options => {
  if (typeof options === 'boolean') {
    options = {
      mode: options ? 'invalidAllSession' : 'invalidServerSession',
    };
  } else if (typeof options !== 'object' || options === null) {
    options = {
      mode: 'invalidServerSession',
    };
  }

  if (
    options.mode !== 'invalidClientSession' &&
    options.mode !== 'invalidServerSession' &&
    options.mode !== 'invalidAllSession'
  ) {
    options.mode = 'invalidServerSession';
  }

  // mode: invalidClientSession, invalidServerSession, invalidAllSession

  var rootApiUrl = mushroom._fnGetRootApiUrl();
  console.log("invalidClientSession", options);
  if (options.mode === 'invalidClientSession') {
    
    delete tokenPool[rootApiUrl];
    return new Promise(resolve => {
      deleteToken(rootApiUrl);
      if (mushroom.$cache) mushroom.$cache.invalid();
      resolve({code: 0});
    });
  } else
    return mushroom
      .__createAsyncRestFunction({
        name: '$auth.logoutAsync',
        method: 'GET',
        blankBody: false,
        url:
          rootApiUrl +
          'auth/logout' +
          (options.mode === 'invalidAllSession'
            ? '?invalidAllSession=true'
            : ''),
      })()
      .then(x => {
        delete tokenPool[rootApiUrl];
        deleteToken(rootApiUrl);
        if (mushroom.$cache) mushroom.$cache.invalid();
        fireEvent('loggedout');
        return x;
      })
      .catch(err => {
        delete tokenPool[rootApiUrl];
        deleteToken(rootApiUrl);
        if (mushroom.$cache) mushroom.$cache.invalid();
        throw err;
      });
};

export default mushroom;
