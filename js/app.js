// Variables
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

// Eventos
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    // formulario.addEventListener('submit',);
}


// Clases
class Presupuesto {
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }
}

class UI {

}

// Instancias
const objUI = new UI();
let objPresupuesto;

// Funciones

function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('Ingresa tu presupuesto disponible:');
    console.log( Number(presupuestoUsuario) );

    if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload();
    }

    objPresupuesto = new Presupuesto(presupuestoUsuario);
    console.log(objPresupuesto);
}