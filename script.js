//definicion de variables 
let nombreCompleto="";
let edad= 0;
let tipoDocumento="";
let numeroDocumento= ""; 

// Siguiente paso
let salario = 0;
let comisiones = 0;
let horasextra = 0;
let riesgo = "";

// Valores
const salarioMinimo = 1750905;
const transporte = 249095;
const salarioIntegral = 22761765;
const valorTributario = 52.37;

// Porcentajes
const saludPorcentaje = 0.4;

//condicionales
if (edad < 18) {
  // Si el usuario es menor de edad
  console.log("No es posible continuar con el siguiente paso ni calcular las prestaciones de ley");

} else if (edad < 25) {
  // Si es mayor o igual a 18, pero menor de 25 años
  console.log("Usuario beneficiario por cotizante. No es posible continuar al siguiente paso");

} else if (edad >= 60) {
  // Si la edad es 60 años o más
  console.log("Solo se calculará el pago de la pensión. Por favor, ingrese la información de su mesada pensional en el siguiente paso");

} else {
  // Si no cumple ninguna de las anteriores (es decir, tiene entre 25 y 59 años)
  console.log("Puede continuar con el siguiente paso del proceso");
  
}

// Calculos

// 1. Devengado 
let totalDevengado = salario + comisiones + horasextra; 

//Calculo del ibc
let ibc = 0;
if (salario >= salarioIntegral) {
  ibc = totalDevengado * 0.70;
} else {
  ibc = totalDevengado; 
}

//auxilio de Transporte
let auxilioTransporte = 0;
if (salario <= (salarioMinimo * 2)) {
  auxilioTransporte = transporte;
}

// Salud (4% sobre el IBC)
let pagoSalud = ibc * 0.04;

// Pensión y Fondo de Solidaridad Pensional (FSP)
let pagoPension = ibc * 0.04;
let pagoFSP = 0; 

// Si el IBC es mayor o igual a 4 salarios mínimos, paga 1% de FSP
if (ibc >= (salarioMinimo * 4)) {
  pagoFSP = ibc * 0.01;
}
let totalPension = pagoPension + pagoFSP;

// 6. ARL según el nivel de riesgo

let porcentajeARL = 0;
switch (riesgo) {
  case "1": 
    porcentajeARL = 0.00522; // Riesgo I: 0.522%
    break;
  case "2": 
    porcentajeARL = 0.01044; // Riesgo II: 1.044%
    break;
  case "3": 
    porcentajeARL = 0.02436; // Riesgo III: 2.436%
    break;
  case "4": 
    porcentajeARL = 0.04350; // Riesgo IV: 4.350%
    break;
  case "5": 
    porcentajeARL = 0.06960; // Riesgo V: 6.960%
    break;
  default:
    porcentajeARL = 0; // Por si el usuario no ingresa un nivel válido
}
let pagoARL = ibc * porcentajeARL;

// 7. Retención en la Fuente (Punto extra)
let baseGravable = totalDevengado - pagoSalud - pagoPension;


