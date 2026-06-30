const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbw4vFydYfwIk3bHQQt6mWqhfWacfQFoa2nye4VpfwDeHfphWYmi6dXkI8ARWLwu34xS/exec";
const ESCALAS = [
    { monto: 150000, descuento: 10 },
    { monto: 200000, descuento: 15 },
    { monto: 350000, descuento: 20 }
];

const productos = [
    { id: 1, nombre: "D3 Sport Tape (3.8 cm x 10mts)", precio: 5300, pack: "Pack x6 $29.400", packCantidad: 6, packPrecio: 29400, cantidad: 0, imagen: "D3_Sport_Tape_blanco.jpg.jpeg" },
    { id: 2, nombre: "D3 Sport Tape (5 cm x 10 mts)", precio: 6500, pack: "Pack x6 $35.000", packCantidad: 6, packPrecio: 35000, cantidad: 0, imagen: "D3_Sport_Tape_blanco.jpg.jpeg" },
    { id: 3, nombre: "Tacsa PVC Tape (1.8 cm x 20 mts)", precio: 2700, pack: "-", cantidad: 0, imagen: "Tacsa_PVC_Tape_Termosellado_negro.jpg.jpeg" },
    { id: 4, nombre: "Hipoalergic Negra (5 cm x 9 mts)", precio: 6800, pack: "Pack x6 $40.000", packCantidad: 6, packPrecio: 40000, cantidad: 0, imagen: "Hipoalergenic_Cinta_Adhesiva_Deportiva_negro.jpg.jpeg" },
    { id: 5, nombre: "Light Rip Tape Blanco (7.5 cm x 7 mts)", precio: 11000, pack: "Pack x4 $40.000", packCantidad: 4, packPrecio: 40000, cantidad: 0, imagen: "D3_Light_Rip_Tape_blanco.jpg.jpeg" },
    { id: 6, nombre: "Light Rip Tape Negro (7.5 cm x 7 mts)", precio: 11000, pack: "Pack x4 $40.000", packCantidad: 4, packPrecio: 40000, cantidad: 0, imagen: "D3_Light_Rip_Tape_negro.jpg.jpeg" },
    { id: 7, nombre: "Cohesiva Blanca (7.5 cm x 7 mts)", precio: 5000, pack: "Pack x6 $27.000", packCantidad: 6, packPrecio: 27000, cantidad: 0, imagen: "D3_Tape_Cohesive_Polybag_blanco.jpg.jpeg" },
    { id: 8, nombre: "Cohesiva Negra (7.5 cm x 7 mts)", precio: 5000, pack: "Pack x6 $27.000", packCantidad: 6, packPrecio: 27000, cantidad: 0, imagen: "D3_Tape_Cohesive_Polybag_negro.jpg.jpeg" },
    { id: 9, nombre: "Hypofix (10 cm x 10 mts)", precio: 10500, pack: "Pack x4 $38.000", packCantidad: 4, packPrecio: 38000, cantidad: 0, imagen: "D3_HypoFix_blanco.jpg.jpeg" },
    { id: 10, nombre: "RST Beige (3.8 cm x 10 mts)", precio: 8800, pack: "Pack x4 $32.000", packCantidad: 4, packPrecio: 32000, cantidad: 0, imagen: "D3_RST_Rigid_Tape_beige.jpg.jpeg" },
    { id: 11, nombre: "Protector Bucal Premium", precio: 15000, pack: "-", cantidad: 0, imagen: "D3_Protector_Bucal_Premium_Doble_Gel.jpg.jpeg" }
];

const catalogo = document.getElementById("catalogo");

function renderizar() {
    catalogo.innerHTML = "";
    productos.forEach((producto) => {
        catalogo.innerHTML += `
      <div class="producto">
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h4>${producto.nombre}</h4>
        <p>Precio: $${producto.precio.toLocaleString()}</p>
        <p>${producto.pack}</p>
        <div class="controles">
          <button onclick="restar(${producto.id})">-</button>
          <span>${producto.cantidad}</span>
          <button onclick="sumar(${producto.id})">+</button>
        </div>
      </div>
        `;
    });
    actualizarResumen();
}

function calcularSubtotal(producto) {
    if (producto.packCantidad) {
        const packs = Math.floor(producto.cantidad / producto.packCantidad);
        const sueltos = producto.cantidad % producto.packCantidad;
        return packs * producto.packPrecio + sueltos * producto.precio;
    }
    return producto.cantidad * producto.precio;
}

