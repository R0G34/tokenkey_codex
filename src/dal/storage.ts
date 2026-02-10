import 'server-only'

import { DocumentType } from '@/types/document-type'
import { createClient } from '@/utils/supabase/server'
import { FileObject } from '@supabase/storage-js'
import { verifySession } from './session'

export const createSignedUrl = async (bucket: string, path: string) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  // URL valid for 1 hour
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 3600)
  if (error) throw new Error('Storage error', { cause: error.message })
  return data.signedUrl
}

export const getPublicUrl = async (bucket: string, path: string) => {
  const supabase = await createClient()
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

export const listByBucket = async (bucket: string) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(session.user.id)
  if (error) throw new Error('Storage error', { cause: error.message })

  return data.reduce(
    (acc, file) => {
      const type = file.name.split('.')[0] as DocumentType
      acc[type] = file
      return acc
    },
    {} as { [key in DocumentType]: FileObject },
  )
}

export const upload = async (bucket: string, fileName: string, file: File) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      // contentType: file.type,
      upsert: true,
    })
  // .update(fileName, fileBuffer, {...
  // .remove([fileName])
  if (error) throw new Error('Storage error', { cause: error.message })
  return data
}

export const remove = async (bucket: string, fileNames: string[]) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase.storage.from(bucket).remove(fileNames)
  if (error) throw new Error('Storage error', { cause: error.message })
  return data
}

export const download = async (bucket: string, fileName: string) => {
  const session = await verifySession()
  const supabase = await createClient(session.supabaseAccessToken)
  const { data, error } = await supabase.storage
    .from(bucket)
    .download(`${session.user.id}/${fileName}`)
  if (error) throw new Error('Storage error', { cause: error.message })
  return data
}
