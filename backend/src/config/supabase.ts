import { createClient } from "@supabase/supabase-js"; //Importamos la función 'createClient' desde la librería oficial de Supabase.
import { SUPABASE_KEY, SUPABASE_URL } from "./index.js"; //Node.js al final va a leer archivos JavaScript compilados

// Creamos la conexión real y la exportamos.
// Le pasamos la URL y la Key a 'createClient' para que nos autorice.
// Al usar 'export const supabase', estamos permitiendo que cualquier otro archivo 
// de tu proyecto pueda usar esta variable 'supabase' para hacer consultas a la base de datos.
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)