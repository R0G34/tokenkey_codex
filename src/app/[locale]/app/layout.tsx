import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { verifySession } from '@/dal/session'
import { selectUserWithPersonalData } from '@/dal/user/queries/select-user-with-personaldata'
import { Metadata } from 'next'
import { Locale } from 'next-intl'
import { PropsWithChildren } from 'react'
import { AppSidebar } from './app-sidebar'
import { Footer } from '../(public)/footer'

type Props = {
  params: Promise<{ locale: Locale }>
}

export const metadata: Metadata = {
  title: 'App',
}

export default async function AppLayout(props: PropsWithChildren<Props>) {
  const { children } = props

  await verifySession()

  const user = await selectUserWithPersonalData()

  return (
    <SidebarProvider>
      <AppSidebar user={user} variant="inset" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            {/* <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb> */}
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
          <Footer />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
