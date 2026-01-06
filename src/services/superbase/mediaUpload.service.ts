import { supabase } from './supabaseClient';

type MediaBucket = 'videos' | 'images' | 'audios';

export async function uploadMedia(
  file: File,
  bucket: MediaBucket
): Promise<string> {
  const filename = `${Date.now()}-${file.name}`;

  const { error } = await supabase
    .storage
    .from(bucket)
    .upload(filename, file);

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase
    .storage
    .from(bucket)
    .getPublicUrl(filename);

  return data.publicUrl;
}
