/**
 * Buen Tiempo - Conexión con Supabase
 * Guarda este archivo como 'supabase-db.js' en tu proyecto.
 * Recuerda incluir el script de Supabase en tu HTML antes de este archivo:
 * <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
 */

// 1. Configuración de las credenciales de Supabase
// Reemplaza estos valores con los de tu proyecto en Supabase (Project Settings > API)
const SUPABASE_URL = "https://tpidmniocervffdiibyp.supabase.co/rest/v1/";
const SUPABASE_ANON_KEY = "sb_secret_zdxMnR2m88RwqJ3ebYeHFw_lC65PMKZ";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * 2. Estructura recomendada para tu tabla 'relojes' en Supabase:
 * - id: int8 (Primary Key, Autoincrement)
 * - created_at: timestamptz (Default: now())
 * - nombre: text
 * - referencia: text
 * - precio: numeric
 * - detalles: text
 * - disponibilidad: text ('Disponible' o 'Agotado')
 * - oferta: boolean (Default: false)
 */

// OBTENER TODOS LOS RELOJES (Read)
async function obtenerRelojes() {
    try {
        const { data, error } = await supabase
            .from('relojes')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error al obtener los relojes:", error.message);
        return [];
    }
}

// INSERTAR UN NUEVO RELOJ (Create)
async function agregarReloj(reloj) {
    try {
        const { data, error } = await supabase
            .from('relojes')
            .insert([
                {
                    nombre: reloj.nombre,
                    referencia: reloj.referencia,
                    precio: parseFloat(reloj.precio),
                    detalles: reloj.detalles,
                    disponibilidad: reloj.disponibilidad,
                    oferta: reloj.oferta || false
                }
            ])
            .select();

        if (error) throw error;
        console.log("Reloj agregado con éxito:", data);
        return data;
    } catch (error) {
        console.error("Error al agregar el reloj:", error.message);
        return null;
    }
}

// ELIMINAR UN RELOJ (Delete)
async function eliminarReloj(id) {
    try {
        const { error } = await supabase
            .from('relojes')
            .delete()
                .eq('id', id);

        if (error) throw error;
        console.log(`Reloj con ID ${id} eliminado.`);
        return true;
    } catch (error) {
        console.error("Error al eliminar el reloj:", error.message);
        return false;
    }
}

// Ejemplo de cómo integrar esto con tu interfaz existente:
// document.addEventListener("DOMContentLoaded", async () => {
//     const relojes = await obtenerRelojes();
//     // Aquí renderizas los relojes en tu catálogo HTML
// });
