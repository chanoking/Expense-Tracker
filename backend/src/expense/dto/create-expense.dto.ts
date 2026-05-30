export class CreateExpenseDto {
  categoryId: number;
  date: string;
  price: number;
  content?: string;
}
