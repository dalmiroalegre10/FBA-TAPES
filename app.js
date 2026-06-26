const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbw4vFydYfWiK3bHQQt6mWqhfWacfQFoa2nye4VpfwDeHphWYmi6dXkI8ARWLwu34Xs/exec";
const ESCALAS = [
    {monto:150000, descuento:10},
    {monto:200000, descuento:15},
    {monto:350000, descuento:20}
];

const productos = [
 {
 id:1,
 nombre:"D3 Sport Tape 3.8 cm",
 precio: 5300,
 pack:"Pack x6 $29.400",
 packCantidad: 6,
packPrecio:29400,
 cantidad:0,
 imagen:"D3_Sport_Tape_blanco.jpg.jpeg"
 },

 {
 id:2,
 nombre:"D3 Sport Tape 5 cm",
 precio: 6300,
 pack:"Pack x6 $35.000",
 packCantidad: 6,
 packPrecio:35000,
 cantidad:0,
 imagen:"D3_Sport_Tape_blanco.jpg.jpeg"
 },

 {
 id:3,
 nombre:"Tacsa PVC Tape",
 precio: 2700,
 pack:"-",
 cantidad:0,
 imagen:"Tacsa_PVC_Tape_Termosellado_negro.jpg.jpeg"
 },
 {
 id:4,
 nombre:"Hipoalergic Negra",
 precio: 6800,
 pack:"Pack x6 $40.000",
  packCantidad:6,
  packPrecio:40000,
 cantidad:0,
 imagen:"Hipoalergenic_Cinta_Adhesiva_Deportiva_negro.jpg.jpeg"
 },
 {
 id:5,
 nombre:"Light Rip Tape Blanco",
 precio: 11000,
 pack:"Pack x4 $40.000",
 packCantidad:4,
 packPrecio:40000,
 cantidad:0,
 imagen:"D3_Light_Rip_Tape_blanco.jpg.jpeg"
 },
 {
 id:6,
 nombre:"Light Rip Tape Negro",
 precio: 11000,
 pack:"Pack x4 $40.000",
  packCantidad:4,
  packPrecio:40000,
 cantidad:0,
 imagen:"D3_Light_Rip_Tape_negro.jpg.jpeg"
 },
 {
 id:7,
 nombre:"Cohesiva Blanca",
 precio: 5000,
 pack:"Pack x6 $27.000",
  packCantidad:6,
  packPrecio:27000,
 cantidad:0,
 imagen:"D3_Tape_Cohesive_Polybag_blanco.jpg.jpeg"
 },
 {
 id:8,
 nombre:"Cohesiva Negra",
 precio: 5000,
 pack:"Pack x6 $27.000",
  packCantidad:6,
  packPrecio:27000,
 cantidad:0,
 imagen:"D3_Tape_Cohesive_Polybag_negro.jpg.jpeg"
 },
 {
 id:9,
 nombre:"Hypofix",
 precio: 10500,
 pack:"Pack x4 $38.000",
  packCantidad:4,
  packPrecio:38000,
 cantidad:0,
 imagen:"D3_HypoFix_blanco.jpg.jpeg"
 },
 {
 id:10,
 nombre:"RST Beige",
 precio: 8800,
 pack:"Pack x4 $32.000",
  packCantidad:4,
  packPrecio:32000,
 cantidad:0,
 imagen:"D3_RST_Rigid_Tape_beige.jpg.jpeg"
 },
 {
 id:11,
 nombre:"Protector Bucal Premium",
 precio: 15000,
 pack:"-",
 cantidad:0,
 imagen:"D3_Protector_Bucal_Premium_Doble_Gel.jpg.jpeg"
 }
 ];

