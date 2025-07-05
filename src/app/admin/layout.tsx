
import type React from "react"
import SidebarLayout from "./component/sidebar/sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SidebarLayout>{children}</SidebarLayout>
}
