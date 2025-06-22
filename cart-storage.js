(function(){
  const CART_KEY = 'cart';

  function loadCart(){
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  }
  function saveCart(cart){
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }
  function addToCart(item){
    const cart = loadCart();
    const existing = cart.find(p => p.name === item.name);
    if(existing){
      existing.quantity += item.quantity;
    }else{
      cart.push(item);
    }
    saveCart(cart);
  }
  function clearCart(){
    localStorage.removeItem(CART_KEY);
  }
  window.cartStorage = {loadCart, saveCart, addToCart, clearCart};
})();