function actualizarResumen() {
    const listaPedido = document.getElementById("listaPedido");
    const totalPedido = document.getElementById("totalPedido");
    if (!listaPedido || !totalPedido) return;

    listaPedido.innerHTML = "";
    let total = 0;
    const seleccionados = productos.filter(p => p.cantidad > 0);

    if (seleccionados.length === 0) {
        listaPedido.innerHTML = "<p class='pedido-vacio'>No hay productos seleccionados.</p>";
        totalPedido.textContent = "0";
        actualizarDescuentoLocal(0);
        return;
    }

    seleccionados.forEach(producto => {
        const subtotal = calcularSubtotal(producto);
        let texto;

        if (producto.packCantidad) {
            const packs = Math.floor(producto.cantidad / producto.packCantidad);
            const sueltos = producto.cantidad % producto.packCantidad;
            if (packs > 0 && sueltos > 0) {
                texto = `${producto.nombre}: ${packs} Pack x${producto.packCantidad} + ${sueltos} ud. = $${subtotal.toLocaleString()}`;
            } else if (packs > 0) {
                texto = `${producto.nombre}: ${packs} Pack x${producto.packCantidad} = $${subtotal.toLocaleString()}`;
            } else {
                texto = `${producto.nombre} x${producto.cantidad} = $${subtotal.toLocaleString()}`;
            }
        } else {
            texto = `${producto.nombre} x${producto.cantidad} = $${subtotal.toLocaleString()}`;
        }

        const item = document.createElement("p");
        item.textContent = texto;
        listaPedido.appendChild(item);
        total += subtotal;
    });

    totalPedido.textContent = total.toLocaleString();
    actualizarDescuentoLocal(total);
    actualizarProgresoDivision();
}

// Muestra el descuento que aplica al pedido actual del usuario (sin fetch)
function actualizarDescuentoLocal(totalUsuario) {
    const descuentoBox = document.getElementById("descuentoUsuario");
    const descuentoTexto = document.getElementById("textoDescuentoUsuario");
    if (!descuentoBox || !descuentoTexto) return;

    // Encontrar el descuento que aplica según el total de la división
    // (se actualiza junto con el progreso de división)
    // Este bloque se actualiza desde actualizarProgresoDivision una vez que llega la data
}

