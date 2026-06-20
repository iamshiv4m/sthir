import { createClient } from '@supabase/supabase-js';

export type VideoUploadState = 'idle' | 'uploading' | 'done' | 'error';

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

const BUCKET = 'intake-videos';

export async function uploadIntakeVideo(
  file: File,
  lift: 'squat' | 'bench' | 'deadlift',
): Promise<string> {
  const client = getSupabaseClient();
  if (!client) {
    throw new Error(
      'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment.',
    );
  }

  const ext = file.name.split('.').pop() ?? 'mp4';
  const filePath = `${crypto.randomUUID()}-${lift}.${ext}`;

  const { error } = await client.storage
    .from(BUCKET)
    .upload(filePath, file, { upsert: false });

  if (error) throw new Error(error.message);

  const { data } = client.storage.from(BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}
