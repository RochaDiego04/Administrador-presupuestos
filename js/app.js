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

    agregarNuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter( gasto => gasto.id !== id );
        this.calcularRestante();
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

    mostrarGastos(arrayGastos){
        this.limpiarHTML();

        arrayGastos.forEach(gasto => {
            const {cantidad, nombre, id } = gasto;

            // Crear un LI
            const nuevoGasto = document.createElement('LI');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;

            // Agregar el HTML del gasto
            nuevoGasto.innerHTML = `
                ${nombre} <span class="badge badge-primary badge-pill"> $ ${cantidad}</span>
            `;

            // Boton para borrar el gasto
            const btnBorrar = document.createElement('BUTTON');
            btnBorrar.classList.add('btn','btn-danger','borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times;'
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            // Agregar al HTML
            gastoListado.appendChild(nuevoGasto);
        });
    }

    limpiarHTML() {
        while(gastoListado.firstChild){
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj){
        const { presupuesto, restante } = presupuestoObj;

        const restanteDiv = document.querySelector('.restante');

        // Comprobar 25%
        if( restante < (presupuesto * 0.25) ){
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        }
        else if ( restante < (presupuesto * 0.5) ){
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        }
        else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success')
        }

        // Si el total es 0 o menor
        if(restante <= 0) {
            objUI.mostrarAlerta('El presupuesto se ha agotado','error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }

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

    objUI.insertarPresupuesto(objPresupuesto);
}

function agregarGasto(e) {
    e.preventDefault();

    // Leer datos de formulario
    const nombre = document.querySelector('#gasto').value.trim();
    let cantidad = document.querySelector('#cantidad').value.trim();

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

    // Destructuring inverso, creando un objeto
    cantidad = Number(cantidad);
    const gasto = { nombre, cantidad, id: Date.now() }

    // Agregar nuevo gasto
    objPresupuesto.agregarNuevoGasto(gasto);
    
    // Mensaje de éxito
    objUI.mostrarAlerta('Gasto agregado correctamente');

    // Imprimir lso gastos
    const { gastos, restante } = objPresupuesto; // Obtener array con los gastos
    objUI.mostrarGastos(gastos);

    objUI.actualizarRestante(restante);

    // Cambiar color según el porcentaje restante para gastar
    objUI.comprobarPresupuesto(objPresupuesto);

    // Limpiar formulario
    formulario.reset();
}

function eliminarGasto(id){
    // Eliminar del objeto
    objPresupuesto.eliminarGasto(id);

    // Eliminar de la interfaz HTML
    const {gastos, restante} = objPresupuesto;
    objUI.mostrarGastos(gastos);
    objUI.actualizarRestante(restante);
    // Cambiar color según el porcentaje restante para gastar
    objUI.comprobarPresupuesto(objPresupuesto);

}