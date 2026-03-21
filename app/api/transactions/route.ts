import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'income' | 'expense' | null (all)
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const where: any = {
      userId: user.id,
    };

    if (type) {
      where.type = type;
    }

    if (category) {
      where.category = category;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    // Fetch transactions
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: {
          date: 'desc',
        },
        take: limit,
        skip: offset,
        select: {
          id: true,
          date: true,
          description: true,
          amount: true,
          type: true,
          category: true,
          createdAt: true,
        },
      }),
      prisma.transaction.count({ where }),
    ]);

    // Calculate summary stats
    const stats = await prisma.transaction.aggregate({
      where,
      _sum: {
        amount: true,
      },
    });

    return NextResponse.json({
      transactions,
      total,
      limit,
      offset,
      totalAmount: stats._sum.amount || 0,
      hasMore: offset + transactions.length < total,
    });
  } catch (error) {
    console.error('Transactions API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
