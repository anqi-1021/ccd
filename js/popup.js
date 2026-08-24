let element = document.getElementById("fullscreenPopup");

// fuera de function closePopUp esta memoria es permanente

function closePopUp() {
  element.classList.add('disable');
}
// creado disable –> ir a css y decorarlo

function openPopUp() {
  element.classList.remove('disable');
  //100000l
}

// para que disable quede activado = hidden al abrir la pag -> añadir disable al class en html para que funcione, sino simplemente queda creado este elemento (disable)

window.addEventListener("load", ()=> {
  document.querySelector('.fullscreen-popup-overlay')
  .addEventListener("click", closePopUp);

  // addEventListener = función escuche (cuando se haga "click" -> , closePopUp) –> se active esta función
  // ()=> es una función anónima, actúa una sola vez

  document.querySelector('.pop-up-modal-close')
  .addEventListener("click", closePopUp);

  let openPopUpBtn = document.querySelector('#open-popup');

  if (openPopUpBtn) {
    openPopUpBtn.addEventListener("click", openPopUp)
  }

});

// window -> cargar lo contenido dentro una vez la pag se haya cargado 100%