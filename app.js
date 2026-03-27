const STORAGE_KEYS = {
  comics: "mi_coleccion_bd",
  stores: "tiendas_bd"
};

const ciudadesPorPais = {
  asturies: ["Xixón", "Uvieu", "Avilés", "Mieres", "Llangréu"],
  francia: ["París", "Lyon", "Angoulème", "Marsella"],
  belxica: ["Bruselas", "Lieja", "Amberes"],
  espana: ["Madrid", "Barcelona", "Bilbao", "Valencia"],
  suiza: ["Ginebra"]
};

const ESTADO_LABELS = {
  "nuevu": "Nuevu",
  "como-nuevu": "Como nuevu",
  "bon-estau": "Bon estÃ¡u",
  "gastau": "GastÃ¡u",
  "": "Por revisar"
};

const estadoLegacyMap = {
  "bonu": "bon-estau"
};

let coleccion = [];
let tiendas = [];

const $ = (selector) => document.querySelector(selector);

document.addEventListener("DOMContentLoaded", () => {
  inicializarDatos();
  enlazarEventos();
  poblarPaises();
  poblarFiltros();
  renderizarTodo();
  registrarServiceWorker();
});

function inicializarDatos() {
  const bdInicial = typeof bdColeccion !== "undefined" && Array.isArray(bdColeccion) ? bdColeccion : [];
  const guardados = leerStorage(STORAGE_KEYS.comics, bdInicial);
  coleccion = guardados.map(normalizarComic);
  guardarColeccion();
  tiendas = leerStorage(STORAGE_KEYS.stores, []);
}

function enlazarEventos() {
  $("#form-comic").addEventListener("submit", guardarBD);
  $("#form-tienda").addEventListener("submit", guardarTienda);
  $("#buscador-bd").addEventListener("input", renderizarColeccion);
  $("#filtro-serie").addEventListener("change", renderizarColeccion);
  $("#filtro-estado").addEventListener("change", renderizarColeccion);
  $("#filtro-propiedad").addEventListener("change", renderizarColeccion);
  $("#selector-pais").addEventListener("change", () => {
    cargarCiudades();
    sincronizarFiltroCiudades();
  });
  $("#filtro-pais").addEventListener("change", () => {
    sincronizarFiltroCiudades();
    renderizarTiendas();
  });
  $("#filtro-ciudad").addEventListener("change", renderizarTiendas);
}

function normalizarComic(comic) {
  return {
    id: comic.id || Date.now() + Math.floor(Math.random() * 1000),
    serie: (comic.serie || "").trim(),
    titulo: (comic.titulo || comic.titulu || "").trim(),
    autor: (comic.autor || "").trim(),
    editorial: (comic.editorial || "").trim(),
    estado: estadoLegacyMap[comic.estado] || comic.estado || "",
    tieneslu: Boolean(comic.tieneslu)
  };
}

function leerStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.error(`Error leyendo ${key}`, error);
    return fallback;
  }
}

function guardarColeccion() {
  localStorage.setItem(STORAGE_KEYS.comics, JSON.stringify(coleccion));
}

function guardarTiendasStorage() {
  localStorage.setItem(STORAGE_KEYS.stores, JSON.stringify(tiendas));
}

function guardarBD(event) {
  event.preventDefault();

  const nuevoComic = normalizarComic({
    id: Date.now(),
    serie: $("#serie").value,
    titulo: $("#titulu").value,
    autor: $("#autor").value,
    editorial: $("#editorial").value,
    estado: $("#estau").value,
    tieneslu: $("#tieneslu").checked
  });

  if (!nuevoComic.serie || !nuevoComic.titulo || !nuevoComic.autor) {
    alert("Completa serie, tÃ­tulu y autor/a.");
    return;
  }

  coleccion.unshift(nuevoComic);
  guardarColeccion();
  $("#form-comic").reset();
  renderizarTodo();
}

function poblarPaises() {
  const paisSelect = $("#selector-pais");
  const filtroPais = $("#filtro-pais");
  const paises = Object.keys(ciudadesPorPais).sort((a, b) => a.localeCompare(b));

  paises.forEach((pais) => {
    const label = capitalizar(pais);
    paisSelect.appendChild(crearOpcion(pais, label));
    filtroPais.appendChild(crearOpcion(pais, label));
  });
}

