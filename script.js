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
  console.log("No es posible continuar con el siguiente paso ni calcular las prestaciones de ley.");

} else if (edad < 25) {
  // Si es mayor o igual a 18, pero menor de 25 años
  console.log("Usuario beneficiario por cotizante. No es posible continuar al siguiente paso.");

} else if (edad >= 60) {
  // Si la edad es 60 años o más
  console.log("Solo se calculará el pago de la pensión. Por favor, ingrese la información de su mesada pensional en el siguiente paso.");

} else {
  // Si no cumple ninguna de las anteriores (es decir, tiene entre 25 y 59 años)
  console.log("Puede continuar con el siguiente paso del proceso.");
  
}


