let source = undefined;
let cursor = 0;
const strlen = 20;
const nextBtn = document.getElementById("nextbarcode");

function init() {
  nextBtn.addEventListener("click", nextBarcode);
}

function nextBarcode() {
  if (source === undefined)
    source = document.getElementById("text-source").value.trim();

  if (!source) return;
  else if (cursor < source.length) {
    const nextCursor = Math.min(cursor + strlen, source.length);
    const extractedStr = source.substring(cursor, nextCursor);

    if (nextCursor === source.length) nextBtn.innerText = "В початок";
    else {
      const total =
        source.length % strlen === 0
          ? source.length / strlen
          : Math.floor(source.length / strlen) + 1;
      const page = cursor / strlen + 1;
      nextBtn.innerText = `Показати наступний штрихкод (${page} / ${total})`;
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

init();
