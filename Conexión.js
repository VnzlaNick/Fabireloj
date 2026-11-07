// connection.js
(() => {
  const SUPABASE_URL = "https://tpidmniocervffdiibyp.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_U_4sNRRN26XoUxp71yGvIQ_TVwo6Vle";

  if (!window.supabase) {
    throw new Error(
      "No se cargó supabase-js. Incluye su script antes de connection.js."
    );
  }

  // Disponible para los demás archivos JavaScript de la página.
  window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );
})();

async function obtenerRelojes() {
  const { data, error } = await window.supabaseClient
    .from("watches")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al obtener relojes:", error.message);
    return [];
  }

  return data;
}

async function agregarReloj(reloj) {
  const { data, error } = await window.supabaseClient
    .from("watches")
    .insert({
      title: reloj.nombre,
      reference: reloj.referencia,
      price: Number(reloj.precio),
      specs: reloj.detalles,
      stock: reloj.disponibilidad,
      offer_type: reloj.oferta ? "oferta" : "normal",
    })
    .select()
    .single();

  if (error) {
    console.error("Error al agregar reloj:", error.message);
    return null;
  }

  return data;
}

async function eliminarReloj(id) {
  const { error } = await window.supabaseClient
    .from("watches")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error al eliminar reloj:", error.message);
    return false;
  }

  return true;
}
