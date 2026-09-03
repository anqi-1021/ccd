// =============================================================
// 1. FUNCIONES DE CONVERSION DE MONEDA
// =============================================================

function toggleAllPrices() {
  const prices = document.querySelectorAll(".model-price");
  const btn = document.getElementById("changeCurrencyBtn");
  let anyEuro = false;

  prices.forEach((element) => {
    const yuan = parseFloat(element.dataset.yuanValue);
    if (isNaN(yuan)) return;
    const type = element.dataset.type; // 'rent', 'deposit', 'sale'

    if (element.dataset.mode === "euro") {
      // Volver a yuanes
      element.textContent = element.dataset.yuanText;
      element.dataset.mode = "yuan";
      element.style.color = "";
    } else {
      // Convertir a euros
      const euro = yuan / 7.8;
      let euroText = "";
      if (type === "rent") {
        euroText = `租金 ${euro.toFixed(1)}€/天`;
      } else if (type === "deposit") {
        euroText = `押金 ${euro.toFixed(1)}€`;
      } else if (type === "sale") {
        euroText = `价格 ${euro.toFixed(1)}€`;
      }
      element.textContent = euroText;
      element.dataset.mode = "euro";
      element.style.color = "#e67e22";
      anyEuro = true;
    }
  });

  if (btn) {
    const pTag = btn.querySelector("p");
    if (pTag) pTag.textContent = anyEuro ? "€ → ¥" : "¥ → €";
  }
}

function createPriceElement(yuanText, numericValue, type) {
  if (!yuanText || isNaN(numericValue)) return null;

  const div = document.createElement("div");
  div.className = "model-price";
  div.dataset.yuanValue = numericValue;
  div.dataset.type = type;
  div.dataset.yuanText = yuanText;
  div.textContent = yuanText;
  div.dataset.mode = "yuan";
  return div;
}

// =============================================================
// 2. RENDERIZADO DE MARCAS
// =============================================================

function renderBrand(brandKey) {
  const brand = brandsData[brandKey];
  if (!brand) return;
  const pagDiv = document.getElementById(`pag-${brandKey}`);
  if (!pagDiv) return;

  pagDiv.innerHTML = "";

  if (brand.categories && brand.categories.length > 0) {
    const subDiv = document.createElement("div");
    subDiv.className = "subclass";
    brand.categories.forEach((cat) => {
      const btn = document.createElement("button");
      btn.textContent = cat.name;
      btn.dataset.filter = cat.filter;
      subDiv.appendChild(btn);
    });
    pagDiv.appendChild(subDiv);
  }

  const modelsContainer = document.createElement("div");
  modelsContainer.className = "models-container";
  modelsContainer.dataset.brand = brandKey;

  if (brand.categories.length > 0) {
    modelsContainer.style.paddingTop = "60px";
  }

  brand.models.forEach((model) => {
    const card = document.createElement("div");
    card.className = "model";
    card.dataset.category = model.category || "other";

    const card_img = document.createElement("div");
    card_img.className = "card_img";
    const card_text = document.createElement("div");
    card_text.className = "card_text";

    const img = document.createElement("img");
    img.src = model.camera;
    img.style.height = "80%";
    img.style.width = "auto";
    img.style.objectFit = "cover";
    img.style.borderRadius = "6px";
    card_img.append(img);

    const nameDiv = document.createElement("div");
    nameDiv.className = "model-name";
    nameDiv.textContent = model.name;

    const descDiv = document.createElement("div");
    descDiv.className = "model-desc";
    descDiv.textContent = model.description || "";

    const priceDiv = document.createElement("div");
    const priceFDiv = document.createElement("div");

    if (model.priceF) {
      // Caso con alquiler y depósito
      const rentText = `租金 ${model.price}/天`;
      const rentValue = parseFloat(String(model.price).replace(/[^0-9.]/g, ""));
      const depositText = `押金 ${model.priceF}`;
      const depositValue = parseFloat(
        String(model.priceF).replace(/[^0-9.]/g, ""),
      );

      const rentElement = createPriceElement(rentText, rentValue, "rent");
      const depositElement = createPriceElement(
        depositText,
        depositValue,
        "deposit",
      );

      card_text.appendChild(nameDiv);
      card_text.appendChild(descDiv);
      card_text.appendChild(priceDiv);

      if (rentElement) card_text.appendChild(rentElement);
      if (depositElement) card_text.appendChild(depositElement);
    } else {
      const saleText = `价格 ${model.price}`;
      const saleValue = parseFloat(String(model.price).replace(/[^0-9.]/g, ""));
      const saleElement = createPriceElement(saleText, saleValue, "sale");
      card_text.appendChild(nameDiv);
      card_text.appendChild(descDiv);
      if (saleElement) card_text.appendChild(saleElement);
    }

    card.appendChild(card_text);
    card.appendChild(card_img);

    card.addEventListener("click", function () {
      let images = [];

      if (model.imageFolder && model.imageCount && model.imageCount >= 1) {
        images.push(`../${model.imageFolder}/1.jpeg`);
      }

      if (model.imageFolder && model.imageCount && model.imageCount > 1) {
        const total = model.imageCount;
        const available = Array.from({ length: total - 1 }, (_, i) => i + 2);
        for (let i = available.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [available[i], available[j]] = [available[j], available[i]];
        }
        const pickCount = Math.min(available.length, 9);
        const selected = available.slice(0, pickCount);
        selected.forEach((num) => {
          images.push(`../${model.imageFolder}/${num}.jpeg`);
        });
      }

      if (images.length > 0) {
        openModal(images, 0);
      } else {
        console.warn(`El modelo "${model.name}" no tiene imágenes.`);
      }
    });

    modelsContainer.appendChild(card);
  });

  pagDiv.appendChild(modelsContainer);

  const subButtons = pagDiv.querySelectorAll(".subclass button");
  if (subButtons.length > 0) {
    const allModels = modelsContainer.querySelectorAll(".model");

    function filterModels(category) {
      allModels.forEach((card) => {
        const cardCat = card.dataset.category;
        card.style.display =
          category === "all" || cardCat === category ? "" : "none";
      });
    }

    subButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        subButtons.forEach((b) => b.classList.remove("active"));
        this.classList.add("active");
        filterModels(this.dataset.filter);
      });
    });

    subButtons[0].classList.add("active");
    filterModels(subButtons[0].dataset.filter);
  }
}

