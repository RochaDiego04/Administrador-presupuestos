// Variables
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

// Eventos
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener('submit', agregarGasto);
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
    insertarPresupuesto(cantidad){
        const {presupuesto, restante} = cantidad;
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }
    mostrarAlerta(mensaje, tipo){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');
        
        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        }
        else {
            divMensaje.classList.add('alert-success');
        }

        // Agregar contenido
        divMensaje.textContent = mensaje;

        // Insertar al HTML
        document.querySelector('.primario').insertBefore(divMensaje, formulario);
        
        // Eliminar Alerta
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
}

// Instancias
const objUI = new UI();
let objPresupuesto;

// Funciones

function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('Ingresa tu presupuesto disponible:');

    if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload();
    }

    objPresupuesto = new Presupuesto(presupuestoUsuario);
    console.log(objPresupuesto);

    objUI.insertarPresupuesto(objPresupuesto);
}

function agregarGasto(e) {
    e.preventDefault();

    // Leer datos de formulario
    const nombre = document.querySelector('#gasto').value.trim();
    const cantidad = document.querySelector('#cantidad').value.trim();

    // Validar
    if( nombre === '' || cantidad === ''){
        objUI.mostrarAlerta('Ambos campos son obligatorios', 'error');
        return;
    }
    else if( cantidad <= 0 || isNaN(cantidad)){
        objUI.mostrarAlerta('El presupuesto no es válido', 'error');
        return;
    }
    else if( !isNaN(nombre)){
        objUI.mostrarAlerta('El nombre debe ser de formato texto', 'error');
        return;
    }
}