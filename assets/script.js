const PRICE_PER_LITER = 0.70;
const MIN_LITERS = 500;

function formatCurrency(value) {
  return value.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2
  });
}

function calcPrice() {
  const litersInput = document.getElementById("c-liters");
  const resultBox = document.getElementById("calc-result");
  if (!litersInput || !resultBox) {
    return;
  }

  const liters = parseFloat(litersInput.value);
  if (!liters || liters < MIN_LITERS) {
    resultBox.style.display = "none";
    litersInput.style.borderColor = liters && liters < MIN_LITERS ? "#D14D3F" : "";
    return;
  }

  litersInput.style.borderColor = "#16724A";
  const total = liters * PRICE_PER_LITER;
  const vat = total - total / 1.19;

  document.getElementById("res-liters").textContent = `${liters.toLocaleString("de-DE")} Liter`;
  document.getElementById("res-price").textContent = `${formatCurrency(PRICE_PER_LITER)} / Liter inkl. MwSt.`;
  document.getElementById("res-total").textContent = formatCurrency(total);
  document.getElementById("res-vat").textContent = `Enthaltene 19% MwSt.: ${formatCurrency(vat)}`;
  resultBox.style.display = "block";
}

function toggleMenu() {
  const menu = document.getElementById("mobile-menu");
  if (menu) {
    menu.classList.toggle("open");
  }
}

document.addEventListener("click", (event) => {
  const faqButton = event.target.closest(".faq-question");
  if (faqButton) {
    const item = faqButton.closest(".faq-item");
    if (item) {
      item.classList.toggle("active");
      const sign = item.querySelector(".faq-question span:last-child");
      if (sign) {
        sign.textContent = item.classList.contains("active") ? "−" : "+";
      }
    }
  }

  if (!event.target.closest(".navbar")) {
    const menu = document.getElementById("mobile-menu");
    if (menu) {
      menu.classList.remove("open");
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        document.getElementById("mobile-menu")?.classList.remove("open");
      }
    });
  });
});
