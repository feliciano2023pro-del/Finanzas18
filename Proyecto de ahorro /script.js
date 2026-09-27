let listaMovimientos = [];

try {
    const guardado = localStorage.getItem('app_finanzas_v7');
    if (guardado) {
        listaMovimientos = JSON.parse(guardado);
    }
} catch (e) {
    listaMovimientos = [];
}

function renderizar() {
    const ul = document.getElementById('listaMovimientos');
    const elAhorros = document.getElementById('totalAhorros');
    const elGastos = document.getElementById('totalGastos');

    if (!ul || !elAhorros || !elGastos) return;

    ul.innerHTML = '';
    let sumaAhorros = 0;
    let sumaGastos = 0;

    listaMovimientos.forEach((item, index) => {
        let color = '#fff';
        let categoria = '';
        let signo = '+';

        if (item.tipo === 'ahorro') {
            sumaAhorros += Number(item.monto);
            color = '#2196f3';
            categoria = '🏦 Bolsillo de Ahorro';
            signo = '+';
        } else {
            sumaGastos += Number(item.monto);
            sumaAhorros -= Number(item.monto); // Resta del ahorro disponible
            color = '#e53935';
            categoria = '🚨 Gasto / Emergencia';
            signo = '-'; // Forzamos el signo menos visualmente
        }

        const li = document.createElement('li');
        li.className = item.tipo;
        li.innerHTML = `
            <div class="info-mov">
                <span class="desc">${item.desc}</span>
                <span class="tipo-tag">${categoria}</span>
                <span class="monto-txt" style="color: ${color};">${signo}Bs. ${Number(item.monto).toFixed(2)}</span>
                <span class="fecha-txt">📅 ${item.fecha}</span>
            </div>
            <button class="delete-btn" onclick="borrarUno(${index})">🗑️</button>
        `;
        ul.appendChild(li);
    });

    elAhorros.textContent = `Bs. ${sumaAhorros.toFixed(2)}`;
    elGastos.textContent = `Bs. ${sumaGastos.toFixed(2)}`;

    try {
        localStorage.setItem('app_finanzas_v7', JSON.stringify(listaMovimientos));
    } catch (e) {}
}

function agregarMovimiento() {
    const descInput = document.getElementById('descripcion');
    const montoInput = document.getElementById('monto');
    const tipoInput = document.getElementById('tipo');

    if (!descInput || !montoInput || !tipoInput) return;

    const desc = descInput.value.trim();
    const monto = parseFloat(montoInput.value);

    if (desc === '' || isNaN(monto) || monto <= 0) {
        alert('Escribe una descripción y un monto válido mayor a 0.');
        return;
    }

    const ahora = new Date();
    const fechaFormateada = ahora.toLocaleDateString() + ' ' + ahora.toLocaleTimeString();

    listaMovimientos.push({
        desc: desc,
        monto: monto,
        tipo: tipoInput.value,
        fecha: fechaFormateada
    });

    descInput.value = '';
    montoInput.value = '';

    renderizar();
}

function borrarUno(index) {
    listaMovimientos.splice(index, 1);
    renderizar();
}

function reiniciarTodo() {
    if (confirm('¿Seguro que quieres borrar todos los registros?')) {
        listaMovimientos = [];
        localStorage.removeItem('app_finanzas_v7');
        renderizar();
    }
}

window.onload = renderizar;
