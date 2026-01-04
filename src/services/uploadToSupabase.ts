// uploadToSupabase.ts
import { supabase } from "./supabaseClient";

export async function uploadToSupabase(
  file: File,
  folder: "images" | "audios" | "videos" | "notes"
) {
  const ext = file.name.split(".").pop();
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const authResponse = await supabase.auth.signInAnonymously();
  
  console.log(` SuperBaseClient sign raw authResonse:`, authResponse);
  console.log(` `);
  console.log(` SuperBaseClient sign json authResonse:`, JSON.stringify(authResponse));

  const { error } = await supabase.storage
    .from("media")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) throw error;

  console.log(`upload to superbase done, path:`, path);

  return path; // store this in MongoDB
}