const catalogo = document.getElementById("catalogo");
function renderizar() {
 console.log("renderizando catalogo");
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
function actualizarResumen() {
    const listaPedido = document.getElementById("listaPedido");
    const totalPedido = document.getElementById("totalPedido");
    if (!listaPedido || !totalPedido) return;
    listaPedido.innerHTML = "";
    let total = 0;
    const seleccionados = productos.filter(p => p.cantidad > 0);
    if (seleccionados.length === 0) {
        listaPedido.innerHTML = "No hay productos seleccionados.";
        totalPedido.textContent = "0";
        return;
    }
    seleccionados.forEach(producto => {
        let subtotal;
        let texto;
        if (producto.packCantidad) {
            const packs = Math.floor(producto.cantidad / producto.packCantidad);
            const sueltos = producto.cantidad % producto.packCantidad;
            subtotal = packs * producto.packPrecio + sueltos * producto.precio;
            if (packs > 0 && sueltos > 0) {
                texto = `${producto.nombre}: ${packs} Pack x${producto.packCantidad} + ${sueltos} unidades = $${subtotal.toLocaleString()}`;
            } else if (packs > 0) {
                texto = `${producto.nombre}: ${packs} Pack x${producto.packCantidad} = $${subtotal.toLocaleString()}`;
            } else {
                subtotal = producto.cantidad * producto.precio;
                texto = `${producto.nombre} x${producto.cantidad} = $${subtotal.toLocaleString()}`;
            }
        } else {
            subtotal = producto.cantidad * producto.precio;
            texto = `${producto.nombre} x${producto.cantidad} = $${subtotal.toLocaleString()}`;
        }
        const item = document.createElement("p");
        item.textContent = texto;
        listaPedido.appendChild(item);
        total += subtotal;
    });
    totalPedido.textContent = total.toLocaleString();
    actualizarProgresoDivision();
}

async function actualizarProgresoDivision(){
    const division = document.getElementById("division").value;
    if(division=="") return;
    const respuesta = await fetch(URL_SCRIPT+"?division="+division);
    const datos = await respuesta.json();
    const total = datos.total || 0;
    document.getElementById("totalDivision").textContent =
        total.toLocaleString();
    let siguiente = ESCALAS.find(e=>total<e.monto);
    if(!siguiente){
        document.getElementById("barraProgreso").style.width="100%";

        document.getElementById("mensajeDescuento").innerHTML=
        "🎉 ¡La división ya alcanzó el 20% de descuento!";
        return;
    }
    let anterior=0;
    if(siguiente.descuento==15)
        anterior=150000;
    if(siguiente.descuento==20)
        anterior=200000;
    const porcentaje=((total-anterior)/(siguiente.monto-anterior))*100;
    document.getElementById("barraProgreso").style.width=
        Math.max(0,Math.min(100,porcentaje))+"%";
    const falta=siguiente.monto-total;
    document.getElementById("mensajeDescuento").innerHTML=
        `Faltan <b>$${falta.toLocaleString()}</b> para llegar al <b>${siguiente.descuento}%</b> de descuento.`;
}

 
function sumar(id) {
const producto = productos.find(p => p.id === id);
if (producto) {
 producto.cantidad++;
 renderizar();
 }
}
function restar(id) {
const producto = productos.find(p => p.id === id);
if (producto && producto.cantidad > 0) {
 producto.cantidad --;
 renderizar();
 }
}

renderizar();
function actualizarProgresoDivision(){
    document.getElementById("division").addEventListener("change", actualizarProgresoDivision);
}
const botonEnviar = document.getElementById("enviarPedido");
if (botonEnviar) {
botonEnviar.addEventListener("click", async () => {
const nombre = document.getElementById("nombre").value;
 const whatsapp = document.getElementById("whatsapp").value;
 const instagram = document.getElementById("instagram").value;
const pedido = productos
 .filter(p => p.cantidad > 0)
    .map(p => {
        if (p.packCantidad) {
            const packs = Math.floor(p.cantidad / p.packCantidad);
            const sueltos = p.cantidad % p.packCantidad;
            if (packs > 0 && sueltos > 0) {
                return `${p.nombre}: ${packs} Pack x${p.packCantidad} + ${sueltos} unidades`;
            } else if (packs > 0) {
                return `${p.nombre}: ${packs} Pack x${p.packCantidad}`;
            }
        }
        return `${p.nombre} x${p.cantidad}`;
    })
 .join("\n");
if (!nombre || !whatsapp || pedido === "") {
alert("Completá tus datos y seleccioná productos.");
 return;
}
const division = document.getElementById("division").value;
const total = productos.reduce((suma, p) => {
  if (p.cantidad === 0) return suma;
  if (p.packCantidad) {
    const packs = Math.floor(p.cantidad / p.packCantidad);
    const sueltos = p.cantidad % p.packCantidad;
    return suma + packs * p.packPrecio + sueltos * p.precio;
  }
  return suma + p.cantidad * p.precio;
}, 0);
const datos = {
  nombre,
  whatsapp,
  instagram,
  division,
  pedido,
  total
};

try {
await fetch(URL_SCRIPT, {
  method: "POST",
  mode: "no-cors",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(datos)
});

alert("Pedido enviado correctamente.");
document.getElementById("nombre").value = "";
document.getElementById("whatsapp").value = "";
document.getElementById("instagram").value = "";
productos.forEach(p => p.cantidad = 0);
renderizar();
 actualizarResumen(); 

} catch (error) {
alert("Error al enviar el pedido.");
 console.error(error);
}
});
}