function crearOpcion(value, text) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = text;
  return option;
}

function cargarCiudades() {
  const paisSeleccionado = $("#selector-pais").value;
  const selectCiudad = $("#selector-ciudad");
  selectCiudad.innerHTML = "";

  if (!paisSeleccionado || !ciudadesPorPais[paisSeleccionado]) {
    selectCiudad.appendChild(crearOpcion("", "-- Primero escueye paÃ­s --"));
    selectCiudad.disabled = true;
    return;
  }

  selectCiudad.disabled = false;
  selectCiudad.appendChild(crearOpcion("", "-- Escueye una ciudÃ¡ --"));
  ciudadesPorPais[paisSeleccionado].forEach((ciudad) => {
    selectCiudad.appendChild(crearOpcion(ciudad, ciudad));
  });
}

function guardarTienda(event) {
  event.preventDefault();

  const nuevaTienda = {
    id: Date.now(),
    nombre: $("#nombre-tienda").value.trim(),
    direccion: $("#direccion-tienda").value.trim(),
    pais: $("#selector-pais").value,
    ciudad: $("#selector-ciudad").value,
    fechaRegistro: new Date().toLocaleDateString("es-ES")
  };

  if (!nuevaTienda.nombre || !nuevaTienda.direccion || !nuevaTienda.pais || !nuevaTienda.ciudad) {
    alert("Por favor, completa toos los campos de la tienda.");
    return;
  }

  tiendas.unshift(nuevaTienda);
  guardarTiendasStorage();
  $("#form-tienda").reset();
  cargarCiudades();
  sincronizarFiltroCiudades();
  renderizarTodo();
}

function poblarFiltros() {
  const filtroSerie = $("#filtro-serie");
  const series = [...new Set(coleccion.map((comic) => comic.serie).filter(Boolean))].sort((a, b) => a.localeCompare(b));

  filtroSerie.innerHTML = '<option value="todas">Toles series</option>';
  series.forEach((serie) => filtroSerie.appendChild(crearOpcion(serie, serie)));
  sincronizarFiltroCiudades();
}

function sincronizarFiltroCiudades() {
  const filtroPais = $("#filtro-pais").value;
  const filtroCiudad = $("#filtro-ciudad");
  const ciudades = filtroPais !== "todos" && ciudadesPorPais[filtroPais]
    ? ciudadesPorPais[filtroPais]
    : [...new Set(tiendas.map((tienda) => tienda.ciudad).filter(Boolean))].sort((a, b) => a.localeCompare(b));

  filtroCiudad.innerHTML = '<option value="todas">Toles ciudaes</option>';
  ciudades.forEach((ciudad) => filtroCiudad.appendChild(crearOpcion(ciudad, ciudad)));
}

function renderizarTodo() {
  poblarFiltros();
  renderizarColeccion();
  renderizarTiendas();
  actualizarResumen();
}

