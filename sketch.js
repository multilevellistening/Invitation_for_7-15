let state = "door";
let doorImg, scrollBgImg, endImg, drawImg;
let scrollOffset = 0;
let canvasBuffer;

let lines = [
  "招待状",
  "",
  "7月15日の火曜会では",
  "持ち寄った※紙 を大きな画用紙に貼り",
  "その上からみんなで加筆をします。 ",
  "",
  "※紙について",
  "最近撮った写真の現像や書いた文章の印刷",
  "紙面に貼れるものならなんでも構いません。",
  "大きな支持体を準備しますので",
  "たくさん持ってきてくれると嬉しいです。",
  "それと、切り貼りするためののりやハサミ",
  "加筆用の筆記用具を当日の持ち物とします。",
  "",
  "この加筆作業を以て",
  "我々の「道のない地図」を描きましょう。",
  "それでは次の火曜日　19時にKOMADにて",
  "お会いできるのを楽しみにしております"
];

function preload() {
  doorImg = loadImage("door.jpg", onImageLoadError);
  scrollBgImg = loadImage("scrollBg.jpg", onImageLoadError);
  endImg = loadImage("end.jpg", onImageLoadError);
  drawImg = loadImage("draw.jpg", onImageLoadError);
}

function drawImageFit(img) {
  if (!img) return;

  let imgAspect = img.width / img.height;
  let canvasAspect = width / height;

  let drawWidth, drawHeight;

  if (imgAspect > canvasAspect) {
    // 画像の方が横長 → 幅を合わせて高さを縮める
    drawWidth = width;
    drawHeight = width / imgAspect;
  } else {
    // 画像の方が縦長 → 高さを合わせて幅を縮める
    drawHeight = height;
    drawWidth = height * imgAspect;
  }

  let x = (width - drawWidth) / 2;
  let y = (height - drawHeight) / 2;

  image(img, x, y, drawWidth, drawHeight);
}

let baseFontSize;
function setup() {
   
    let safeHeight = document.documentElement.clientHeight; // ← スマホでも正しい高さを取得
  createCanvas(windowWidth, safeHeight);                  // ← 高さに safeHeight を使用

  textAlign(CENTER, CENTER);
  textFont('serif');
  textSize(min(windowWidth, safeHeight) * 0.045); // スマホでも見やすい文字サイズに


  canvasBuffer = createGraphics(windowWidth, windowHeight);
  canvasBuffer.clear();
}

function draw() {
  if (state === "door") {
    drawDoor();
  } else if (state === "scroll") {
    drawScroll();
  } else if (state === "end") {
    drawEnd();
  } else if (state === "draw") {
    drawInteractive();
  }
}

function drawDoor() {
 background(255); 
  drawImageFit(doorImg);

}

function drawScroll() {
  background(255);
  drawImageFit(scrollBgImg);

  fill(0, 0, 0, 183);
  rect(0, 0, width, height);

  fill(255);
  
  // 🔽 小さめの文字サイズ
  let scrollFontSize = baseFontSize * 0.8;
  textSize(scrollFontSize);

  // 🔽 行間広め
  let lineHeight = scrollFontSize * 1.8;

  for (let i = 0; i < lines.length; i++) {
    let y = height / 3 + scrollOffset + i * lineHeight;
    text(lines[i], width / 2, y);
  }

  let lastLineY = height / 3 + scrollOffset + lines.length * lineHeight;
  if (lastLineY < height / 2 - 100) {
    state = "end";
  }
}


function drawEnd() {
  background(255);
  drawImageFit(endImg);

  fill(255);
  
  // 🔽 少し小さめの文字サイズ
  textSize(baseFontSize * 0.5);
  textAlign(CENTER, TOP);
  
  // 🔽 行ごとに分割して描画（行間を大きく）
  let poemLines = [
    "そこへゆこうとして",
    "",
    "ことばはつまずき",
    "",
    "ことばをおいこそうとして",
    "",
    "たましいはあえぎ",
    "",
    "けれどそのたましいのさきに",
    "",
    "かすかなともしびのようなものがみえる",
    "",
    "そこへゆこうとして",
    "",
    "ゆめはばくはつし",
    "",
    "ゆめをつらぬこうとして",
    "",
    "くらやみはかがやき",
    "",
    "けれどそのくらやみのさきに",
    "",
    "まだおおきなあなのようなものがみえる",
    "",
    "— 谷川俊太郎『選ばれた場所』"
  ];

  let lineHeight = baseFontSize * 1.8; // 🔽 行間を広めに設定
  let startY = height * 0.15;

  for (let i = 0; i < poemLines.length; i++) {
    text(poemLines[i], width / 2, startY + i * lineHeight);
  }
}

function drawInteractive() {
  if (drawImg) background(255);
  drawImageFit(drawImg);
  image(canvasBuffer, 0, 0);
}

function handleInteraction() {
  if (state === "door") {
    state = "scroll";
  } else if (state === "end") {
    state = "draw";
  }
}

function mousePressed() {
  handleInteraction();
}

function touchStarted() {
  handleInteraction();
  return false;
}

function touchMoved() {
  if (state === "scroll") {
    scrollOffset += movedY;
    return false;
  }
  if (state === "draw") {
    canvasBuffer.stroke(0);
    canvasBuffer.strokeWeight(3);
    canvasBuffer.line(pmouseX, pmouseY, mouseX, mouseY);
    return false;
  }
}

function mouseDragged() {
  if (state === "scroll") {
    scrollOffset += movedY;
  } else if (state === "draw") {
    canvasBuffer.stroke(0);
    canvasBuffer.strokeWeight(3);
    canvasBuffer.line(pmouseX, pmouseY, mouseX, mouseY);
  }
}

function onImageLoadError(err) {
  console.warn("Image failed to load:", err);
}
