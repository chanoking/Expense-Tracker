import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class ExpenseService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.expense.findMany({
      include: { category: true },
      orderBy: { date: 'desc' },
    });
  }

  create(dto: CreateExpenseDto) {
    return this.prisma.expense.create({
      data: {
        categoryId: Number(dto.categoryId),
        date: new Date(dto.date),
        price: Number(dto.price),
        content: dto.content,
      },
      include: { category: true },
    });
  }
}
