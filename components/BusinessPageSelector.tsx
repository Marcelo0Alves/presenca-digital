import type { BusinessData } from "@/types"
import BusinessPage from "./BusinessPage"
import LayoutModerno from "./LayoutModerno"
import LayoutSimples from "./LayoutSimples"

export default function BusinessPageSelector({ data, preview = false }: { data: BusinessData; preview?: boolean }) {
  if (data.layout === "moderno") return <LayoutModerno data={data} preview={preview} />
  if (data.layout === "simples") return <LayoutSimples data={data} preview={preview} />
  return <BusinessPage data={data} preview={preview} />
}
