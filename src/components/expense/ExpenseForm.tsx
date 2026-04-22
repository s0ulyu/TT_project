import { useState } from "react"
import { pb } from "@/lib/pocketbase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Props = {
  onCreated: () => void
}

export default function ExpenseForm({ onCreated }: Props) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [type, setType] = useState("expense")
  const [category, setCategory] = useState("food")
  const [note, setNote] = useState("")
  const [date, setDate] = useState("")
  const [receipt, setReceipt] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const resetForm = () => {
    setTitle("")
    setAmount("")
    setType("expense")
    setCategory("food")
    setNote("")
    setDate("")
    setReceipt(null)
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      const formData = new FormData()
      formData.append("title", title)
      formData.append("amount", amount)
      formData.append("type", type)
      formData.append("category", category)
      formData.append("note", note)
      formData.append("date", date)

      if (receipt) {
        formData.append("receipt", receipt)
      }

      await pb.collection("expenses").create(formData)

      resetForm()
      setOpen(false)
      onCreated()
    } catch (error) {
      console.error(error)
      alert("Thêm khoản chi tiêu thất bại")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-8 flex justify-end">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="h-11 rounded-xl bg-slate-900 px-5 text-white shadow-lg shadow-slate-200 hover:bg-slate-800">
            + Thêm khoản chi tiêu
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl rounded-2xl border-0 bg-white p-0 shadow-2xl">
          <DialogHeader className="border-b bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-5 text-white">
            <DialogTitle className="text-xl font-semibold">
              Thêm khoản chi tiêu
            </DialogTitle>
            <DialogDescription className="text-slate-200">
              Nhập thông tin chi tiêu hoặc thu nhập của bạn
            </DialogDescription>
          </DialogHeader>

          <Card className="border-0 shadow-none">
            <CardHeader className="px-6 pb-2 pt-5">
              <CardTitle className="text-lg text-slate-900">
                Thông tin khoản chi
              </CardTitle>
              <CardDescription>
                Điền đầy đủ nội dung để lưu vào hệ thống
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 px-6 pb-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-slate-700">
                  Tiêu đề
                </Label>
                <Input
                  id="title"
                  placeholder="Ví dụ: Tiền ăn sáng"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-11 rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-slate-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium text-slate-700">
                  Số tiền
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Ví dụ: 50000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="h-11 rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-slate-300"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Loại giao dịch
                  </Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="h-11 w-full rounded-xl border-slate-200">
                      <SelectValue placeholder="Chọn loại giao dịch" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="income">Thu</SelectItem>
                      <SelectItem value="expense">Chi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Danh mục
                  </Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-11 w-full rounded-xl border-slate-200">
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="food">Ăn uống</SelectItem>
                      <SelectItem value="travel">Đi lại</SelectItem>
                      <SelectItem value="study">Học tập</SelectItem>
                      <SelectItem value="entertainment">Giải trí</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note" className="text-sm font-medium text-slate-700">
                  Ghi chú
                </Label>
                <Textarea
                  id="note"
                  placeholder="Ví dụ: bánh mì + cà phê"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="min-h-[110px] rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-slate-300"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium text-slate-700">
                    Ngày
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-11 rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-slate-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receipt" className="text-sm font-medium text-slate-700">
                    Ảnh hóa đơn
                  </Label>
                  <Input
                    id="receipt"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setReceipt(e.target.files?.[0] || null)}
                    className="h-11 rounded-xl border-slate-200 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-slate-700"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="rounded-xl bg-slate-900 px-5 hover:bg-slate-800"
                >
                  {loading ? "Đang lưu..." : "Lưu"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  )
}