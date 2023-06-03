import instagramLib from "./lib/InstagramLib.js";
import config from "./config.dev.js";

(async function () {
  console.log(config);

  const instagram = new instagramLib(config.UserID, config.Sessionid);
  // const anotherProfileID = await instagram.getAnotherUserID("gokdenizcetin");
  // const followers = await instagram.getFollowersData(config.UserID);
  // console.log(anotherProfileID, followers);

  let version = "10";
  let app_id = 226;
  let public_key =
    "22c4c15c82c24d392668ee454f7c40326529e973c4d4d67cf697c23a7760f90c";
  let password = "test";

  const encodedPassword = await instagram.encodePassword(
    version,
    app_id,
    public_key,
    password
  );

  console.log(encodedPassword);
})();