function renderizarColeccion() {
  const cuerpo = $("#tabla-bd");
  const termino = $("#buscador-bd").value.trim().toLowerCase();
  const serieFiltro = $("#filtro-serie").value;
  const estadoFiltro = $("#filtro-estado").value;
  const propiedadFiltro = $("#filtro-propiedad").value;

  const visibles = coleccion.filter((comic) => {
    const coincideTexto = !termino || [comic.serie, comic.titulo, comic.autor, comic.editorial]
      .join(" ")
      .toLowerCase()
      .includes(termino);
    const coincideSerie = serieFiltro === "todas" || comic.serie === serieFiltro;
    const coincideEstado = estadoFiltro === "todos" || comic.estado === estadoFiltro;
    const coincidePropiedad =
      propiedadFiltro === "todos" ||
      (propiedadFiltro === "si" && comic.tieneslu) ||
      (propiedadFiltro === "no" && !comic.tieneslu);

    return coincideTexto && coincideSerie && coincideEstado && coincidePropiedad;
  });

  cuerpo.innerHTML = "";

  if (!visibles.length) {
    cuerpo.innerHTML = `
      <tr>
        <td colspan="7">
          <p class="empty-state">Nun hai BD que coincidan colos filtros actuales.</p>
        </td>
      </tr>
    `;
    return;
  }

  visibles.forEach((comic) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${escapeHtml(comic.serie)}</td>
      <td>${escapeHtml(comic.titulo)}</td>
      <td>${escapeHtml(comic.autor)}</td>
      <td>${escapeHtml(comic.editorial || "Ensin editorial")}</td>
      <td><span class="state-pill">${ESTADO_LABELS[comic.estado] || "Por revisar"}</span></td>
      <td><span class="own-pill" data-owned="${comic.tieneslu}">${comic.tieneslu ? "SÃ­" : "Non"}</span></td>
      <td>
        <div class="row-actions">
          <button type="button" class="ghost-btn" data-action="toggle" data-id="${comic.id}">
            ${comic.tieneslu ? "Marcar como pendiente" : "Marcar como mia"}
          </button>
          <button type="button" class="danger-btn" data-action="delete-comic" data-id="${comic.id}">
            Borrar
          </button>
        </div>
      </td>
    `;
    cuerpo.appendChild(fila);
  });

  cuerpo.querySelectorAll("[data-action='toggle']").forEach((button) => {
    button.addEventListener("click", () => toggleTieneslu(Number(button.dataset.id)));
  });

  cuerpo.querySelectorAll("[data-action='delete-comic']").forEach((button) => {
    button.addEventListener("click", () => borrarComic(Number(button.dataset.id)));
  });
}

function toggleTieneslu(id) {
  coleccion = coleccion.map((comic) =>
    comic.id === id ? { ...comic, tieneslu: !comic.tieneslu } : comic
  );
  guardarColeccion();
  renderizarTodo();
}

function borrarComic(id) {
  if (!window.confirm("Â¿Tas seguru de que quies borrar esti tomu de la coleiciÃ³n?")) {
    return;
  }

  coleccion = coleccion.filter((comic) => comic.id !== id);
  guardarColeccion();
  renderizarTodo();
}

function renderizarTiendas() {
  const contenedor = $("#lista-tiendas-guardadas");
  const filtroPais = $("#filtro-pais").value;
  const filtroCiudad = $("#filtro-ciudad").value;

  const visibles = tiendas.filter((tienda) => {
    const coincidePais = filtroPais === "todos" || tienda.pais === filtroPais;
    const coincideCiudad = filtroCiudad === "todas" || tienda.ciudad === filtroCiudad;
    return coincidePais && coincideCiudad;
  });

  contenedor.innerHTML = "";

  if (!visibles.length) {
    contenedor.innerHTML = '<li><p class="empty-state">Nun hai tiendes rexistraes con esi filtru.</p></li>';
    return;
  }

  visibles.forEach((tienda) => {
    const item = document.createElement("li");
    item.className = "store-card";
    item.innerHTML = `
      <div>
        <h3>${escapeHtml(tienda.nombre)}</h3>
        <p class="store-meta">
          ${escapeHtml(tienda.direccion)}<br>
          ${escapeHtml(tienda.ciudad)}, ${escapeHtml(capitalizar(tienda.pais))}<br>
          Rexistrada: ${escapeHtml(tienda.fechaRegistro || "")}
        </p>
      </div>
      <div class="row-actions">
        <button type="button" class="danger-btn" data-store-id="${tienda.id}">Borrar tienda</button>
      </div>
    `;
    contenedor.appendChild(item);
  });

  contenedor.querySelectorAll("[data-store-id]").forEach((button) => {
    button.addEventListener("click", () => borrarTienda(Number(button.dataset.storeId)));
  });
}

function borrarTienda(id) {
  if (!window.confirm("Â¿Tas seguru de que quies borrar esta tienda?")) {
    return;
  }

  tiendas = tiendas.filter((tienda) => tienda.id !== id);
  guardarTiendasStorage();
  sincronizarFiltroCiudades();
  renderizarTodo();
}

function actualizarResumen() {
  $("#stat-total").textContent = String(coleccion.length);
  $("#stat-propios").textContent = String(coleccion.filter((comic) => comic.tieneslu).length);
  $("#stat-tiendas").textContent = String(tiendas.length);
}

function capitalizar(texto) {
  return texto
    .split(" ")
    .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
    .join(" ");
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function registrarServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.error("Nun se pudo rexistrar el service worker", error);
    });
  }
}