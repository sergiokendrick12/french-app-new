import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://liybstpmxufpompaieeh.supabase.co";

const supabaseAnonKey =
  "sb_publishable_Cz-plWTrQu2RSh_k3K2QZg_xux9ugsU";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);