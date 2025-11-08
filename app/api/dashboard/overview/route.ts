import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('[Overview API] Request received');
    const session = await getServerSession(authOptions);
    console.log('[Overview API] Session:', session?.user?.email);

    if (!session?.user?.email) {
      console.log('[Overview API] No session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    console.log('[Overview API] Fetching user from database');
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      console.log('[Overview API] User not found in database');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    console.log('[Overview API] User found:', user.id);

    // Check if user has any transactions
    const totalTransactions = await prisma.transaction.count({
      where: { userId: user.id },
    });

    const hasTransactions = totalTransactions > 0;

    // If no transactions, return minimal data for onboarding
    if (!hasTransactions) {
      return NextResponse.json({
        creditScore: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        savingsRate: 0,
        connectedAccounts: 0,
        recentTransactions: [],
        hasTransactions: false,
      });
    }

    // Get current month transactions
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Calculate monthly income and expenses
    const monthlyIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Get connected accounts count
    const connectedAccounts = await prisma.account.count({
      where: {
        userId: user.id,
        connected: true,
      },
    });

    // Calculate credit score (simplified algorithm)
    const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;
    let creditScore = 650; // Base score

    // Increase score for good savings rate
    if (savingsRate > 30) {
      creditScore += 100;
    } else if (savingsRate > 20) {
      creditScore += 70;
    } else if (savingsRate > 10) {
      creditScore += 40;
    }

    // Increase score for consistent income
    if (monthlyIncome > 50000) {
      creditScore += 50;
    } else if (monthlyIncome > 30000) {
      creditScore += 30;
    }

    // Decrease score for high expense ratio
    const expenseRatio = monthlyIncome > 0 ? (monthlyExpenses / monthlyIncome) * 100 : 0;
    if (expenseRatio > 80) {
      creditScore -= 50;
    } else if (expenseRatio > 70) {
      creditScore -= 30;
    }

    // Bonus for connected accounts
    creditScore += connectedAccounts * 10;

    // Cap score between 300-850
    creditScore = Math.max(300, Math.min(850, creditScore));

    // Get recent transactions (last 10)
    const recentTransactions = transactions.slice(0, 10);

    return NextResponse.json({
      creditScore,
      monthlyIncome,
      monthlyExpenses,
      savingsRate,
      connectedAccounts,
      recentTransactions,
      hasTransactions: true,
    });
  } catch (error) {
    console.error('[Overview API] Error:', error);
    console.error('[Overview API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
