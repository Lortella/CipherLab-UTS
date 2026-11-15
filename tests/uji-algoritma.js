const fs = require("fs");
const vm = require("vm");
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync("assets/js/cipher.js", "utf8"), context);
const C = context.window.CipherLab;

const tests = [
  ["Caesar", new C.CaesarCipher(), "HELLO", [3], "KHOOR"],
  ["Vigenère", new C.VigenereCipher(), "HELLO", ["KEY"], "RIJVS"],
  ["Atbash", new C.AtbashCipher(), "HELLO", [], "SVOOL"],
  ["Affine", new C.AffineCipher(), "HELLO", [5, 8], "RCLLA"],
  ["Rail Fence", new C.RailFenceCipher(), "WEAREDISCOVERED", [3], "WECRERDSOEEAIVD"],
  ["Columnar", new C.ColumnarCipher(), "WEAREDISCOVERED", ["ZEBRA"], "EODASREIERCEWDV"]
];

let failed = 0;
for (const [name, cipher, plaintext, keys, expected] of tests) {
  const encrypted = cipher.encrypt(plaintext, ...keys);
  const decrypted = cipher.decrypt(encrypted, ...keys);
  const passed = encrypted === expected && decrypted === plaintext;
  console.log(`${passed ? "LULUS" : "GAGAL"} — ${name}: ${encrypted}`);
  if (!passed) failed++;
}
if (failed) process.exit(1);
console.log(`\n${tests.length - failed}/${tests.length} algoritma lulus uji enkripsi dan dekripsi.`);
