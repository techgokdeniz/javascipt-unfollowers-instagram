import encryptPassword from "./helperFunc.js";

const generatePassword = async (appId, keyId, pubKey, password) => {
  const APP_ID = appId;
  const KEY_ID = keyId;
  const PUBLIC_KEY = pubKey;
  const PASSWORD = password;
  const time = Math.floor(Date.now() / 1000).toString();

  try {
    let result = await encryptPassword(
      APP_ID,
      KEY_ID,
      PUBLIC_KEY,
      PASSWORD,
      time
    );
    const response = {
      statusCode: 200,
      body: result,
      decodeBody: decodeURIComponent(result),
    };
    return response;
  } catch (e) {
    console.log(e);
  }
};

export default generatePassword;
