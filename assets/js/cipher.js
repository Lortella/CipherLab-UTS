/* Implementasi enam algoritma kriptografi klasik dengan konsep OOP. */
class CipherBase {
  constructor(preserveCase = true) {
    this.preserveCase = preserveCase;
  }

  transformText(text, transform) {
    return Array.from(text).map(character => {
      const code = character.charCodeAt(0);
      if (code >= 65 && code <= 90) return transform(code - 65, true);
      if (code >= 97 && code <= 122) return transform(code - 97, false);
      return character;
    }).join("");
  }

  formatLetter(index, wasUpper) {
    const letter = String.fromCharCode(((index % 26) + 26) % 26 + 65);
    return this.preserveCase && !wasUpper ? letter.toLowerCase() : letter;
  }

  validateText(text) {
    if (!text || !text.trim()) {
      throw new Error("Masukkan pesan terlebih dahulu.");
    }
  }

  mod(number, modulo = 26) {
    return ((number % modulo) + modulo) % modulo;
  }

  gcd(a, b) {
    return b === 0 ? Math.abs(a) : this.gcd(b, a % b);
  }

  modInverse(number, modulo = 26) {
    for (let candidate = 1; candidate < modulo; candidate++) {
      if (this.mod(number * candidate, modulo) === 1) return candidate;
    }
    return null;
  }
}

class CaesarCipher extends CipherBase {
  encrypt(text, key) {
    this.validateText(text);
    key = Number(key);
    if (!Number.isInteger(key)) throw new Error("Kunci pergeseran harus berupa bilangan bulat.");
    return this.transformText(text, (value, upper) => this.formatLetter(value + key, upper));
  }

  decrypt(text, key) {
    this.validateText(text);
    key = Number(key);
    if (!Number.isInteger(key)) throw new Error("Kunci pergeseran harus berupa bilangan bulat.");
    return this.transformText(text, (value, upper) => this.formatLetter(value - key, upper));
  }
}

class VigenereCipher extends CipherBase {
  process(text, key, decrypt = false) {
    this.validateText(text);
    const keyword = String(key).toUpperCase().replace(/[^A-Z]/g, "");
    if (!keyword) throw new Error("Kata kunci harus berisi huruf A sampai Z.");

    let keyPosition = 0;
    return this.transformText(text, (value, upper) => {
      const shift = keyword.charCodeAt(keyPosition++ % keyword.length) - 65;
      return this.formatLetter(value + (decrypt ? -shift : shift), upper);
    });
  }

  encrypt(text, key) { return this.process(text, key, false); }
  decrypt(text, key) { return this.process(text, key, true); }
}

class AtbashCipher extends CipherBase {
  encrypt(text) {
    this.validateText(text);
    return this.transformText(text, (value, upper) => this.formatLetter(25 - value, upper));
  }

  decrypt(text) {
    return this.encrypt(text);
  }
}

class AffineCipher extends CipherBase {
  validateKeys(a, b) {
    a = Number(a);
    b = Number(b);
    if (!Number.isInteger(a) || !Number.isInteger(b)) {
      throw new Error("Kunci a dan b harus berupa bilangan bulat.");
    }
    if (this.gcd(a, 26) !== 1) {
      throw new Error("Nilai a harus relatif prima terhadap 26. Contoh nilai yang bisa dipakai: 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, atau 25.");
    }
    const normalizedA = this.mod(a);
    return { a: normalizedA, b: this.mod(b), inverse: this.modInverse(normalizedA) };
  }

  encrypt(text, a, b) {
    this.validateText(text);
    const key = this.validateKeys(a, b);
    return this.transformText(text, (value, upper) => this.formatLetter(key.a * value + key.b, upper));
  }

  decrypt(text, a, b) {
    this.validateText(text);
    const key = this.validateKeys(a, b);
    return this.transformText(text, (value, upper) => this.formatLetter(key.inverse * (value - key.b), upper));
  }
}

class RailFenceCipher extends CipherBase {
  validateRails(rails) {
    rails = Number(rails);
    if (!Number.isInteger(rails) || rails < 2 || rails > 100) {
      throw new Error("Jumlah baris zigzag harus berupa bilangan bulat antara 2 sampai 100.");
    }
    return rails;
  }

  createPattern(length, rails) {
    const pattern = [];
    let row = 0;
    let direction = 1;

    for (let i = 0; i < length; i++) {
      pattern.push(row);
      if (row === 0) direction = 1;
      else if (row === rails - 1) direction = -1;
      row += direction;
    }
    return pattern;
  }

  encrypt(text, rails) {
    this.validateText(text);
    rails = this.validateRails(rails);
    const rows = Array.from({ length: rails }, () => []);
    this.createPattern(Array.from(text).length, rails).forEach((row, index) => {
      rows[row].push(Array.from(text)[index]);
    });
    return rows.flat().join("");
  }

  decrypt(text, rails) {
    this.validateText(text);
    rails = this.validateRails(rails);
    const characters = Array.from(text);
    const pattern = this.createPattern(characters.length, rails);
    const rowLengths = Array(rails).fill(0);
    pattern.forEach(row => rowLengths[row]++);

    const rows = [];
    let offset = 0;
    rowLengths.forEach(length => {
      rows.push(characters.slice(offset, offset + length));
      offset += length;
    });

    const rowIndexes = Array(rails).fill(0);
    return pattern.map(row => rows[row][rowIndexes[row]++]).join("");
  }
}

class ColumnarCipher extends CipherBase {
  cleanKey(key) {
    const keyword = String(key).toUpperCase().replace(/[^A-Z]/g, "");
    if (!keyword) throw new Error("Kata kunci harus berisi huruf A sampai Z.");
    return keyword;
  }

  getColumnOrder(keyword) {
    return Array.from(keyword)
      .map((character, index) => ({ character, index }))
      .sort((a, b) => a.character.localeCompare(b.character) || a.index - b.index)
      .map(item => item.index);
  }

  encrypt(text, key) {
    this.validateText(text);
    const keyword = this.cleanKey(key);
    const characters = Array.from(text);
    const columns = keyword.length;
    const rowCount = Math.ceil(characters.length / columns);
    const grid = Array.from({ length: rowCount }, (_, row) =>
      characters.slice(row * columns, (row + 1) * columns)
    );

    return this.getColumnOrder(keyword)
      .map(column => grid.map(row => row[column] ?? "").join(""))
      .join("");
  }

  decrypt(text, key) {
    this.validateText(text);
    const keyword = this.cleanKey(key);
    const characters = Array.from(text);
    const columns = keyword.length;
    const rowCount = Math.ceil(characters.length / columns);
    const remainder = characters.length % columns;
    const columnLengths = Array.from({ length: columns }, (_, column) =>
      remainder === 0 || column < remainder ? rowCount : rowCount - 1
    );

    const gridColumns = Array(columns);
    let offset = 0;
    this.getColumnOrder(keyword).forEach(column => {
      const length = columnLengths[column];
      gridColumns[column] = characters.slice(offset, offset + length);
      offset += length;
    });

    let output = "";
    for (let row = 0; row < rowCount; row++) {
      for (let column = 0; column < columns; column++) {
        if (gridColumns[column][row] !== undefined) output += gridColumns[column][row];
      }
    }
    return output;
  }
}

window.CipherLab = {
  CaesarCipher,
  VigenereCipher,
  AtbashCipher,
  AffineCipher,
  RailFenceCipher,
  ColumnarCipher
};
