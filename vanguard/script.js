"use strict";

const quantity = document.querySelector("#pocet");
const minus = document.querySelector("#minus");
const plus = document.querySelector("#plus");
const quote = document.querySelector("#quote");
const quoteLabel = document.querySelector("#quote-label");
const quoteTotal = document.querySelector("#quote-total");
const quoteSaving = document.querySelector("#quote-saving");
const tiers = document.querySelectorAll(".tiers li");
const unitPrice = 200000;
const maximum = Number(quantity.max);
const format = new Intl.NumberFormat("cs-CZ");

function updateQuote() {
  const count = quantity.valueAsNumber;
  minus.disabled = quantity.validity.valid && count <= 1;
  plus.disabled = quantity.validity.valid && count >= maximum;
  const valid = quantity.validity.valid;
  const rate = valid ? (count >= 10 ? 15 : count >= 6 ? 10 : count >= 3 ? 5 : 0) : 0;
  const subtotal = valid ? count * unitPrice : 0;
  const savings = subtotal * rate / 100;

  quote.dataset.rate = String(rate);
  quoteLabel.textContent = valid
    ? (rate ? "Celková cena po slevě " + rate + " %" : "Celková cena")
    : "Zadejte celý počet od 1 do " + maximum + ".";
  quoteTotal.textContent = valid ? format.format(subtotal - savings) : "—";
  quoteSaving.hidden = rate === 0;
  quoteSaving.textContent = rate
    ? "Před slevou " + format.format(subtotal) + " · Úspora " + format.format(savings)
    : "";

  for (const tier of tiers) {
    if (Number(tier.dataset.rate) === rate) tier.setAttribute("aria-current", "true");
    else tier.removeAttribute("aria-current");
  }
}

quantity.addEventListener("input", updateQuote);
minus.addEventListener("click", () => {
  if (quantity.validity.valid) quantity.stepDown();
  else quantity.value = String(quantity.min);
  updateQuote();
});
plus.addEventListener("click", () => {
  if (quantity.validity.valid) quantity.stepUp();
  else quantity.value = String(quantity.min);
  updateQuote();
});
updateQuote();

const canvas = document.querySelector("#mapa");
const map = canvas.getContext("2d");
const toggle = document.querySelector("#map-toggle");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const route = [[117, 114], [260, 114], [350, 180], [492, 180], [492, 300], [229, 300], [117, 224], [117, 114]];
const roads = [
  ...[57, 114, 180, 224, 300, 355].map(y => [[0, y], [570, y]]),
  ...[55, 117, 229, 350, 421, 492, 553].map(x => [[x, 0], [x, 400]]),
  route
];

function trace(context, points, color, width) {
  context.beginPath();
  context.moveTo(...points[0]);
  for (const point of points.slice(1)) context.lineTo(...point);
  context.strokeStyle = color;
  context.lineWidth = width;
  context.stroke();
}

function startMap() {
  const background = document.createElement("canvas");
  background.width = canvas.width;
  background.height = canvas.height;
  const city = background.getContext("2d");
  city.fillStyle = "#858973";
  city.fillRect(0, 0, 660, 400);
  const blocks = ["#a39b83", "#a9a28e", "#8e977a", "#968d7c"];
  for (let row = 0; row < 12; row++) {
    for (let col = 0; col < 19; col++) {
      city.fillStyle = blocks[(row * 7 + col * 13 + row * col) % blocks.length];
      city.fillRect(col * 35 + 2, row * 34 + 2, 30, 29);
    }
  }
  city.lineJoin = "round";
  for (const road of roads) trace(city, road, "#7d7c70", 12);
  for (const road of roads) trace(city, road, "#c8c2ac", 7);
  trace(city, route, "#e2d9bc", 7);

  city.fillStyle = "#486b70";
  city.beginPath();
  city.moveTo(604, 0);
  city.bezierCurveTo(568, 129, 618, 287, 556, 400);
  city.lineTo(660, 400);
  city.lineTo(660, 0);
  city.closePath();
  city.fill();

  let length = 0;
  const segments = route.slice(1).map(([x, y], index) => {
    const [fromX, fromY] = route[index];
    const distance = Math.hypot(x - fromX, y - fromY);
    const segment = { fromX, fromY, x, y, start: length, distance };
    length += distance;
    return segment;
  });
  let position = 0;
  let frame;
  let previous;

  const plates = ["VNG-101", "VNG-202", "VNG-303", "VNG-404"];

  function drawMarker(position, plate) {
    const segment = segments.find(part => position < part.start + part.distance);
    const fraction = (position - segment.start) / segment.distance;
    const x = segment.fromX + (segment.x - segment.fromX) * fraction;
    const y = segment.fromY + (segment.y - segment.fromY) * fraction;
    map.fillStyle = "#282410";
    map.fillRect(x - 8, y - 8, 16, 16);
    map.fillStyle = "#ffdf37";
    map.fillRect(x - 6, y - 6, 12, 12);
    map.font = "bold 20px system-ui";
    map.textBaseline = "middle";
    map.lineJoin = "round";
    map.lineWidth = 5;
    map.strokeStyle = "#24210d";
    map.strokeText(plate, x + 13, y);
    map.fillText(plate, x + 13, y);
  }

  function draw() {
    map.drawImage(background, 0, 0);
    plates.forEach((plate, index) => {
      const offset = index * length / plates.length;
      drawMarker((position + offset) % length, plate);
    });
  }

  function animate(time) {
    if (previous !== undefined) position = (position + Math.min(time - previous, 50) * 0.048) % length;
    previous = time;
    draw();
    frame = requestAnimationFrame(animate);
  }

  function setPlaying(playing) {
    cancelAnimationFrame(frame);
    frame = undefined;
    previous = undefined;
    if (playing) frame = requestAnimationFrame(animate);
    toggle.textContent = playing ? "Pozastavit jízdu" : "Spustit jízdu";
  }

  toggle.disabled = false;
  toggle.addEventListener("click", () => setPlaying(frame === undefined));
  reducedMotion.addEventListener("change", event => { if (event.matches) setPlaying(false); });
  draw();
  setPlaying(!reducedMotion.matches);
}

if (map) startMap();


