// Angye Paola Laverde Perez 1031812584

// ===== CONSTANTES 2026 =====
var SALARIO_MINIMO = 1750905;
var AUXILIO_TRANSP = 249095;
var SALARIO_INTEGRAL = 22761765;
var UVT = 52.37;

var esPensionado = false;

// ===== FORMATEAR MONEDA =====
function formatCOP(valor) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(valor);
}

// ===== MOSTRAR / OCULTAR SECCIONES =====
function mostrarSeccion(id) {
    document.getElementById('paso-1').classList.add('oculto');
    document.getElementById('paso-2').classList.add('oculto');
    document.getElementById('paso-3').classList.add('oculto');
    document.getElementById(id).classList.remove('oculto');
}

// ===== PASO 1: VALIDAR PERFIL =====
function validarPerfil() {
    var nombre  = document.getElementById('nombre').value.trim();
    var edad    = parseInt(document.getElementById('edad').value);
    var tipoDoc = document.getElementById('tipo-doc').value;
    var numDoc  = document.getElementById('num-doc').value.trim();
    var alerta  = document.getElementById('alerta-perfil');

    alerta.textContent = '';

    // Validar campos vacíos
    if (!nombre) {
        alerta.textContent = 'Por favor ingresa tu nombre completo.';
        return;
    }
    if (!edad || isNaN(edad)) {
        alerta.textContent = 'Por favor ingresa una edad válida.';
        return;
    }
    if (edad < 0 || edad > 85) {
        alerta.textContent = 'La edad debe estar entre 0 y 120 años.';
        return;
    }
    if (!tipoDoc) {
        alerta.textContent = 'Por favor selecciona un tipo de documento.';
        return;
    }
    if (!numDoc) {
        alerta.textContent = 'Por favor ingresa tu número de documento.';
        return;
    }
    if (!/^\d+$/.test(numDoc)) {
        alerta.textContent = 'El número de documento solo puede contener dígitos, sin puntos ni comas.';
        return;
    }

    // Validar consistencia edad - tipo de documento
    if (tipoDoc === 'RC' && edad >= 7) {
        alerta.textContent = 'El Registro Civil es solo para menores de 7 años.';
        return;
    }
    if (tipoDoc === 'TI' && (edad < 7 || edad >= 18)) {
        alerta.textContent = 'La Tarjeta de Identidad es para personas entre 7 y 17 años.';
        return;
    }
    if (tipoDoc === 'CC' && edad < 18) {
        alerta.textContent = 'La Cédula de Ciudadanía es para mayores de 18 años.';
        return;
    }

    // Reglas de negocio por edad
    if (edad < 18) {
        alerta.textContent = 'Eres menor de edad. No es posible calcular prestaciones laborales.';
        return;
    }
    if (edad < 25) {
        alerta.textContent = 'Te clasificas como "Usuario beneficiario por cotizante". No puedes continuar al siguiente paso.';
        return;
    }

    // Configurar paso 2 según la edad
    esPensionado = edad >= 60;

    if (esPensionado) {
        document.getElementById('titulo-paso2').textContent = 'Paso 2 - Mesada Pensional';
        document.getElementById('label-salario').textContent = 'Mesada pensional (COP):';
        document.getElementById('campos-extra').classList.add('oculto');
    } else {
        document.getElementById('titulo-paso2').textContent = 'Paso 2 - Información Salarial';
        document.getElementById('label-salario').textContent = 'Salario base (COP):';
        document.getElementById('campos-extra').classList.remove('oculto');
    }

    mostrarSeccion('paso-2');
}

// ===== VOLVER AL PASO 1 =====
function volverPaso1() {
    document.getElementById('alerta-perfil').textContent = '';
    mostrarSeccion('paso-1');
}

// ===== PASO 2: CALCULAR PRESTACIONES =====
function calcularPrestaciones() {
    var salarioRaw = document.getElementById('salario').value.trim();
    var salario    = parseFloat(salarioRaw);

    if (!salarioRaw || isNaN(salario) || salario < 0) {
        alert('Por favor ingresa un valor de salario válido.');
        return;
    }
    if (!esPensionado && salario < SALARIO_MINIMO) {
        alert('El salario no puede ser menor al mínimo legal vigente (' + formatCOP(SALARIO_MINIMO) + ').');
        return;
    }

    // Modo pensionado: solo calcular pensión
    if (esPensionado) {
        var pension   = salario * 0.04;
        var fsp       = (salario >= SALARIO_MINIMO * 4) ? salario * 0.01 : 0;
        var totalDed  = pension + fsp;
        var totalNeto = salario - totalDed;

        mostrarResultados(salario, 0, 0, salario, 0, pension, fsp, 0, 0, totalDed, totalNeto);
        return;
    }

    // Modo normal
    var comisionesRaw = document.getElementById('comisiones').value.trim();
    var horasRaw      = document.getElementById('horasextra').value.trim();
    var riesgoVal     = document.getElementById('riesgo-arl').value;

    var comisiones = comisionesRaw === '' ? 0 : parseFloat(comisionesRaw);
    var horasExtra = horasRaw      === '' ? 0 : parseFloat(horasRaw);

    if (isNaN(comisiones) || comisiones < 0) {
        alert('Las comisiones deben ser un número mayor o igual a 0.');
        return;
    }
    if (isNaN(horasExtra) || horasExtra < 0) {
        alert('Las horas extra deben ser un número mayor o igual a 0.');
        return;
    }
    if (!riesgoVal) {
        alert('Por favor selecciona un nivel de riesgo ARL.');
        return;
    }

    var porcentajeARL = parseFloat(riesgoVal);

    // 1. Total devengado
    var totalDevengado = salario + comisiones + horasExtra;

    // 2. IBC: 70% si salario integral, sino el devengado total
    var ibc;
    if (salario >= SALARIO_INTEGRAL) {
        ibc = totalDevengado * 0.70;
    } else {
        ibc = totalDevengado;
    }

    // 3. Auxilio de transporte (si salario <= 2 SMLV)
    var auxTransporte = (salario <= SALARIO_MINIMO * 2) ? AUXILIO_TRANSP : 0;

    // 4. Salud 4%
    var salud = ibc * 0.04;

    // 5. Pensión 4%
    var pension = ibc * 0.04;

    // 6. Fondo Solidaridad Pensional (si IBC >= 4 SMLV)
    var fsp = (ibc >= SALARIO_MINIMO * 4) ? ibc * 0.01 : 0;

    // 7. ARL
    var arl = ibc * porcentajeARL;

    // 8. Retención en la fuente (Art. 383 ET)
    var baseGravable    = totalDevengado - salud - pension;
    var rentasExentas   = Math.min(baseGravable * 0.25, 65.83 * UVT);
    var baseUVT         = (baseGravable - rentasExentas) / UVT;
    var retencion       = calcularRetencion(baseUVT) * UVT;

    // 9. Totales
    var totalDeducciones = salud + pension + fsp + arl + retencion;
    var totalIngresos    = salario + auxTransporte + comisiones + horasExtra;
    var totalNeto        = totalIngresos - totalDeducciones;

    mostrarResultados(salario, auxTransporte, comisiones, horasExtra, ibc, salud, pension, fsp, arl, retencion, totalDeducciones, totalNeto);
}

