/* Pengatur tampilan, navigasi, dan proses aplikasi CipherLab. */
(() => {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];

  const algorithms = {
    caesar: {
      name: "Caesar Cipher",
      type: "Substitusi",
      description: "Setiap huruf digeser beberapa langkah dengan jumlah yang sama.",
      short: "Menggeser setiap huruf dengan nilai pergeseran yang tetap.",
      formula: "Enkripsi: C = (P + k) mod 26\nDekripsi: P = (C − k) mod 26",
      steps: [
        "Ubah huruf menjadi angka: A = 0, B = 1, sampai Z = 25.",
        "Tentukan nilai k sebagai jumlah pergeseran.",
        "Contoh huruf H: H bernilai 7. Dengan k = 3, hitung (7 + 3) mod 26 = 10.",
        "Angka 10 adalah huruf K. Jadi setiap huruf digeser tiga posisi; HELLO menjadi KHOOR.",
        "Untuk dekripsi, kurangi nilai huruf teks sandi dengan k. Contohnya K (10) − 3 = 7, yaitu H."
      ],
      explanation: "Caesar Cipher menggeser setiap huruf dengan jumlah langkah yang sama. Kuncinya berupa angka pergeseran. Kalau kuncinya 3, A berubah menjadi D, B menjadi E, dan seterusnya."
    },
    vigenere: {
      name: "Vigenère Cipher",
      type: "Substitusi",
      description: "Pergeseran huruf mengikuti kata kunci yang diulang sepanjang pesan.",
      short: "Menggunakan kata kunci berulang sehingga setiap huruf bisa mendapat pergeseran berbeda.",
      formula: "Enkripsi: Cᵢ = (Pᵢ + Kᵢ) mod 26\nDekripsi: Pᵢ = (Cᵢ − Kᵢ) mod 26",
      steps: [
        "Ubah huruf menjadi angka: A = 0 sampai Z = 25.",
        "Tulis kata kunci berulang tepat di bawah pesan. Contoh: pesan HELLO, kunci KEYKEY, gunakan KEYKE.",
        "Hitung tiap pasangan huruf. H (7) + K (10) = 17, yaitu R.",
        "E (4) + E (4) = 8, yaitu I. L (11) + Y (24) = 35 mod 26 = 9, yaitu J.",
        "L (11) + K (10) = 21, yaitu V. O (14) + E (4) = 18, yaitu S. Hasil akhirnya RIJVS.",
        "Untuk dekripsi, kurangi angka teks sandi dengan angka kunci pada posisi yang sama."
      ],
      explanation: "Vigenère memakai kata kunci sebagai penentu pergeseran. Kunci diulang sampai panjangnya sama dengan pesan. Karena nilai pergeserannya berubah-ubah, hasilnya tidak sesederhana Caesar Cipher."
    },
    atbash: {
      name: "Atbash Cipher",
      type: "Substitusi",
      description: "Memasangkan huruf dari dua ujung alfabet yang berlawanan.",
      short: "Membalik urutan alfabet: A menjadi Z, B menjadi Y, dan seterusnya.",
      formula: "Enkripsi dan dekripsi: C = 25 − P",
      steps: [
        "Pasangkan alfabet dari arah berlawanan: A dengan Z, B dengan Y, C dengan X, dan seterusnya.",
        "Ubah huruf menjadi angka A = 0 sampai Z = 25.",
        "Contoh huruf H bernilai 7. Hitung 25 − 7 = 18.",
        "Angka 18 adalah huruf S. Dengan cara yang sama, HELLO berubah menjadi SVOOL.",
        "Proses dekripsi sama persis dengan enkripsi karena setiap pasangan huruf saling menggantikan."
      ],
      explanation: "Atbash tidak membutuhkan kunci. Huruf cukup ditukar dengan pasangannya dari ujung alfabet yang berlawanan. Karena prosesnya bolak-balik, cara yang sama bisa dipakai untuk enkripsi dan dekripsi."
    },
    affine: {
      name: "Affine Cipher",
      type: "Substitusi",
      description: "Mengubah huruf dengan operasi perkalian dan penjumlahan modulo 26.",
      short: "Menggunakan dua kunci angka, yaitu pengali a dan pergeseran b.",
      formula: "Enkripsi: C = (aP + b) mod 26\nDekripsi: P = a⁻¹(C − b) mod 26",
      steps: [
        "Ubah huruf menjadi angka A = 0 sampai Z = 25.",
        "Pilih dua kunci, a dan b. Nilai a harus relatif prima terhadap 26 agar memiliki invers modulo.",
        "Contoh gunakan a = 5, b = 8, dan huruf H = 7.",
        "Masukkan ke rumus: C = (5 × 7 + 8) mod 26 = 43 mod 26 = 17.",
        "Angka 17 adalah huruf R. Jadi H dienkripsi menjadi R.",
        "Untuk dekripsi, invers 5 modulo 26 adalah 21 karena (5 × 21) mod 26 = 1. Hitung P = 21 × (17 − 8) mod 26 = 189 mod 26 = 7, yaitu H."
      ],
      explanation: "Affine Cipher memakai dua kunci angka. Kunci a digunakan untuk perkalian, sedangkan b untuk penjumlahan. Saat dekripsi, kita perlu mencari invers modulo dari a."
    },
    railfence: {
      name: "Rail Fence Cipher",
      type: "Transposisi",
      description: "Menulis pesan secara zigzag pada beberapa baris, lalu membacanya per baris.",
      short: "Tidak mengganti hurufnya, tetapi mengubah posisi huruf dengan pola zigzag.",
      formula: "Tidak memakai rumus substitusi huruf.\nKunci = jumlah baris (rail).",
      steps: [
        "Gunakan contoh pesan WEAREDISCOVERED dengan kunci 3 baris.",
        "Tulis huruf bergantian ke bawah dan ke atas membentuk pola zigzag.",
        "Baris pertama berisi WECR, baris kedua ERDSOEE, dan baris ketiga AIVD.",
        "Baca isi baris dari atas ke bawah: WECR + ERDSOEE + AIVD.",
        "Teks sandi yang dihasilkan adalah WECRERDSOEEAIVD.",
        "Untuk dekripsi, buat pola zigzag dengan panjang teks sandi, isi tiap baris sesuai jumlah hurufnya, lalu baca mengikuti jalur zigzag."
      ],
      explanation: "Rail Fence termasuk transposisi. Artinya, huruf tidak diganti menjadi huruf lain. Posisi hurufnya saja yang diatur ulang mengikuti pola zigzag."
    },
    columnar: {
      name: "Columnar Transposition",
      type: "Transposisi",
      description: "Menyusun pesan dalam tabel, lalu membaca kolom sesuai urutan alfabetis kata kunci.",
      short: "Pesan ditulis per baris, kemudian kolom dibaca berdasarkan urutan huruf pada kunci.",
      formula: "Kunci menentukan urutan pembacaan kolom.\nHuruf pesan tidak diganti, hanya dipindahkan posisinya.",
      steps: [
        "Gunakan pesan WEAREDISCOVERED dan kunci ZEBRA. Karena panjang kunci 5, tabel memiliki 5 kolom.",
        "Isi tabel per baris: WEARE / DISCO / VERED.",
        "Tulis posisi kunci: Z(0), E(1), B(2), R(3), A(4). Urutan alfabetisnya adalah A(4), B(2), E(1), R(3), Z(0).",
        "Baca kolom sesuai urutan tersebut: kolom A menghasilkan EOD, B menghasilkan ASR, E menghasilkan EIE, R menghasilkan RCE, dan Z menghasilkan WDV.",
        "Gabungkan hasil kolom: EOD + ASR + EIE + RCE + WDV = EODASREIERCEWDV.",
        "Dekripsi dilakukan dengan membagi teks sandi kembali ke kolom sesuai panjang masing-masing, menyusun kolom menurut posisi kunci semula, lalu membaca tabel per baris.",
        "Catatan: jika ada huruf kunci yang sama, urutannya mengikuti posisi dari kiri ke kanan."
      ],
      explanation: "Columnar Transposition mengubah urutan posisi karakter. Pesan ditulis dalam tabel, lalu kolomnya dibaca mengikuti urutan alfabetis huruf pada kata kunci."
    }
  };

  const cipherClasses = {
    caesar: "CaesarCipher",
    vigenere: "VigenereCipher",
    atbash: "AtbashCipher",
    affine: "AffineCipher",
    railfence: "RailFenceCipher",
    columnar: "ColumnarCipher"
  };

  const pageNames = {
    dashboard: "Dasbor",
    laboratory: "Laboratorium Sandi",
    algorithms: "Daftar Algoritma",
    history: "Riwayat Proses",
    about: "Tentang Aplikasi"
  };

  let operation = "encrypt";
  let activeFilter = "all";
  let lastResult = "";

  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2500);
  }

  function navigate(page) {
    $$(".page").forEach(section => section.classList.toggle("active", section.id === `page-${page}`));
    $$(".nav-item").forEach(button => button.classList.toggle("active", button.dataset.page === page));
    $("#pageTitle").textContent = pageNames[page] || "Dasbor";
    $("#sidebar").classList.remove("open");
    if (page === "history") renderHistory();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function createCard(key) {
    const item = algorithms[key];
    const number = String(Object.keys(algorithms).indexOf(key) + 1).padStart(2, "0");
    const typeClass = item.type === "Transposisi" ? "transposisi" : "substitusi";
    return `
      <article class="algorithm-card">
        <div class="card-top">
          <span class="algorithm-number">${number}</span>
          <span class="type-tag ${typeClass}">${item.type}</span>
        </div>
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="card-actions">
          <button class="card-link" data-detail="${key}">Lihat cara hitung ↓</button>
          <button class="card-link" data-use="${key}">Coba sekarang ↗</button>
        </div>
      </article>`;
  }

  function renderCards() {
    $("#dashboardAlgorithms").innerHTML = ["caesar", "vigenere", "atbash"].map(createCard).join("");
    const visibleKeys = Object.keys(algorithms).filter(key =>
      activeFilter === "all" || algorithms[key].type.toLowerCase() === activeFilter
    );
    $("#algorithmLibrary").innerHTML = visibleKeys.map(createCard).join("");
  }

  function renderAlgorithmDetails(key) {
    const item = algorithms[key];
    const steps = item.steps.map(step => `<li>${escapeHtml(step)}</li>`).join("");
    $("#algorithmDetails").innerHTML = `
      <article class="panel detail-panel">
        <div class="detail-topline"><span class="panel-kicker">PENJELASAN DAN CONTOH PERHITUNGAN</span><span class="type-tag ${item.type === "Transposisi" ? "transposisi" : "substitusi"}">${item.type}</span></div>
        <h2>${item.name}</h2>
        <p>${item.description}</p>
        <div class="calculation">${escapeHtml(item.formula)}</div>
        <p class="notation"><strong>Arti simbol:</strong> P = nilai huruf pada pesan asli, C = nilai huruf hasil enkripsi, k/a/b = kunci, dan mod 26 = sisa pembagian dengan 26.</p>
        <h3>Langkah perhitungan</h3>
        <ol>${steps}</ol>
        <button class="btn btn-primary" data-use="${key}">Coba algoritma ini ↗</button>
      </article>`;
  }

  function renderKeyFields() {
    const key = $("#algorithmSelect").value;
    const item = algorithms[key];
    $("#algorithmHint").textContent = item.short;
    $("#cipherExplanation").textContent = `${item.explanation} ${item.formula.replaceAll("\\n", " | ")}`;

    const fields = {
      caesar: [{ id: "shift", label: "Jumlah pergeseran (k)", type: "number", value: "3" }],
      vigenere: [{ id: "keyword", label: "Kata kunci", type: "text", value: "KEY", placeholder: "Contoh: KEY" }],
      atbash: [],
      affine: [
        { id: "a", label: "Kunci pengali (a)", type: "number", value: "5" },
        { id: "b", label: "Kunci penjumlahan (b)", type: "number", value: "8" }
      ],
      railfence: [{ id: "rails", label: "Jumlah baris zigzag", type: "number", value: "3", min: "2", max: "100" }],
      columnar: [{ id: "keyword", label: "Kata kunci", type: "text", value: "ZEBRA", placeholder: "Contoh: ZEBRA" }]
    }[key];

    $("#keyFields").innerHTML = fields.length
      ? fields.map(field => `
          <div class="field-row">
            <label class="field-label" for="key-${field.id}">${field.label}</label>
            <input class="control" id="key-${field.id}" type="${field.type}" value="${field.value}"
              ${field.min ? `min="${field.min}"` : ""} ${field.max ? `max="${field.max}"` : ""}
              ${field.placeholder ? `placeholder="${field.placeholder}"` : ""} autocomplete="off">
          </div>`).join("")
      : `<div class="no-key">✓ Algoritma ini tidak membutuhkan kunci.</div>`;
  }

  function getKeyValues() {
    const key = $("#algorithmSelect").value;
    if (key === "caesar") return [$("#key-shift").value];
    if (key === "vigenere" || key === "columnar") return [$("#key-keyword").value];
    if (key === "affine") return [$("#key-a").value, $("#key-b").value];
    if (key === "railfence") return [$("#key-rails").value];
    return [];
  }

  function runCipher() {
    const key = $("#algorithmSelect").value;
    const source = $("#sourceText").value;

    try {
      const CipherClass = window.CipherLab[cipherClasses[key]];
      const cipher = new CipherClass($("#preserveCase").checked);
      const keys = getKeyValues();
      const result = operation === "encrypt"
        ? cipher.encrypt(source, ...keys)
        : cipher.decrypt(source, ...keys);

      lastResult = result;
      $("#resultText").textContent = result;
      $("#resultText").classList.add("has-result");
      $("#resultStatus").textContent = operation === "encrypt" ? "ENKRIPSI BERHASIL" : "DEKRIPSI BERHASIL";
      $("#resultStatus").classList.add("success-status");
      $("#resultMeta").textContent = `${algorithms[key].name} · ${result.length} karakter`;
      $("#copyResult").disabled = false;

      const records = readHistory();
      records.unshift({
        operation,
        algorithm: algorithms[key].name,
        input: source,
        output: result,
        time: new Date().toISOString()
      });
      localStorage.setItem("cipherlab_history", JSON.stringify(records.slice(0, 100)));
      showToast("Proses berhasil dijalankan.");
    } catch (error) {
      lastResult = "";
      $("#resultText").textContent = error.message;
      $("#resultText").classList.remove("has-result");
      $("#resultStatus").textContent = "ADA YANG PERLU DIPERIKSA";
      $("#resultStatus").classList.remove("success-status");
      $("#resultMeta").textContent = "Periksa pesan dan kunci yang dimasukkan.";
      $("#copyResult").disabled = true;
      showToast(error.message);
    }
  }

  function readHistory() {
    try {
      const records = JSON.parse(localStorage.getItem("cipherlab_history") || "[]");
      return Array.isArray(records) ? records : [];
    } catch {
      return [];
    }
  }

  function renderHistory() {
    const records = readHistory();
    const container = $("#historyList");

    if (!records.length) {
      container.innerHTML = `
        <div class="empty-state"><span>◷</span><strong>Belum ada riwayat</strong>
        <p>Proses yang kamu jalankan nanti akan muncul di sini.</p></div>`;
      return;
    }

    container.innerHTML = records.map((record, index) => {
      const isEncryption = record.operation === "encrypt";
      const operationLabel = isEncryption ? "ENKRIPSI" : "DEKRIPSI";
      const operationClass = isEncryption ? "" : "decryption";
      const date = new Date(record.time).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
      return `
        <div class="history-row">
          <span><b class="history-operation ${operationClass}">${operationLabel}</b></span>
          <span>${escapeHtml(record.algorithm)}</span>
          <span class="history-message"><strong>${escapeHtml(record.input.slice(0, 34))}${record.input.length > 34 ? "…" : ""}</strong>
          <small>Hasil: ${escapeHtml(record.output.slice(0, 42))}${record.output.length > 42 ? "…" : ""}</small></span>
          <span class="history-time">${date}<button class="history-reuse" data-reuse="${index}">Pakai lagi ↗</button></span>
        </div>`;
    }).join("");
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[character]);
  }

  function updateCharacterCount() {
    $("#charCount").textContent = `${$("#sourceText").value.length} karakter`;
  }

  function setOperation(value) {
    operation = value;
    $$("#operationSegment button").forEach(button =>
      button.classList.toggle("selected", button.dataset.operation === value)
    );
    $("#runCipher").innerHTML = `${value === "encrypt" ? "Jalankan Enkripsi" : "Jalankan Dekripsi"} <span>→</span>`;
  }

  document.addEventListener("click", event => {
    const pageButton = event.target.closest("[data-page]");
    if (pageButton) {
      event.preventDefault();
      navigate(pageButton.dataset.page);
    }

    const goButton = event.target.closest("[data-go]");
    if (goButton) navigate(goButton.dataset.go);

    const useButton = event.target.closest("[data-use]");
    if (useButton) {
      navigate("laboratory");
      $("#algorithmSelect").value = useButton.dataset.use;
      renderKeyFields();
    }

    const operationButton = event.target.closest("[data-operation]");
    if (operationButton) setOperation(operationButton.dataset.operation);

    const detailButton = event.target.closest("[data-detail]");
    if (detailButton) {
      renderAlgorithmDetails(detailButton.dataset.detail);
      $("#algorithmDetails").scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    const filterButton = event.target.closest("[data-filter]");
    if (filterButton) {
      activeFilter = filterButton.dataset.filter;
      $$("#algorithmFilters button").forEach(button =>
        button.classList.toggle("selected", button === filterButton)
      );
      renderCards();
    }

    const reuseButton = event.target.closest("[data-reuse]");
    if (reuseButton) {
      const record = readHistory()[Number(reuseButton.dataset.reuse)];
      if (!record) return;
      $("#sourceText").value = record.input;
      const matchingKey = Object.keys(algorithms).find(key => algorithms[key].name === record.algorithm);
      $("#algorithmSelect").value = matchingKey || "caesar";
      renderKeyFields();
      setOperation(record.operation);
      updateCharacterCount();
      navigate("laboratory");
      showToast("Pesan dimasukkan kembali ke laboratorium.");
    }
  });

  $("#algorithmSelect").addEventListener("change", renderKeyFields);
  $("#runCipher").addEventListener("click", runCipher);
  $("#sourceText").addEventListener("input", updateCharacterCount);

  $("#loadExample").addEventListener("click", () => {
    $("#sourceText").value = "HELLO WORLD";
    updateCharacterCount();
    showToast("Contoh pesan berhasil dimuat.");
  });

  $("#clearLab").addEventListener("click", () => {
    $("#sourceText").value = "";
    updateCharacterCount();
    lastResult = "";
    $("#resultText").textContent = "Hasil proses akan muncul di sini.";
    $("#resultText").classList.remove("has-result");
    $("#resultStatus").textContent = "MENUNGGU MASUKAN";
    $("#resultStatus").classList.remove("success-status");
    $("#resultMeta").textContent = "Belum ada proses yang dijalankan";
    $("#copyResult").disabled = true;
    showToast("Kolom berhasil dibersihkan.");
  });

  $("#copyResult").addEventListener("click", async () => {
    if (!lastResult) return;
    try {
      await navigator.clipboard.writeText(lastResult);
      showToast("Hasil berhasil disalin.");
    } catch {
      showToast("Browser tidak mengizinkan akses ke papan klip.");
    }
  });

  $("#clearHistory").addEventListener("click", () => {
    if (confirm("Yakin ingin menghapus semua riwayat proses?")) {
      localStorage.removeItem("cipherlab_history");
      renderHistory();
      showToast("Semua riwayat berhasil dihapus.");
    }
  });

  $("#themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    localStorage.setItem("cipherlab_theme", document.body.classList.contains("light-theme") ? "light" : "dark");
  });

  $("#menuToggle").addEventListener("click", () => $("#sidebar").classList.toggle("open"));

  if (localStorage.getItem("cipherlab_theme") === "light") {
    document.body.classList.add("light-theme");
  }

  renderCards();
  renderKeyFields();
  setOperation("encrypt");
  updateCharacterCount();

  console.info("CipherLab siap. Enam algoritma sandi sudah bisa digunakan.");
})();

