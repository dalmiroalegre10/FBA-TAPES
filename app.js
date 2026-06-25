const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbywyuyZ4KbK6_2CWdxZHukIENnLdWr1NYR5ohdCBOp6iSmf2vlirfrBca-cGx503A2T/exec";
const productos = [
 {
 id:1,
 nombre:"D3 Sport Tape 3.8 cm",
 precio: 5300,
 pack:"Pack x6 $29.400",
 cantidad:0,
 imagen:"D3_Sport_Tape_blanco.jpg.jpeg"
 },

 {
 id:2,
 nombre:"D3 Sport Tape 5 cm",
 precio: 6300,
 pack:"Pack x6 $35.000",
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
 cantidad:0,
 imagen:"Hipoalergenic_Cinta_Adhesiva_Deportiva_negro.jpg.jpeg"
 },
 {
 id:5,
 nombre:"Light Rip Tape Blanco",
 precio: 11000,
 pack:"Pack x4 $40.000",
 cantidad:0,
 imagen:"D3_Light_Rip_Tape_blanco.jpg.jpeg"
 },
 {
 id:6,
 nombre:"Light Rip Tape Negro",
 precio: 11000,
 pack:"Pack x4 $40.000",
 cantidad:0,
 imagen:"D3_Light_Rip_Tape_negro.jpg.jpeg"
 },
 {
 id:7,
 nombre:"Cohesiva Blanca",
 precio: 5000,
 pack:"Pack x6 $27.000",
 cantidad:0,
 imagen:"D3_Tape_Cohesive_Polybag_blanco.jpg.jpeg"
 },
 {
 id:8,
 nombre:"Cohesiva Negra",
 precio: 5000,
 pack:"Pack x6 $27.000",
 cantidad:0,
 imagen:"D3_Tape_Cohesive_Polybag_negro.jpg.jpeg"
 },
 {
 id:9,
 nombre:"Hypofix",
 precio: 10500,
 pack:"Pack x4 $38.000",
 cantidad:0,
 imagen:"D3_HypoFix_blanco.jpg.jpeg"
 },
 {
 id:10,
 nombre:"RST Beige",
 precio: 8800,
 pack:"Pack x4 $32.000",
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
const botonEnviar = document.getElementById("enviarPedido");
if (botonEnviar) {
botonEnviar.addEventListener("click", async () => {
const nombre = document.getElementById("nombre").value;
 const whatsapp = document.getElementById("whatsapp").value;
 const instagram = document.getElementById("instagram").value;
const pedido = productos
 .filter(p => p.cantidad > 0)
 .map(p => `${p.nombre} x${p.cantidad}`)
 .join("", "\n");
if (!nombre || !whatsapp || pedido === "") {
alert("Completá tus datos y seleccioná productos.");
 return;
}
const datos = {
 nombre,
 whatsapp,
 instagram,
 pedido
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