// =============================================================
// 3. FUNCIÓN openPage (cambiar de marca)
// =============================================================

function openPage(event) {
  const button = event.currentTarget;
  const pageName = button.dataset.page;

  document
    .querySelectorAll(".tab button")
    .forEach((btn) => btn.classList.remove("active"));
  button.classList.add("active");

  document.querySelectorAll(".pag").forEach((p) => (p.style.display = "none"));
  const targetPage = document.getElementById(`pag-${pageName}`);
  if (targetPage) {
    targetPage.style.display = "block";
    if (targetPage.children.length === 0) {
      renderBrand(pageName);
    }
  }
}

// =============================================================
// 4. CARRUSEL / MODAL
// =============================================================

const overlay = document.createElement("div");
overlay.className = "modal-overlay";
overlay.innerHTML = `
  <button class="modal-close">&times;</button>
  <div class="modal-image-container">
    <span class="modal-arrow left">&#10094;</span>
    <img src="" alt="Imagen ampliada" id="modalImage">
    <span class="modal-arrow right">&#10095;</span>
  </div>
  <div class="modal-counter" id="modalCounter">1 / 1</div>
`;
document.body.appendChild(overlay);

const modalOverlay = overlay;
const modalImg = document.getElementById("modalImage");
const counter = document.getElementById("modalCounter");
const leftArrow = overlay.querySelector(".modal-arrow.left");
const rightArrow = overlay.querySelector(".modal-arrow.right");
const closeBtn = overlay.querySelector(".modal-close");

let currentImages = [];
let currentIndex = 0;

function openModal(images, index = 0) {
  if (!images || images.length === 0) return;
  currentImages = images;
  currentIndex = index;
  showImage();
  modalOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function showImage() {
  modalImg.src = currentImages[currentIndex];
  counter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
  leftArrow.style.display = currentImages.length > 1 ? "block" : "none";
  rightArrow.style.display = currentImages.length > 1 ? "block" : "none";
}

function nextImage() {
  if (currentImages.length === 0) return;
  currentIndex = (currentIndex + 1) % currentImages.length;
  showImage();
}

function prevImage() {
  if (currentImages.length === 0) return;
  currentIndex =
    (currentIndex - 1 + currentImages.length) % currentImages.length;
  showImage();
}

function closeModal() {
  modalOverlay.classList.remove("active");
  document.body.style.overflow = "";
  currentImages = [];
}

leftArrow.addEventListener("click", prevImage);
rightArrow.addEventListener("click", nextImage);
closeBtn.addEventListener("click", closeModal);

modalOverlay.addEventListener("click", function (e) {
  if (e.target === modalOverlay) closeModal();
});

document.addEventListener("keydown", function (e) {
  if (!modalOverlay.classList.contains("active")) return;
  if (e.key === "ArrowLeft") prevImage();
  else if (e.key === "ArrowRight") nextImage();
  else if (e.key === "Escape") closeModal();
});

// =============================================================
// 5. INICIALIZACIÓN (SE EJECUTA DIRECTAMENTE)
// =============================================================

const tabContainer = document.getElementById("tabContainer");
const pageContainer = document.getElementById("pageContainer");

const tabContainerDiv = document.createElement("div");
const pageContainerDiv = document.createElement("div");
tabContainer.appendChild(tabContainerDiv);
pageContainer.appendChild(pageContainerDiv);

const brandKeys = Object.keys(brandsData);
brandKeys.forEach((key) => {
  const brand = brandsData[key];
  const btn = document.createElement("button");
  btn.dataset.page = key;
  btn.innerHTML = `${brand.label} <i class="ph-bold ${brand.icon || "ph-sparkle"}"></i>`;
  btn.onclick = function (e) {
    openPage(e);
  };
  tabContainerDiv.appendChild(btn);
});

// Crear contenedores .pag para cada marca
brandKeys.forEach((key) => {
  const pagDiv = document.createElement("div");
  pagDiv.className = `${key} pag`;
  pagDiv.id = `pag-${key}`;
  pageContainerDiv.appendChild(pagDiv);
});

const currencyBtn = document.getElementById("changeCurrencyBtn");
if (currencyBtn) {
  currencyBtn.addEventListener("click", toggleAllPrices);
}

// Activar la primera pestaña
const firstBtn = document.querySelector(".tab button");
if (firstBtn) firstBtn.click();

window.openPage = openPage;
window.openModal = openModal;
window.toggleAllPrices = toggleAllPrices;