/* Hujan karakter digital bergerak ke atas, seperti rantai kode pada film fiksi ilmiah. */
(function matrixRain() {
  const canvas = document.getElementById("matrix-bg");
  if (!canvas) return;

  const context = canvas.getContext("2d");
  const fontSize = 13;
  const characters = "アカサタナハマヤラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let width = 0;
  let height = 0;
  let columns = [];
  let animationFrame = null;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function resizeCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.ceil(width / fontSize);
    columns = Array.from({ length: count }, () => ({
      y: Math.random() * height,
      speed: .35 + Math.random() * .65,
      length: 5 + Math.floor(Math.random() * 8)
    }));
  }

  function draw() {
    context.fillStyle = "rgba(11, 16, 32, 0.16)";
    context.fillRect(0, 0, width, height);
    context.font = `${fontSize}px 'DM Mono', monospace`;
    context.textAlign = "center";

    columns.forEach((column, index) => {
      const x = index * fontSize + fontSize / 2;
      for (let trail = 0; trail < column.length; trail++) {
        const y = column.y + trail * fontSize;
        if (y < 0 || y > height) continue;

        const character = characters[Math.floor(Math.random() * characters.length)];
        const opacity = Math.max(.08, .78 - trail * .085);
        context.fillStyle = trail === 0
          ? `rgba(211, 255, 151, ${opacity})`
          : `rgba(126, 183, 57, ${opacity})`;
        context.fillText(character, x, y);
      }

      column.y -= column.speed;
      if (column.y + column.length * fontSize < 0) {
        column.y = height + Math.random() * 180;
        column.speed = .35 + Math.random() * .65;
        column.length = 5 + Math.floor(Math.random() * 8);
      }
    });

    animationFrame = requestAnimationFrame(draw);
  }

  function start() {
    if (reducedMotion.matches || document.hidden) return;
    cancelAnimationFrame(animationFrame);
    draw();
  }

  function stop() {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }

  resizeCanvas();
  start();
  window.addEventListener("resize", resizeCanvas);
  document.addEventListener("visibilitychange", () => document.hidden ? stop() : start());
  reducedMotion.addEventListener?.("change", () => reducedMotion.matches ? stop() : start());
})();


/* Intro sinematik ditampilkan setiap kali website dibuka atau dimuat ulang. */
(function cinematicIntro() {
  const intro = document.getElementById("cinematicIntro");
  if (!intro) return;

  document.body.classList.add("intro-active");

  let isClosing = false;
  let autoCloseTimer;

  function closeIntro() {
    if (isClosing) return;
    isClosing = true;
    window.clearTimeout(autoCloseTimer);
    intro.classList.add("is-exiting");
    document.body.classList.remove("intro-active");

    window.setTimeout(() => {
      intro.remove();
    }, 1050);
  }

  intro.querySelectorAll("[data-close-intro]").forEach(button => {
    button.addEventListener("click", closeIntro);
  });

  requestAnimationFrame(() => {
    intro.classList.add("is-ready");
  });

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  autoCloseTimer = window.setTimeout(closeIntro, prefersReducedMotion ? 900 : 6900);
})();
