import 'server-only'

import { createAdminClient } from '@/utils/supabase/admin'

export const download = async (bucket: string, fileName: string) => {
  const supabase = createAdminClient()
  const { data, error } = await supabase.storage.from(bucket).download(fileName)
  if (error) throw new Error('Storage error', { cause: error.message })
  return data
}

export const upload = async (
  bucket: string,
  path: string,
  data: Uint8Array | File,
  options?: { contentType?: string; upsert?: boolean },
) => {
  const supabase = createAdminClient()
  const { data: uploadData, error } = await supabase.storage
    .from(bucket)
    .upload(path, data, options)
  if (error) throw new Error('Storage error', { cause: error.message })
  return uploadData
}