// Consulta el total acumulado de la división al servidor y actualiza la UI
async function actualizarProgresoDivision() {
    const divisionEl = document.getElementById("division");
    if (!divisionEl) return;
    const division = divisionEl.value;

    const mensajeDescuento = document.getElementById("mensajeDescuento");
    const barraProgreso = document.getElementById("barraProgreso");
    const totalDivisionEl = document.getElementById("totalDivision");
    const descuentoBox = document.getElementById("descuentoBox");
    const descuentoValor = document.getElementById("descuentoValor");
    const descuentoAhorro = document.getElementById("descuentoAhorro");
    const logroDescuento = document.getElementById("logroDescuento");

   if (!division) {
        // Sin división seleccionada, resetear
        if (barraProgreso) barraProgreso.style.width = "0%";
        if (totalDivisionEl) totalDivisionEl.textContent = "0";
        if (mensajeDescuento) mensajeDescuento.innerHTML = "Seleccioná tu división para ver el descuento acumulado.";
        if (descuentoBox) descuentoBox.classList.remove("activo");
        if (logroDescuento) logroDescuento.classList.remove("activo");
        return;
    }

    try {
        const respuesta = await fetch(URL_SCRIPT + "?division=" + encodeURIComponent(division));
        const datos = await respuesta.json();
        const totalDivision = datos.total || 0;

        if (totalDivisionEl) totalDivisionEl.textContent = totalDivision.toLocaleString();

        // Determinar descuento actual
        let descuentoActual = 0;
        for (const escala of ESCALAS) {
            if (totalDivision >= escala.monto) descuentoActual = escala.descuento;
        }

        // Determinar próximo escalón
        const siguiente = ESCALAS.find(e => totalDivision < e.monto);

        // Actualizar barra
        if (siguiente) {
            const anterior = siguiente.descuento === 10 ? 0 : siguiente.descuento === 15 ? 150000 : 200000;
            const porcentaje = ((totalDivision - anterior) / (siguiente.monto - anterior)) * 100;
            if (barraProgreso) barraProgreso.style.width = Math.max(0, Math.min(100, porcentaje)) + "%";
            const falta = siguiente.monto - totalDivision;
            if (mensajeDescuento) mensajeDescuento.innerHTML =
                `Faltan <strong>$${falta.toLocaleString()}</strong> para que ${division} alcance el <strong>${siguiente.descuento}%</strong> de descuento.`;
        } else {
            if (barraProgreso) barraProgreso.style.width = "100%";
            if (mensajeDescuento) mensajeDescuento.innerHTML =
                `🏆 <strong>${division}</strong> ya tiene el <strong>20% de descuento</strong> — ¡el máximo!`;
        }

        // Mostrar descuento aplicable en el resumen del usuario
        if (logroDescuento) {
            if (descuentoActual > 0) {
                let proximoTexto = "";
                if (siguiente) {
                    const falta = siguiente.monto - totalDivision;
                    proximoTexto = ` Faltan $${falta.toLocaleString()} para llegar al ${siguiente.descuento}%.`;
                } else {
                    proximoTexto = " ¡Ya está en el máximo descuento posible!";
                }
                logroDescuento.innerHTML = `
                    <div class="logro-titulo"> Descuento alcanzado! </div>
                    <div class="logro-mensaje"><strong>${division}</strong> alcanzó el <strong>${descuentoActual}%</strong> de descuento.${proximoTexto}</div>
                `;
                logroDescuento.classList.add("activo");
            } else {
                logroDescuento.classList.remove("activo");
            }
        }
        if (descuentoBox && descuentoValor && descuentoAhorro) {
            if (descuentoActual > 0) {
                const totalUsuario = productos.reduce((s, p) => s + (p.cantidad > 0 ? calcularSubtotal(p) : 0), 0);
                const ahorro = Math.round(totalUsuario * descuentoActual / 100);
                descuentoValor.textContent = descuentoActual;
                descuentoAhorro.textContent = ahorro.toLocaleString();
                descuentoBox.classList.add("activo");
            } else {
                descuentoBox.classList.remove("activo");
            }
        }

    } catch (error) {
        console.error("Error al obtener progreso de división:", error);
        if (mensajeDescuento) mensajeDescuento.innerHTML = "No se pudo cargar el progreso. Intentá de nuevo.";
    }
}

function sumar(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) { producto.cantidad++; renderizar(); }
}

function restar(id) {
    const producto = productos.find(p => p.id === id);
    if (producto && producto.cantidad > 0) { producto.cantidad--; renderizar(); }
}

// Event listener para cambio de división
document.getElementById("division").addEventListener("change", actualizarProgresoDivision);

renderizar();

// Envío del pedido
const botonEnviar = document.getElementById("enviarPedido");
if (botonEnviar) {
    botonEnviar.addEventListener("click", async () => {
        const nombre = document.getElementById("nombre").value.trim();
        const whatsapp = document.getElementById("whatsapp").value.trim();
        const instagram = document.getElementById("instagram").value.trim();
        const division = document.getElementById("division").value;

        const pedido = productos
            .filter(p => p.cantidad > 0)
            .map(p => {
                if (p.packCantidad) {
                    const packs = Math.floor(p.cantidad / p.packCantidad);
                    const sueltos = p.cantidad % p.packCantidad;
                    if (packs > 0 && sueltos > 0) return `${p.nombre}: ${packs} Pack x${p.packCantidad} + ${sueltos} unidades`;
                    if (packs > 0) return `${p.nombre}: ${packs} Pack x${p.packCantidad}`;
                }
                return `${p.nombre} x${p.cantidad}`;
            })
            .join("\n");

        if (!nombre || !whatsapp || pedido === "") {
            alert("Completá tus datos y seleccioná productos.");
            return;
        }

        const total = productos.reduce((suma, p) => suma + (p.cantidad > 0 ? calcularSubtotal(p) : 0), 0);

        const datos = { nombre, whatsapp, instagram, division, pedido, total };

        try {
            await fetch(URL_SCRIPT, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });
            alert("Pedido enviado correctamente.");
            document.getElementById("nombre").value = "";
            document.getElementById("whatsapp").value = "";
            document.getElementById("instagram").value = "";
            productos.forEach(p => p.cantidad = 0);
            renderizar();
        } catch (error) {
            alert("Error al enviar el pedido.");
            console.error(error);
        }
    });
}
