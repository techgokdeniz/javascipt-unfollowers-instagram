import instagramLib from "./lib/InstagramLib.js";
import config from "./config.dev.js";

(async function () {
  console.log(config);

  const instagram = new instagramLib(config.UserID, config.Sessionid);
  const anotherProfileID = await instagram.getAnotherUserID("gokdenizcetin");
  const followers = await instagram.getFollowersData(config.UserID);
  console.log(anotherProfileID, followers);
})();