// ===== TABLA RETENCIÓN =====
function calcularRetencion(baseUVT) {
    if (baseUVT <= 95)   return 0;
    if (baseUVT <= 150)  return (baseUVT - 95)  * 0.19;
    if (baseUVT <= 360)  return (baseUVT - 150) * 0.28 + 10;
    if (baseUVT <= 640)  return (baseUVT - 360) * 0.33 + 69;
    if (baseUVT <= 945)  return (baseUVT - 640) * 0.35 + 162;
    if (baseUVT <= 2300) return (baseUVT - 945) * 0.37 + 268;
    return (baseUVT - 2300) * 0.39 + 770;
}

// ===== MOSTRAR RESULTADOS =====
function mostrarResultados(salario, auxTransporte, comisiones, horasExtra, ibc, salud, pension, fsp, arl, retencion, totalDeducciones, totalNeto) {
    // Si viene en modo pensionado los parámetros son distintos — usar argumento flexible
    // Se acepta que en modo pensionado se llama con menos args; los faltantes quedan undefined → 0
    document.getElementById('res-nombre').textContent      = document.getElementById('nombre').value.trim();
    document.getElementById('res-salario').textContent     = formatCOP(salario);
    document.getElementById('res-transporte').textContent  = formatCOP(auxTransporte || 0);
    document.getElementById('res-comisiones').textContent  = formatCOP(comisiones || 0);
    document.getElementById('res-horasextra').textContent  = formatCOP(horasExtra || 0);
    document.getElementById('res-ibc').textContent         = formatCOP(ibc || salario);
    document.getElementById('res-salud').textContent       = formatCOP(salud || 0);
    document.getElementById('res-pension').textContent     = formatCOP(pension || 0);
    document.getElementById('res-fsp').textContent         = formatCOP(fsp || 0);
    document.getElementById('res-arl').textContent         = formatCOP(arl || 0);
    document.getElementById('res-retencion').textContent   = formatCOP(retencion || 0);
    document.getElementById('res-total-ded').textContent   = formatCOP(totalDeducciones || 0);
    document.getElementById('res-total').textContent       = formatCOP(Math.max(totalNeto, 0));

    // Mostrar fila FSP solo si aplica
    document.getElementById('fila-fsp').style.display = (fsp > 0) ? 'block' : 'none';

    mostrarSeccion('paso-3');
}

// ===== REINICIAR =====
function reiniciar() {
    document.getElementById('nombre').value    = '';
    document.getElementById('edad').value      = '';
    document.getElementById('tipo-doc').value  = '';
    document.getElementById('num-doc').value   = '';
    document.getElementById('salario').value   = '';
    document.getElementById('comisiones').value= '';
    document.getElementById('horasextra').value= '';
    document.getElementById('riesgo-arl').value= '';
    document.getElementById('alerta-perfil').textContent = '';
    esPensionado = false;
    mostrarSeccion('paso-1');
}

// ===== BLOQUEAR LETRAS EN CAMPOS NUMÉRICOS =====
window.onload = function() {
    var camposNumericos = ['salario', 'comisiones', 'horasextra'];
    camposNumericos.forEach(function(id) {
        var input = document.getElementById(id);
        if (!input) return;
        input.addEventListener('keydown', function(e) {
            var permitidos = ['Backspace','Delete','Tab','Enter','ArrowLeft','ArrowRight','.'];
            if (permitidos.indexOf(e.key) !== -1) return;
            if (e.key < '0' || e.key > '9') e.preventDefault();
        });
    });

    // Número de documento: solo dígitos
    var numDoc = document.getElementById('num-doc');
    numDoc.addEventListener('keydown', function(e) {
        var permitidos = ['Backspace','Delete','Tab','Enter','ArrowLeft','ArrowRight'];
        if (permitidos.indexOf(e.key) !== -1) return;
        if (e.key < '0' || e.key > '9') e.preventDefault();
    });

    // Edad: solo dígitos, máximo 85
    var edadInput = document.getElementById('edad');
    edadInput.addEventListener('input', function() {
        var v = parseInt(edadInput.value);
        if (!isNaN(v) && v > 85) edadInput.value = 85;
        if (!isNaN(v) && v < 0)   edadInput.value = 0;
    });
};