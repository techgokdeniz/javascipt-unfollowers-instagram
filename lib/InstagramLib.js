import fetch from "node-fetch";
import generatePassword from "../helper/generatePassword.js";

class Instagram {
  constructor(userid, sessionid) {
    this.url = "https://www.instagram.com";
    this.userid = userid;
    this.sessionid = sessionid;
  }

  async getAnotherUserID(username) {
    const response = await fetch(
      `${this.url}/web/search/topsearch/?query=${username}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
          Cookie: `ds_user_id=${this.userid}; sessionid=${this.sessionid}; `,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data.users.filter((user) => user.user.username === username)[0]
        .user.pk;
    }
    return false;
  }

  async getFollowersData(userID) {
    const resp = await fetch(
      `${this.url}/graphql/query/?query_hash=3dec7e2c57367ef3da3d987d89f9dbc8&variables={"id":"${userID}","include_reel":"true","fetch_mutual":"false","first":"50"}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
          Cookie: `ds_user_id=${this.userid}; sessionid=${this.sessionid}; `,
        },
      }
    );

    if (resp.ok) {
      const data = await resp.json();
      return data.data.user.edge_follow.edges;
    } else {
      console.log(resp);
      return false;
    }
  }

  async encodePassword(version, app_id, public_key, password) {
    const resutl = await generatePassword(
      version,
      app_id,
      public_key,
      password
    );
    return resutl;
  }
}

export default Instagram;
