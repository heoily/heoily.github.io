const PRICE_PER_LITER = 0.70;
const MIN_LITERS = 500;
const COOKIE_CONSENT_KEY = "heoilyCookieConsent";

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

function getCookieConsent() {
  try {
    const storedValue = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    return storedValue ? JSON.parse(storedValue) : null;
  } catch (error) {
    return null;
  }
}

function setCookieConsent(level) {
  const payload = {
    level,
    updatedAt: new Date().toISOString()
  };

  try {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(payload));
  } catch (error) {
    return null;
  }

  return payload;
}

function createCookieBanner() {
  const banner = document.createElement("div");
  banner.className = "cookie-consent";
  banner.id = "cookie-consent";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-live", "polite");
  banner.setAttribute("aria-label", "Cookie-Hinweis");
  banner.innerHTML = `
    <div class="cookie-consent__panel">
      <div class="cookie-consent__inner">
        <div class="cookie-consent__copy">
          <span class="cookie-consent__title">Cookies & Datenschutz</span>
          <p>Wir verwenden technisch notwendige Cookies und ähnliche Speichertechnologien, um die Website bereitzustellen und Ihre Auswahl zu speichern. Optionale Cookies würden wir nur mit Ihrer Einwilligung einsetzen. Details finden Sie in unserer <a href="datenschutz.html">Datenschutzerklärung</a>.</p>
        </div>
        <div class="cookie-consent__actions">
          <button type="button" class="cookie-consent__btn cookie-consent__btn--necessary" data-cookie-choice="necessary">Nur notwendige</button>
          <button type="button" class="cookie-consent__btn cookie-consent__btn--accept" data-cookie-choice="all">Alle akzeptieren</button>
        </div>
      </div>
    </div>
  `;

  return banner;
}

function createCookieToggle() {
  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "cookie-consent-toggle";
  toggle.id = "cookie-consent-toggle";
  toggle.textContent = "Cookie-Einstellungen";
  toggle.hidden = true;
  return toggle;
}

function syncCookieUi() {
  const banner = document.getElementById("cookie-consent");
  const toggle = document.getElementById("cookie-consent-toggle");
  const consent = getCookieConsent();

  if (!banner || !toggle) {
    return;
  }

  if (consent?.level) {
    banner.classList.remove("is-visible");
    toggle.hidden = false;
  } else {
    banner.classList.add("is-visible");
    toggle.hidden = true;
  }
}

function initializeCookieConsent() {
  if (!document.body || document.getElementById("cookie-consent")) {
    return;
  }

  const banner = createCookieBanner();
  const toggle = createCookieToggle();
  document.body.appendChild(banner);
  document.body.appendChild(toggle);

  banner.querySelectorAll("[data-cookie-choice]").forEach((button) => {
    button.addEventListener("click", () => {
      const choice = button.getAttribute("data-cookie-choice");
      setCookieConsent(choice);
      syncCookieUi();
    });
  });

  toggle.addEventListener("click", () => {
    banner.classList.add("is-visible");
    toggle.hidden = true;
  });

  syncCookieUi();
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
  initializeCookieConsent();

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
