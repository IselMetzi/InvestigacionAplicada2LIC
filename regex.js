function escaparHtml(cadena) {  //para evitar bugs si se pone texto que parece html
  return cadena
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function resaltarCoincidencia(texto, expresion) {
  const coincidencia = expresion.exec(texto);

  if (!coincidencia || coincidencia[0] === "") {
    return escaparHtml(texto);
  }

  const inicio = coincidencia.index;
  const fin = inicio + coincidencia[0].length;

  return (
    escaparHtml(texto.slice(0, inicio)) +
    "<mark>" +
    escaparHtml(texto.slice(inicio, fin)) +
    "</mark>" +
    escaparHtml(texto.slice(fin))
  );
}

function configurarTarjeta(tarjeta) {
  const patron = tarjeta.getAttribute("data-pattern");
  const banderas = tarjeta.getAttribute("data-flags") || "";
  const entrada = tarjeta.querySelector("input");
  const resultado = tarjeta.querySelector(".alert");

  if (!patron || !entrada || !resultado) return;

  entrada.addEventListener("input", () => {
    const valor = entrada.value;

    if (valor === "") {
      resultado.textContent = "Esperando texto...";
      resultado.className = "mt-3 alert alert-secondary";
      return;
    }

    const esValido = new RegExp(patron, banderas).test(valor);

    const textoResaltado = resaltarCoincidencia(
      valor,
      new RegExp(patron, banderas)
    );

    resultado.innerHTML =
      (esValido ? "Válido - " : "Inválido - ") + textoResaltado;

    resultado.className =
      "mt-3 alert " + (esValido ? "alert-success" : "alert-danger");
  });
}


document.addEventListener("DOMContentLoaded", () => {

  document
    .querySelectorAll(".card[data-pattern]")
    .forEach(configurarTarjeta);


  const btnLimpiar = document.getElementById("btnLimpiar");

  btnLimpiar.addEventListener("click", () => {

    const tarjetas = document.querySelectorAll(".card[data-pattern]");

    tarjetas.forEach(tarjeta => {

      const entrada = tarjeta.querySelector("input");
      const resultado = tarjeta.querySelector(".alert");

      entrada.value = "";

      resultado.textContent = "Esperando texto...";
      resultado.className = "mt-3 alert alert-secondary";

    });

  });

});

