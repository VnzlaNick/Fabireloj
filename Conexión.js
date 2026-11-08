// connection.js
(() => {
  const SUPABASE_URL = "https://tpidmniocervffdiibyp.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_U_4sNRRN26XoUxp71yGvIQ_TVwo6Vle";

  if (!window.supabase) {
    throw new Error(
      "No se cargó supabase-js. Incluye su script antes de connection.js."
    );
  }

  // Evita crear otro cliente si este archivo se carga más de una vez.
  if (!window.supabaseClient) {
    window.supabaseClient = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY
    );
  }
})();

const WATCHES_COLUMNS =
  "id,title,reference,price,stock,specs,offer_type,discount,image_url,brand,category,created_at";

async function obtenerRelojes() {
  const { data, error } = await window.supabaseClient
    .from("watches")
    .select(WATCHES_COLUMNS)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al obtener relojes:", error.message);
    return [];
  }

  return data ?? [];
}

async function agregarReloj(reloj = {}) {
  const title = String(reloj.nombre ?? "").trim();
  const reference = String(reloj.referencia ?? "").trim();
  const rawPrice = reloj.precio;
  const price = Number(rawPrice);
  const stock = String(reloj.disponibilidad ?? "").trim();
  const category = String(reloj.categoria ?? "caballeros").trim();
  const specs = String(reloj.detalles ?? "").trim();
  const isOffer = reloj.oferta === true || reloj.oferta === "si";

  if (!title || !reference) {
    console.error("El título y la referencia son obligatorios.");
    return null;
  }

  if (rawPrice === "" || rawPrice == null || !Number.isFinite(price) || price < 0) {
    console.error("El precio debe ser un número válido mayor o igual a cero.");
    return null;
  }

  if (!["Disponible", "Agotado"].includes(stock)) {
    console.error('La disponibilidad debe ser "Disponible" o "Agotado".');
    return null;
  }

  if (!["caballeros", "damas"].includes(category)) {
    console.error('La categoría debe ser "caballeros" o "damas".');
    return null;
  }

  let imageUrl = null;
  const rawImageUrl = String(reloj.image_url ?? "").trim();

  if (rawImageUrl) {
    try {
      const url = new URL(rawImageUrl);
      if (url.protocol !== "https:") throw new Error();
      imageUrl = url.href;
    } catch {
      console.error("La imagen debe tener una URL HTTPS válida.");
      return null;
    }
  }

  const payload = {
    title,
    reference,
    price,
    stock,
    specs,
    offer_type: isOffer ? "oferta" : "normal",
    discount: isOffer ? String(reloj.descuento ?? "15%") : null,
    image_url: imageUrl,
    brand: String(reloj.marca ?? "Alta Relojería").trim(),
    category,
  };

  const { data, error } = await window.supabaseClient
    .from("watches")
    .insert(payload)
    .select(WATCHES_COLUMNS)
    .single();

  if (error) {
    console.error("Error al agregar reloj:", error.message);
    return null;
  }

  return data;
}

async function eliminarReloj(id) {
  const watchId = String(id ?? "").trim();

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(watchId)) {
    console.error("El ID del reloj no es un UUID válido.");
    return false;
  }

  const { data, error } = await window.supabaseClient
    .from("watches")
    .delete()
    .eq("id", watchId)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Error al eliminar reloj:", error.message);
    return false;
  }

  return Boolean(data);
}
