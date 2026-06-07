let source = undefined;
let step = 0;
const codeLength = 20;
const nextBtn = document.getElementById("nextbarcode");

function init() {
  nextBtn.addEventListener("click", nextBarcode);
}

function encode(raw, i) {
  let buff = "";
  while (raw.codePointAt(i) > 128) {
    buff += raw.substring(i, i + 1);
    i++;
  }

  const bytes = new TextEncoder().encode(buff);
  const binaryStr = String.fromCodePoint(...bytes);
  const base64 = btoa(binaryStr);

  return { base64: "[B64:" + base64 + "]", i };
}

function getSource() {
  const raw = document.getElementById("text-source").value.trim();

  source = "";
  let i = 0;
  while (i < raw.length) {
    if (raw.codePointAt(i) <= 128) {
      source += raw.substring(i, i + 1);
      i++;
    } else {
      const enc = encode(raw, i);
      source += enc.base64;
      i = enc.i + 1;
    }
  }
}

function cursors(step) {
  let cursor = Math.min(source.length, (step - 1) * codeLength);
  let nextCursor = Math.min(source.length, cursor + codeLength);
  return { cursor, nextCursor };
}

function nextBarcode() {
  if (source === undefined) {
    getSource();
  }

  if (!source) return;
  else if (cursor < source.length) {
    const nextCursor = Math.min(cursor + strlen, source.length);
    const extractedStr = screen(source.substring(cursor, nextCursor));

    if (nextCursor === source.length) nextBtn.innerText = "В початок";
    else {
      const total =
        source.length % strlen === 0
          ? source.length / strlen
          : Math.floor(source.length / strlen) + 1;
      const page = cursor / strlen + 1;
      nextBtn.innerText = `Наступний &gt;&gt; (${page} / ${total})`;
    }

    cursor = nextCursor;

    // Generate CODE-128 barcode
    JsBarcode("#barcode", extractedStr, {
      format: "CODE128",
      lineColor: "#000",
      width: 2,
      height: 100,
      displayValue: true // Shows the text below the bars
    });
  } else {
    cursor = 0;
    nextBtn.innerText = "Розпочати";
  }
}

function screen(str) {
  let result = str.replaceAll("\n", "{CR}");
  return result;
}

init();
