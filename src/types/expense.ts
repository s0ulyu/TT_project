export type ExpenseType = "income" | "expense"

export type ExpenseCategory =
  | "food"
  | "travel"
  | "study"
  | "entertainment"
  | "other"

export type Expense = {
  id: string
  title: string
  amount: number
  type: ExpenseType
  category: ExpenseCategory
  note?: string
  receipt?: string
  date: string
  created: string
  updated: string
}