// uploadToSupabase.ts
import { supabase } from "./supabaseClient";

export async function uploadToSupabase(
  file: File,
  folder: "images" | "audios" | "videos" | "notes"
) {
  const ext = file.name.split(".").pop();
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  await supabase.auth.signInAnonymously();

  const { error } = await supabase.storage
    .from("media")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) throw error;

  return path; // store this in MongoDB
}
