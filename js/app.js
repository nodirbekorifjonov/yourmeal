// Datas
const foodData = "../data/db.json";

// Elements
const categoriesList = document.querySelector(".categories__list");
const productsList = document.querySelector(".products__list");
const productsTitle = document.querySelector(".products__title");
const basketEl = document.querySelector(".basket");
const basketList = document.querySelector(".basket__list");
const basketMain = document.querySelector(".basket-main");
const basketAction = document.querySelector(".basket-action");
const basketEmptyMessage = document.querySelector(".basket-empty-messasge");
const basketTotal = document.querySelector(".basket__total");
const basketAmount = document.querySelectorAll(".basket__amount");
const basketBtn = document.querySelector(".basket__btn");
const deleteModal = document.querySelector(".delete-modal");
const deleteModalYes = document.querySelector(".delete-modal__yes-btn");
const deleteModalNo = document.querySelector(".delete-modal__no-btn");
const basketOpener = document.querySelector(".basket-opener");

// Modals
const productInfoModal = document.querySelector(".product-modal");
const deliveryModal = document.querySelector(".delivery-modal");
const closeModal = document.querySelectorAll(".modal__close-btn");
const overlay = document.querySelector(".overlay");
const deliveryForm = document.getElementById("delivery-modal__form");
const deliveryInputs = document.querySelectorAll("input");

const categoriesData = [
  {
    id: "burger",
    name: "Бургеры",
    img: "burger.png",
    srcset: "burger@2x.png",
  },
  {
    id: "appetizers",
    name: "Закуски",
    img: "appetizers.png",
    srcset: "appetizers@2x.png",
  },
  {
    id: "hotdog",
    name: "Хот-доги",
    img: "hotdog.png",
    srcset: "hotdog@2x.png",
  },
  {
    id: "combo",
    name: "Комбо",
    img: "combo.png",
    srcset: "combo@2x.png",
  },
  {
    id: "burrito",
    name: "Шаурма",
    img: "burrito.png",
    srcset: "burrito@2x.png",
  },
  {
    id: "pizza",
    name: "Пицца",
    img: "pizza.png",
    srcset: "pizza@2x.png",
  },
  {
    id: "noodles",
    name: "Вок",
    img: "noodles.png",
    srcset: "noodles@2x.png",
  },
  {
    id: "doughnut",
    name: "Десерты",
    img: "doughnut.png",
    srcset: "doughnut@2x.png",
  },
  {
    id: "ketchup",
    name: "Соусы",
    img: "ketchup.png",
    srcset: "ketchup@2x.png",
  },
];

if (!localStorage.getItem("category")) {
  localStorage.setItem("category", "burger");
}

let basket = JSON.parse(localStorage.getItem("list"))
  ? JSON.parse(localStorage.getItem("list"))
  : [];

const getData = async (resurce) => {
  const req = await fetch(resurce);

  if (req.status != 200) {
    throw new Error("Xatolik yuz berdi!");
  }

  const data = await req.json();
  return data;
};

const handleCloseModals = () => {
  productInfoModal.classList.add("hidden");
  deliveryModal.classList.add("hidden");
  overlay.classList.add("hidden");
  deleteModal.classList.add("hidden");
};

const handleModals = () => {
  document.querySelectorAll(".products__item-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      productInfoModal.classList.remove("hidden");
      overlay.classList.remove("hidden");
    });
  });

  closeModal.forEach((close) => {
    close.addEventListener("click", handleCloseModals);
  });
  overlay.addEventListener("click", handleCloseModals);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") handleCloseModals();
  });
};

if (basket.length) showBasket();

function setBasket() {
  localStorage.setItem("list", JSON.stringify(basket));
}

setBasket();

