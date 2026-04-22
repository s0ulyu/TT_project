import { useEffect, useMemo, useState } from "react"
import { pb } from "@/lib/pocketbase"
import type { Expense } from "@/types/expense"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Props = {
  reloadKey: number
  onCreated: () => void
}

const typeMap: Record<string, string> = {
  income: "Thu",
  expense: "Chi",
}

const categoryMap: Record<string, string> = {
  food: "Ăn uống",
  travel: "Đi lại",
  study: "Học tập",
  entertainment: "Giải trí",
  other: "Khác",
}

function formatDate(dateStr: string) {
  if (!dateStr) return ""
  const date = new Date(dateStr)
  return date.toLocaleDateString("vi-VN")
}

function formatMoney(value: number | string) {
  return Number(value).toLocaleString("vi-VN") + " đ"
}

export default function ExpenseList({ reloadKey }: Props) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        setLoading(true)
        const result = await pb.collection("expenses").getFullList<Expense>({
          sort: "-date,-created",
        })
        setExpenses(result)
      } catch (error: any) {
        if (error?.isAbort) return
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadExpenses()
  }, [reloadKey])

  const stats = useMemo(() => {
    const totalIncome = expenses
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + Number(item.amount), 0)

    const totalExpense = expenses
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + Number(item.amount), 0)

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    }
  }, [expenses])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Quản lý chi tiêu cá nhân
          </h1>
          <p className="mt-2 text-slate-500">
            Theo dõi các khoản thu chi của bạn mỗi ngày
          </p>
        </div>

        <Card className="rounded-2xl border-0 bg-white shadow-md">
          <CardContent className="py-10 text-center text-slate-500">
            Đang tải dữ liệu...
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 p-8 text-white shadow-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-slate-300">
              Finance Dashboard
            </p>
            <h1 className="text-4xl font-bold tracking-tight">
              Quản lý chi tiêu cá nhân
            </h1>
            <p className="mt-3 max-w-2xl text-slate-200">
              Theo dõi thu nhập, chi tiêu và hóa đơn của bạn trong một giao diện
              rõ ràng, hiện đại và dễ dùng.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-slate-300">Tổng thu</p>
              <p className="mt-2 text-2xl font-bold text-emerald-300">
                {formatMoney(stats.totalIncome)}
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-slate-300">Tổng chi</p>
              <p className="mt-2 text-2xl font-bold text-rose-300">
                {formatMoney(stats.totalExpense)}
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-slate-300">Số dư</p>
              <p className="mt-2 text-2xl font-bold text-blue-200">
                {formatMoney(stats.balance)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {expenses.length === 0 ? (
        <Card className="rounded-2xl border-0 bg-white shadow-md">
          <CardContent className="py-14 text-center">
            <p className="text-lg font-medium text-slate-700">
              Chưa có khoản chi tiêu nào
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Hãy thêm giao dịch đầu tiên để bắt đầu theo dõi tài chính của bạn.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {expenses.map((item) => {
            const imageUrl =
              item.receipt && String(item.receipt).trim() !== ""
                ? pb.files.getURL(item, item.receipt)
                : ""

            return (
              <Card
                key={item.id}
                className="overflow-hidden rounded-2xl border-0 bg-white shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
              >
                {imageUrl && (
                  <div className="h-52 w-full bg-slate-100">
                    <img
                      src={imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                      }}
                    />
                  </div>
                )}

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle className="truncate text-xl font-semibold text-slate-900">
                        {item.title}
                      </CardTitle>
                      <p className="mt-1 text-sm text-slate-500">
                        {formatDate(item.date)}
                      </p>
                    </div>

                    <Badge
                      className={
                        item.type === "income"
                          ? "rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                          : "rounded-full bg-rose-100 text-rose-700 hover:bg-rose-100"
                      }
                    >
                      {typeMap[item.type] || item.type}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="text-2xl font-bold tracking-tight text-slate-900">
                    {formatMoney(item.amount)}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="rounded-full border-blue-200 bg-blue-50 text-blue-700"
                    >
                      {categoryMap[item.category] || item.category}
                    </Badge>
                  </div>

                  {item.note && (
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                      {item.note}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}