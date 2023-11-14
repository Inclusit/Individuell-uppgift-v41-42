const itemInfo = document.getElementById("storeItemInfo");

/* STOREFRONT START */

class ItemList {
  //Fetch item list
  itemUrl = "https://fakestoreapi.com/products";

  async fetchItems() {
    //Fetch information
    try {
      const storeResponse = await fetch(this.itemUrl);
      const storeData = await storeResponse.json();
      console.log("IN FETCH", storeData);
      this.renderStore(storeData);
    } catch (error) {
      console.error("There was an error fetching item API:", error);
    }
  }

  renderStore(items, clear = false) {
    if (clear) itemInfo.innerHTML = "";

    items.forEach((item, i) => {
      const itemWrapper = document.createElement("section"); //creates section for each article
      itemWrapper.id = "item-wrapper";
      itemWrapper.classList.add("item-wrapper");

      const itemArticle = document.createElement("article"); //creates article for each item
      itemArticle.id = "item-article";
      itemArticle.classList.add("item-article");
      itemArticle.classList.add("btn-primary");

      itemArticle.setAttribute("data-bs-toggle", "modal"); //Attribute so modal and article can communicate
      itemArticle.setAttribute("data-bs-target", "#modal");
      itemArticle.addEventListener("click", () => {
        setModalContent(item);
      });

      itemArticle.innerHTML = `
        <h3>${item.title}</h3>
        <img class="item-image" src="${item.image}"></img>
        <div class="thumbnail-details">
          <p class="item-price">${item.price} USD</p>
          <button id="buy-btn-${i}" class="buy-btn">Buy</button>
          <p class="item-rating">${item.rating.rate} rating</p>
        </div>
      `;

      itemInfo.appendChild(itemWrapper);
      itemWrapper.appendChild(itemArticle);

      let buyBtn = document.getElementById(`buy-btn-${i}`);
      buyBtn.addEventListener("click", () => {
        cart.addItem(item);
      });
    });
  }
}

/* STOREFRONT END */

/* FILTER JAVASCRIPT START */

class ItemFilter {
  constructor() {
    this.filterUrl = "https://fakestoreapi.com/products/categories";
    this.itemList = new ItemList();
  }

  async fetchCategories() {
    try {
      const categoryResponse = await fetch(this.filterUrl);
      const getCategoryData = await categoryResponse.json();
      console.log(getCategoryData);
      this.renderCategories(getCategoryData);
    } catch (error) {
      console.error("There was an error fetching categories:", error);
    }
  }

  renderCategories(categories) {
    const filterClass = document.getElementById("nav-list");
    categories.forEach((category) => {
      const filterWrapper = document.createElement("div");
      filterWrapper.id = "filter-wrapper";
      filterWrapper.classList.add("filter-wrapper");
      const filterList = document.createElement("li");
      filterList.id = "filter-list";
      filterList.classList.add("filter-list");

      filterList.textContent = category;
      filterList.onclick = () => {
        this.filterCategories(category);
      };
      filterClass.appendChild(filterWrapper);
      filterWrapper.appendChild(filterList);
    });
  }

  async filterCategories(name) {
    // this.   fetchItems() // gets.filter()
    const currentCatRes = await fetch(
      `https://fakestoreapi.com/products/category/${name}`
    );
    const catData = await currentCatRes.json();
    console.log("cat", catData);
    this.itemList.renderStore(catData, true);
    // ItemList.renderStore(catData);
  }
}

/* FILTER JAVASCRIPT END */

/* CART SIDEBAR START */

class Cart {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem("cart")) || [];
    this.cartUl = document.querySelector(".cart-column ul");
  }

  addItem(item) {
    try {
      this.cart.push(item);
      localStorage.setItem("cart", JSON.stringify(this.cart));
      this.renderItems();
    } catch (error) {
      console.error("There was an error adding items to your cart:", error);
    }
  }

  removeItem(index) {
    try {
      this.cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(this.cart));
      this.renderItems();
    } catch (error) {
      console.error("Error removing item from your cart:", error);
    }
  }

  renderItems() {
    this.cartUl.innerHTML = "";
    this.cart.forEach((item, index) => {
      this.cartUl.innerHTML += `
        <li>
          <img src="${item.image}" width="50">
          ${item.title}
          <div class="remove-btn-wrapper">
            <button class="remove-btn" onclick="cart.removeItem(${index})">remove</i></button>
          </div>
        </li>
      `;
    });
  }
}

/* CART SIDEBAR END */

//ACTIVATES ITEMLIST AND FILTER CLASS DURING PAGE LOAD
const itemList = new ItemList();
itemList.fetchItems();

/* ACTIVATE CART CLASS */
const cart = new Cart();
cart.renderItems();

/* ACTIVATE FILTER CLASS */
const filter = new ItemFilter();
filter.fetchCategories();

/* MODAL/POPUP START */
//First div
const modal = document.createElement("div");
modal.id = "modal";
modal.classList.add("modal");
modal.classList.add("fade");
//Second div
const modal_dialog = document.createElement("div");
modal_dialog.classList.add("modal-dialog");
//third div
const modal_content = document.createElement("div");
modal_content.classList.add("modal-content");
function setModalContent(item, buy) {
  modal_content.innerHTML = `
    <div class="modal-header">
    <h4>${item.title}</h4>
    <button class="btn-close" data-bs-dismiss="modal" data-bs-target="#modal"></button>
  </div>
  <div class="modal-body">
    <div class="modal-rating-details">      
      <span>Rated ${item.rating.rate} by ${item.rating.count} users</span>
    </div>
    <div class="modal-item-description">
      <img class="modal-item-image" src="${item.image}">
     <span>${item.description}</span>
    </div>

  </div>
  <div class="modal-footer">
  
    <span>$${item.price} USD</span>
    <button id="modal-buy-btn-${buy}" class="modal-buy-btn">Add to cart</button>
  
  </div>
  `;

  let modalBuyBtn = document.getElementById(`modal-buy-btn-${buy}`);
  modalBuyBtn.addEventListener("click", () => {
    cart.addItem(item);
  });
}
//Adds second div (modalInner) inside first div (modalOuter)
modal.appendChild(modal_dialog);
modal_dialog.appendChild(modal_content);
document.body.append(modal);

/* MODAL/POPUP END */
