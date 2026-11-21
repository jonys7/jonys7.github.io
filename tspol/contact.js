"use strict";
const email = "info@tspol.ic";
const toast = document.getElementById("copy-toast");
let toastTimer;

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(email);
    return true;
  } catch {
    const field = document.createElement("textarea");
    const focused = document.activeElement;
    field.value = email;
    field.className = "clipboard-field";
    field.readOnly = true;
    document.body.append(field);
    field.select();
    try {
      return document.execCommand("copy");
    } catch {
      return false;
    } finally {
      field.remove();
      focused?.focus();
    }
  }
}

for (const button of document.querySelectorAll("[data-copy-email]")) {
  button.addEventListener("click", async () => {
    const copied = await copyEmail();
    clearTimeout(toastTimer);
    toast.textContent = copied ? "E-mail zkopírován" : "Adresu zkopírujte ručně: " + email;
    toast.classList.add("visible");
    toastTimer = setTimeout(() => toast.classList.remove("visible"), 2500);
  });
}

const today = new Date();
const years = today.getFullYear() - 2020 -
  Number(today.getMonth() < 10 || (today.getMonth() === 10 && today.getDate() < 2));
document.getElementById("company-age").textContent = years;