function showBasket() {
  // basketMain.innerHTML = "";
  let existingItem;
  basketList.innerHTML = "";
  if (basket.length) {
    basket.forEach((item, i) => {
      const product = item.product;
      const amount = item.amount;

      basketList.innerHTML += `
    <li class="basket__item">
                <div class="basket__item-info">
                  <img
                    src="./images/jpeg/${product.image}"
                    alt=""
                    srcset="
                      ./images/jpeg/${product.image}    1x,
                      ./images/jpeg/${product.imageSrc} 2x
                    "
                  />
                  <div class="basket__item-desc">
                    <h5 class="basket__item-title">${product.name}</h5>
                    <span class="basket__item-weight">${product.weight}г</span>
                    <p class="basket__item-cost">${product.cost}₽</p>
                  </div>
                </div>
                <div class="basket__item-amount">
                  <button class="basket__item-remove basket__item-btn" data-id="${product.id}">
                    -
                  </button>
                  <span class="basket__item-counter">${amount}</span>
                  <button class="basket__item-add basket__item-btn" data-id="${product.id}">+</button>

                </div>
              </li>
    `;
    });

    basketAction.classList.remove("hidden");
    basketEmptyMessage.classList.add("hidden");

    document.querySelectorAll(".basket__item-add").forEach((btn, i) => {
      btn.addEventListener("click", (e) => {
        const existingItem = basket.find(
          (item) => item.product.id == e.target.dataset.id
        );

        if (existingItem) {
          existingItem.amount += 1;
        } else {
          basket.push({ product: product, amount: amount });
        }

        localStorage.setItem("list", JSON.stringify(basket));
        showBasket();
      });
    });

    document.querySelectorAll(".basket__item-remove").forEach((btn, i) => {
      btn.addEventListener("click", (e) => {
        existingItem = basket.find(
          (item) => item.product.id == e.target.dataset.id
        );

        if (existingItem) {
          existingItem.amount -= 1;

          if (existingItem.amount < 1) {
            deleteModal.classList.remove("hidden");
            overlay.classList.remove("hidden");
            handleDeleteModal(existingItem);
          }
        } else {
          basket.push({ product: product, amount: amount });
        }

        localStorage.setItem("list", JSON.stringify(basket));
        showBasket();
      });
    });

    const mapTotal = basket.map((item) => {
      return item.product.cost * item.amount;
    });

    const totalCost = mapTotal.reduce((acc, curVal, index) => {
      const returns = acc + curVal;
      return returns;
    });

    const mapAmount = basket.map((item) => {
      return item.amount;
    });

    const totalAmount = mapAmount.reduce((acc, curVal, index) => {
      const returns = acc + curVal;
      return returns;
    });

    basketTotal.innerHTML = `
    <h4>Итого</h4>
    <span>${totalCost}₽</span>
    `;

    basketAmount.forEach((amount) => {
      amount.textContent = totalAmount;
    });
  } else {
    basketAction.classList.add("hidden");
    basketEmptyMessage.classList.remove("hidden");
    basketAmount.forEach((amount) => {
      amount.textContent = 0;
    });
  }

  deleteModalYes.addEventListener("click", () => {
    handleCloseModals();
    deleteProducts();
  });

  function handleDeleteModal(existingItem) {
    deleteModalNo.addEventListener("click", () => {
      if (existingItem) {
        existingItem.amount = 1;
      } else {
        basket.push({ product: item.product, amount: item.amount });
      }

      localStorage.setItem("list", JSON.stringify(basket));
      showBasket();
      handleCloseModals();
    });

    overlay.addEventListener("click", () => {
      if (existingItem) {
        existingItem.amount = 1;
      } else {
        basket.push({ product: item.product, amount: item.amount });
      }

      localStorage.setItem("list", JSON.stringify(basket));
      showBasket();
      handleCloseModals();
    });
  }

  basketBtn.addEventListener("click", () => {
    deliveryModal.classList.remove("hidden");
    overlay.classList.remove("hidden");
  });
}

function checkScreenSize() {
  if (window.innerWidth > 965) {
    basketEl.classList.remove("hidden");
  } else {
    basketEl.classList.add("hidden");
  }
}

basketOpener.addEventListener("click", () => {
  basketEl.classList.toggle("hidden");
});

checkScreenSize();

window.addEventListener("resize", checkScreenSize);

deliveryForm.addEventListener("submit", (e) => {
  e.preventDefault();
  deliveryForm.reset();
  basket = [];
  setBasket();
  showBasket();
  handleCloseModals();
});

function deleteProducts() {
  const deletedProducts = basket.filter((item, i) => {
    return item.amount >= 1;
  });

  basket = deletedProducts;

  setBasket();
  showBasket();
}

