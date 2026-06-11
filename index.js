let source = undefined;
let step = 0;
const codeLength = 20;
let totalSteps = 0;
const textSource = document.getElementById("text-source");
const nextBtn = document.getElementById("nextbarcode");
const prevBtn = document.getElementById("prevbarcode");
const resetBtn = document.getElementById("reset");
const showStepLbl = document.getElementById("show-step");

function init() {
  nextBtn.addEventListener("click", nextBarcode);
  prevBtn.addEventListener("click", prevBarcode);
  prevBtn.disabled = true;
  resetBtn.addEventListener("click", reset);
  textSource.addEventListener("change", reset);
}

function reset() {
  getSource();
  step = 0;
  showStep(0);
  getBarcodeImage(undefined);
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

  return { base64: "[B64:" + base64 + "]", i: i - 1 };
}

function getSource() {
  const raw = document.getElementById("text-source").value.trim();

  source = "";
  let i = 0;
  while (i < raw.length) {
    if (raw.codePointAt(i) === 10) {
      source += "[CR:]";
      i++;
    } else if (raw.codePointAt(i) <= 128) {
      source += raw.substring(i, i + 1);
      i++;
    } else {
      const enc = encode(raw, i);
      source += enc.base64;
      i = enc.i + 1;
    }
  }

  totalSteps =
    source.length % codeLength === 0
      ? source.length / codeLength
      : (source.length - (source.length % codeLength)) / codeLength + 1;
}

function cursors(step) {
  const cursor = Math.min(source.length, (step - 1) * codeLength);
  const nextCursor = Math.min(source.length, cursor + codeLength);
  return { cursor, nextCursor };
}

function getBarcodeImage(extractedStr) {
  // Generate CODE-128 barcode
  JsBarcode("#barcode", extractedStr, {
    format: "CODE128",
    lineColor: "#000",
    width: 2,
    height: 100,
    displayValue: true, // Shows the text below the bars
  });
}

function nextBarcode() {
  if (source === undefined) {
    getSource();
  }

  if (step < totalSteps) {
    const crs = cursors(step + 1);
    const extractedStr = source.substring(crs.cursor, crs.nextCursor);
    getBarcodeImage(extractedStr);
  }

  showStep(++step);
}

function prevBarcode() {
  if (source === undefined) {
    getSource();
  }

  if (step > 1) {
    const crs = cursors(step - 1);
    const extractedStr = source.substring(crs.cursor, crs.nextCursor);
    getBarcodeImage(extractedStr);
  }

  showStep(--step);
}

function showStep(step) {
  nextBtn.disabled = step >= totalSteps;
  prevBtn.disabled = step < 2;
  showStepLbl.innerText = `(${step} / ${totalSteps})`;
}

function screen(str) {
  let result = str.replaceAll("\n", "{CR}");
  return result;
}

init();
