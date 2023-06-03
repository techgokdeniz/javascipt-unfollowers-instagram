import nodeWeb from "node-webcrypto-ossl";
const webcrypto = new nodeWeb.Crypto();
import tweetnacl from "tweetnacl";
import tweetnaclSealedbox from "tweetnacl-sealedbox-js";
tweetnacl.sealedbox = tweetnaclSealedbox;

async function encryptPassword(app_id, key_id, public_key, password, time) {
  const dec_password = await decodeUTF8(password),
    dec_time = await decodeUTF8(time),
    enc = await encrypt(key_id, public_key, dec_password, dec_time),
    enc_password = await encodeBase64(enc);
  return encodeURIComponent(
    "#PWD_INSTAGRAM_BROWSER" + ":" + app_id + ":" + time + ":" + enc_password
  );
}

async function encrypt(key_id, public_key, dec_password, dec_time) {
  const o = 100; // 36 + 16 + 48
  const u = o + dec_password.length;
  if (64 !== public_key.length) {
    throw new Error("public key is not a valid hex sting");
  }
  const w = await parseKey(public_key);
  if (!w) {
    throw new Error("public key is not a valid hex string");
  }
  const y = new Uint8Array(u);
  let f = 0;
  (y[f] = 1), (y[(f += 1)] = key_id), (f += 1);
  const p = {
    name: "AES-GCM",
    iv: new Uint8Array(12),
    additionalData: dec_time,
    tagLen: 16,
  };

  return webcrypto.subtle
    .generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      !0,
      ["encrypt", "decrypt"]
    )
    .then(function (t) {
      const n = webcrypto.subtle.exportKey("raw", t),
        o = webcrypto.subtle.encrypt(p, t, dec_password.buffer);
      return Promise.all([n, o]);
    })
    .then(function (n) {
      const o = tweetnacl.sealedbox.seal(new Uint8Array(n[0]), w);
      if (
        ((y[f] = 255 & o.length),
        (y[f + 1] = (o.length >> 8) & 255),
        (f += 2),
        y.set(o, f),
        (f += 32),
        (f += 48),
        o.length !== 32 + 48)
      )
        throw new Error("encrypted key is the wrong length");
      const s = new Uint8Array(n[1]),
        c = s.slice(-16),
        h = s.slice(0, -16);
      y.set(c, f), (f += 16), y.set(h, f);
      return y;
    })
    .catch(function (t) {
      throw t;
    });
}

function decodeUTF8(str) {
  if ("string" != typeof str) throw new TypeError("expected string");
  var t,
    o = unescape(encodeURIComponent(str)),
    c = new Uint8Array(o.length);
  for (t = 0; t < o.length; t++) c[t] = o.charCodeAt(t);
  return c;
}

function encodeBase64(str) {
  return Buffer.from(str, "binary").toString("base64");
}

function parseKey(key) {
  const n = [];
  for (let o = 0; o < key.length; o += 2)
    n.push(parseInt(key.slice(o, o + 2), 16));
  return new Uint8Array(n);
}

export default encryptPassword;
