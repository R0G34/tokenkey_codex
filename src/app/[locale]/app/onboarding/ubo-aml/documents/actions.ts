'use server'

import { verifySession } from '@/dal/session'
import { remove, upload } from '@/dal/storage'
import { getErrorMessage } from '@/utils/error/get-error-message'
import { revalidatePath } from 'next/cache'

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get('file') as File
    const type = formData.get('type') as string

    if (!file || !type) throw new Error('File or type is missing')

    const session = await verifySession()

    const fileExt = file.name.split('.').pop()
    // const fileName = `${user.id}/${type}-${Date.now()}.${fileExt}`
    // const fileName = `${user.id}/${type}-${new Date().toISOString()}.${fileExt}`
    const fileName = `${session.user.id}/${type}.${fileExt}`

    await upload('company-documents', fileName, file)

    // Get public URL
    // const publicUrl = await getPublicUrl('company-documents', fileName)
    // console.log('🔥 uploadFile publicUrl', publicUrl)

    // Save to database
    // const { error: dbError } = await supabase.from('company_document').upsert({
    //   type,
    //   url: publicUrl,
    //   title: file.name,
    //   created_at: new Date().toISOString(),
    // })

    // if (dbError) throw dbError

    revalidatePath('/app/onboarding', 'layout')

    // return { success: true, url: publicUrl, name: file.name }
    return { success: true, name: file.name }
    // return { success: true }
  } catch (error) {
    const message = getErrorMessage(error)
    console.error('❌ Upload error:', message)
    return { success: false, error: 'Failed to upload file' }
  }
}

export async function deleteFile(type: string) {
  try {
    const session = await verifySession()

    const fileExt = 'pdf'
    const fileName = `${session.user.id}/${type}.${fileExt}`

    await remove('company-documents', [fileName])

    revalidatePath('/app/onboarding', 'layout')

    return { success: true }
  } catch (error) {
    const message = getErrorMessage(error)
    console.error('Delete error:', message)
    return { success: false, error: 'Failed to delete file' }
  }
}
