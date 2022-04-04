const criptoSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const resultado = document.querySelector('#resultado');


const form = document.querySelector('#formulario');
const objBusqueda ={
    moneda: '',
    criptomoneda: ''
}

const obtenerCriptos = criptos => new Promise(resolve =>{
    resolve(criptos);
})
document.addEventListener('DOMContentLoaded',()=>{
    consultarCriptomonedas();
    form.addEventListener('submit',submitForm);
    criptoSelect.addEventListener('change',leerValor);
    monedaSelect.addEventListener('change',leerValor);

})
function consultarCriptomonedas(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
    fetch(url)
        .then(consulta => consulta.json())
        .then(respuesta => obtenerCriptos(respuesta.Data))
        .then(criptomonedas => selectCriptos(criptomonedas))
}
function selectCriptos(criptomoneda){
    criptomoneda.forEach(crypto => {
        const {FullName,Name} = crypto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptoSelect.appendChild(option);
        
    });
}
function leerValor(e){
    objBusqueda[e.target.name] = e.target.value;
}
function submitForm(e){
    e.preventDefault();
    const {moneda,criptomoneda} = objBusqueda;
    if (moneda === '' || criptomoneda === ''){
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }
    consultarApi();


}
function mostrarAlerta(msg){
    const existeError = document.querySelector('.error');
    if(!existeError){
       LimpiarHTML();

        const divMsg = document.createElement('div');
        divMsg.classList.add('error');
    
        divMsg.textContent = msg;
        form.appendChild(divMsg);
        setTimeout(()=>{
            divMsg.remove();
        },3000)
    
    }
  
}
function consultarApi(){
    const {moneda,criptomoneda} = objBusqueda;
const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
mostrarSpinner();


fetch(url)
    .then(consulta => consulta.json())
    .then(rpt => mostrarCotizacionHTML(rpt.DISPLAY[criptomoneda][moneda]))
}
function mostrarCotizacionHTML(cotizacion){
   LimpiarHTML();
    const {PRICE, HIGHDAY, LOWDAY,CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;
    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es: <span> ${PRICE} </span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `Precio más alto del día <span> ${HIGHDAY} </span>`;
    
    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `Precio más bajo del día <span> ${LOWDAY} </span>`;

    const variacionUltimasHoras = document.createElement('p');
    variacionUltimasHoras.innerHTML = `Variación últimas 24 horas <span> ${CHANGEPCT24HOUR}% </span>`;

    const ultimaAct = document.createElement('p');
    ultimaAct.innerHTML = `Última actualización <span> ${LASTUPDATE} </span>`;



    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(variacionUltimasHoras);
    resultado.appendChild(ultimaAct);



}
function LimpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}
function mostrarSpinner(){
 LimpiarHTML();
 const spinner = document.createElement('div');
 spinner.classList.add('sk-cube-grid');
 spinner.innerHTML = `
 
  <div class="sk-cube sk-cube1"></div>
  <div class="sk-cube sk-cube2"></div>
  <div class="sk-cube sk-cube3"></div>
  <div class="sk-cube sk-cube4"></div>
  <div class="sk-cube sk-cube5"></div>
  <div class="sk-cube sk-cube6"></div>
  <div class="sk-cube sk-cube7"></div>
  <div class="sk-cube sk-cube8"></div>
  <div class="sk-cube sk-cube9"></div>

 `;
 resultado.appendChild(spinner);
}