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
  minus.disabled = !quantity.validity.valid || count <= 1;
  plus.disabled = !quantity.validity.valid || count >= maximum;
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
  quantity.stepDown();
  updateQuote();
});
plus.addEventListener("click", () => {
  quantity.stepUp();
  updateQuote();
});
updateQuote();

const canvas = document.querySelector("#mapa");
const map = canvas.getContext("2d");
const vehicles = [
  { x: 319, y: 188, name: "Vůz 01", status: "v pohybu" },
  { x: 490, y: 122, name: "Vůz 02", status: "zaparkovaný" },
  { x: 445, y: 302, name: "Vůz 03", status: "v pohybu" }
];
const routes = [
  [[-20, 340], [154, 282], [240, 203], [319, 188], [420, 107], [490, 122], [680, 65]],
  [[140, -20], [178, 86], [240, 203], [280, 310], [320, 420]],
  [[425, -20], [420, 107], [395, 196], [445, 302], [512, 420]],
  [[-20, 135], [178, 86], [250, 104], [395, 196], [544, 184], [680, 225]],
  [[-20, 389], [129, 340], [280, 310], [445, 302], [680, 280]],
  [[595, -20], [550, 59], [490, 122], [544, 184], [572, 285], [604, 420]]
];

function trace(points, color, width) {
  map.beginPath();
  map.moveTo(...points[0]);
  for (const point of points.slice(1)) map.lineTo(...point);
  map.strokeStyle = color;
  map.lineWidth = width;
  map.stroke();
}

function drawMap(active) {
  if (!map) return;
  map.fillStyle = "#181e19";
  map.fillRect(0, 0, canvas.width, canvas.height);
  map.save();
  map.translate(315, 205);
  map.rotate(-0.26);
  for (let row = -10; row <= 10; row++) {
    for (let column = -12; column <= 12; column++) {
      map.fillStyle = (row + column) % 3 === 0 ? "#2b3628" : "#242d25";
      map.fillRect(column * 35, row * 29, 29, 23);
    }
  }
  map.restore();
  map.lineJoin = "round";
  trace([[30, -20], [80, 95], [67, 182], [104, 252], [129, 340], [115, 420]], "#263c3a", 32);
  for (const route of routes) trace(route, "#151b16", 14);
  for (const route of routes) trace(route, "#4a5545", 4);
  trace([[154, 282], [240, 203], [319, 188], [420, 107], [490, 122]], "#a1bd64", 3);

  for (const [index, vehicle] of vehicles.entries()) {
    const selected = index === active;
    const color = selected ? "#d0ff60" : "#c4ccba";
    map.beginPath();
    map.arc(vehicle.x, vehicle.y, selected ? 15 : 9, 0, 2 * Math.PI);
    map.fillStyle = selected ? "#42552b" : "#20291f";
    map.fill();
    map.strokeStyle = color;
    map.lineWidth = 2;
    map.stroke();
    map.beginPath();
    map.arc(vehicle.x, vehicle.y, selected ? 5 : 3, 0, 2 * Math.PI);
    map.fillStyle = color;
    map.fill();
    if (selected) {
      map.fillStyle = "#141913";
      map.fillRect(vehicle.x + 20, vehicle.y - 15, 80, 30);
      map.fillStyle = color;
      map.font = "bold 15px system-ui";
      map.textBaseline = "middle";
      map.fillText(vehicle.name, vehicle.x + 30, vehicle.y);
    }
  }
}

const mapState = document.querySelector("#map-state");
const selectors = document.querySelectorAll("[data-vehicle]");
for (const button of selectors) {
  button.addEventListener("click", () => {
    const index = Number(button.dataset.vehicle);
    const vehicle = vehicles[index];
    for (const option of selectors) {
      option.setAttribute("aria-pressed", String(option === button));
    }
    mapState.textContent = vehicle.name + " · " + vehicle.status;
    drawMap(index);
  });
}
drawMap(0);