const getProductModal = (food) => {
  let amountCounter = 1;
  productInfoModal.innerHTML = `
    <div class="modal__header">
      <h2 class="modal__title">${food.name}</h2>
      <button onclick="productInfoModal.classList.add('hidden'); overlay.classList.add('hidden');" class="modal__close-btn">
        <img src="./images/svg/close.svg" alt="" />
      </button>
    </div>
    <div class="product-modal__main">
      <div class="product-modal__img">
        <img
          src="./images/jpeg/${food.image}"
          alt=""
          srcset="./images/jpeg/${food.image} 1x, ./images/jpeg/${
    food.imageSrc
  } 2x"
        />
      </div>
      <div class="product-modal__info">
        <p class="product-modal__description">${food.description}</p>
        <span class="product-modal__text">Состав:</span>
        <ul class="product-modal__list">
          ${food.ingredients
            .map(
              (ingredient) =>
                `<li class="product-modal__item">${ingredient}</li>`
            )
            .join("")}
        </ul>
        <span class="product-modal__weight">${food.weight}г, ккал ${
    food.kkal
  }</span>
      </div>
    </div>
    <div class="product-modal__footer">
      <button class="product-modal__btn site-btn">Добавить</button>

      <div class="product-modal__amount">
        <button class="product-modal__remove product-modal__amount-btn" id="decreaseBtn">-</button>
        <span class="bproduct-modal__counter" id="amountCounter">${amountCounter}</span>
        <button class="bproduct-modal__add product-modal__amount-btn" id="increaseBtn">+</button>
      </div>

      <span class="product-modal__cost">${food.cost}₽</span>
    </div>
  `;

  // Add event listeners for amount update
  const increaseBtn = document.getElementById("increaseBtn");
  const decreaseBtn = document.getElementById("decreaseBtn");
  const amountDisplay = document.getElementById("amountCounter");
  const sendBtn = document.querySelector(".product-modal__btn");

  increaseBtn.addEventListener("click", () => {
    amountCounter += 1;
    amountDisplay.textContent = amountCounter;
  });

  decreaseBtn.addEventListener("click", () => {
    if (amountCounter > 1) {
      amountCounter -= 1;
      amountDisplay.textContent = amountCounter;
    }
  });

  sendBtn.addEventListener("click", () => {
    const existingItem = basket.find((item) => item.product.id === food.id);

    if (existingItem) {
      existingItem.amount += amountCounter;
    } else {
      basket.push({ product: food, amount: amountCounter });
    }

    setBasket();
    showBasket();
    handleCloseModals(); // Close the modal after adding to the basket
  });
};

const updateUI = (food) => {
  const filteredData = food.filter((data) => {
    return data.category == localStorage.getItem("category");
  });

  productsList.innerHTML = "";

  if (filteredData.length) {
    filteredData.forEach((food, i) => {
      productsList.innerHTML += `
    <li data-id="${food.id}" class="products__item">
        <div class="products__item-info">
            <img
                    src="./images/jpeg/${food.image}"
                    alt=""
                    srcset="
                      ./images/jpeg/${food.image}    1x,
                      ./images/jpeg/${food.imageSrc} 2x
                    "
                  />
                  <h4 class="products__item-cost">${food.cost}₽</h4>
                  <h5 class="products__item-name">${food.name}</h5>
                  <p class="products__item-wight">${food.weight}г</p>
                </div>
                <button onclick='getProductModal(${JSON.stringify(
                  food
                )})' class="products__item-btn site-btn add-btn">
                  Добавить
                </button>
              </li>
    `;
    });
    handleModals();
  } else {
    productsList.innerHTML = `
      <p>Такого типа еды не существует.</p>
    `;
  }
};

const updateCategoriesActive = () => {
  const buttons = document.querySelectorAll(".category-btn");
  buttons.forEach((btn) => {
    if (btn.dataset.id === localStorage.getItem("category")) {
      btn.classList.add("active");
      categoriesData.forEach((item) => {
        if (item.id == localStorage.getItem("category")) {
          productsTitle.innerHTML = item.name;
        }
      });
    } else {
      btn.classList.remove("active");
    }
  });

  getData(foodData)
    .then((data) => updateUI(data))
    .catch((err) => console.log(err));
};

const setCategoryLocal = (id) => {
  localStorage.setItem("category", id);
  updateCategoriesActive();
};

categoriesData.forEach((category) => {
  categoriesList.innerHTML += `
    <li class="categories__item">
      <button 
        class="category-btn ${
          localStorage.getItem("category") === category.id ? "active" : ""
        }" 
        data-id="${category.id}" 
        onclick="setCategoryLocal('${category.id}')"
      >
        <img src="./images/png/${category.img}" alt="${category.name}" 
             srcset="./images/png/${category.img} 1x, ./images/png/${
    category.srcset
  } 2x"/>
        ${category.name}
      </button>
    </li>
  `;
});

updateCategoriesActive();
