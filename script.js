let modalQt = 1;
let cart = [];
let modalKey = 0;

const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

// Listagem das pizzas
pizzaJson.map((item, index) => {
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;
    pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
    pizzaItem.querySelector(".pizza-item--price").innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector(".pizza-item--img img").src = item.img;

    pizzaItem.querySelector("a").addEventListener("click", (e) => {
        e.preventDefault();

        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = parseInt(key);

        c('.pizzaInfo h1').innerHTML = pizzaJson[modalKey].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[modalKey].description;
        c('.pizzaBig img').src = pizzaJson[modalKey].img;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[modalKey].price.toFixed(2)}`;

        c('.pizzaInfo--size.selected')?.classList.remove('selected');
        cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex === 2) size.classList.add('selected');
            size.setAttribute('data-key', sizeIndex);
            size.querySelector('span').innerHTML = pizzaJson[modalKey].sizes[sizeIndex];
        });

        c('.pizzaInfo--qt').innerHTML = modalQt;

        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });

    c('.pizza-area').append(pizzaItem);
});

// Fechar modal
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

c('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});

c('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

cs('.pizzaInfo--size').forEach((size) => {
    size.addEventListener('click', () => {
        c('.pizzaInfo--size.selected')?.classList.remove('selected');
        size.classList.add('selected');
    });
});

c('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    let identifier = pizzaJson[modalKey].id + '@' + size;
    let key = cart.findIndex((item) => item.identifier == identifier);

    if (key > -1) {
        cart[key].qt += modalQt;
    } else {
        cart.push({
            identifier: identifier,
            id: pizzaJson[modalKey].id,
            size: size,
            qt: modalQt
        });
    }

    updateCart();
    closeModal();
});

// Abrir carrinho
c('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        c('aside').style.left = '0';
    }
});

// Fechar carrinho
c('.menu-closer').addEventListener('click', () => {
    c('aside').style.left = '100vw';
});

function updateCart() {
    let totalItems = cart.reduce((sum, item) => sum + item.qt, 0);
    c('.menu-openner span').innerHTML = totalItems;

    if (cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let discount = 0;
        let total = 0;

        for (let i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch (cart[i].size) {
                case 0: pizzaSizeName = 'P'; break;
                case 1: pizzaSizeName = 'M'; break;
                case 2: pizzaSizeName = 'G'; break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaItem.sizes[cart[i].size]})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            // ✅ Corrigido: botões com classes do seu HTML
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });

            c('.cart').append(cartItem);
        }

        discount = subtotal * 0.1;
        total = subtotal - discount;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${discount.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}
