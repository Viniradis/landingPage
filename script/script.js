let modalQt = 1;
let cart = [];
let modalKey = 0;
const c = (el) => {
  return document.querySelector(el); 
}
const cs = (el) => document.querySelectorAll(el);

//Listagem dos produtos 
produtosJson.map((item, index) => {
  let produtoItem = c('.models .produto-item').cloneNode(true);

  produtoItem.setAttribute('data-key', index);
  produtoItem.querySelector('.produto-item--img img').src = item.img;
  produtoItem.querySelector('.produto-item--name').innerHTML = item.name;
  produtoItem.querySelector('.produto-item--desc').innerHTML = item.description;
  produtoItem.querySelector('.produto-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
  produtoItem.querySelector('a').addEventListener('click', (e) => {
    e.preventDefault();
    let key = e.target.closest('.produto-item').getAttribute('data-key');
    modalQt = 1;
    modalKey = key;

    c('.produtoInfo h1').innerHTML = produtosJson[key].name;
    c('.produtoInfo--desc').innerHTML = produtosJson[key].description;
    c('.produtoBig img').src = produtosJson[key].img;
    c('.produtoInfo--actualPrice').innerHTML = `R$ ${produtosJson[key].price.toFixed(2)}`;
    c('.produtoInfo--size.selected').classList.remove('selected');
    cs('.produtoInfo--size').forEach((size, sizeIndex) => { 
      if(sizeIndex == 2) {
        size.classList.add('selected');
      }
      size.querySelector('span').innerHTML = produtosJson[key].sizes[sizeIndex];
    });

    c('.produtoInfo--qt').innerHTML = modalQt;

    c('.produtoWindowArea').style.opacity = 0;
    c('.produtoWindowArea').style.display = 'flex';
    setTimeout(() => {
      c('.produtoWindowArea').style.opacity = 1;
    }, 200);
  });


  c('.produto-area').append( produtoItem );
});


// Eventos do modal 

function closeModal() {
  c('.produtoWindowArea').style.opacity = 0;
  setTimeout(() => {
    c('.produtoWindowArea').style.display = 'none';
  }, 500);
}

cs('.produtoInfo--cancelButton, .produtoInfo--cancelMobileButton').forEach((item) => {
  item.addEventListener('click',closeModal);
});

c('.produtoInfo--qtmenos').addEventListener('click', () =>{
  if(modalQt > 1) {
    modalQt--;
    c('.produtoInfo--qt').innerHTML = modalQt;
  }
});

c('.produtoInfo--qtmais').addEventListener('click', () =>{
  modalQt++;
  c('.produtoInfo--qt').innerHTML = modalQt;
});

cs('.produtoInfo--size').forEach((size, sizeIndex) => { 
  size.addEventListener('click', () => {
    c('.produtoInfo--size.selected').classList.remove('selected');
    size.classList.add('selected');
  });
});

c('.produtoInfo--addButton').addEventListener('click', () => {
  let size = parseInt(c('.produtoInfo--size.selected').getAttribute('data-key'));
  let identifier = produtosJson[modalKey].id+'@'+size;
  let key = cart.findIndex((item)=>item.identifier == identifier);
  if(key > -1) {
    cart[key].qt += modalQt;
  }else {
    cart.push({
      identifier,
      id:produtosJson[modalKey].id,
      size,
      qt:modalQt
    });
  }
  updateCart();
  closeModal();
});

function updateCart() {
  if(cart.length > 0) {
    c('aside').classList.add('show');
    c('.cart').innerHTML = '';

    let subtotal = 0;
    let desconto = 0;
    let total = 0;

    for(let i in cart) {
      let produtoItem = produtosJson.find((item)=>item.id == cart[i].id);
      subtotal += produtoItem.price * cart[i].qt;
      let cartItem = c('.models, .cart--item').cloneNode(true);

      cartItem.querySelector('img').src = produtoItem.img;
      cartItem.querySelector('.cart--item-nome').innerHTML = produtoItem.name;
      cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
      cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
        if(cart[i].qt > 1) {
          cart[i].qt--;
        }else {
          cart.splice(i, 1);
        }
        updateCart();
      })
      cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
        cart[i].qt++;
        updateCart();
        
      })

      

      c('.cart').append(cartItem);
    }

    desconto = subtotal * 0.1;
    total = subtotal - desconto;

    c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
    c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
    c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;


  }else {
    c('aside').classList.remove('show');
  }
}