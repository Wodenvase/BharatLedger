import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create a test user (or find existing)
  const hashedPassword = await bcrypt.hash('test123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'demo@bharatledger.com' },
    update: {},
    create: {
      email: 'demo@bharatledger.com',
      password: hashedPassword,
      name: 'Demo User',
    },
  });

  console.log(`Created/found user: ${user.email}`);

  // Create accounts
  const accounts = await Promise.all([
    prisma.account.create({
      data: {
        userId: user.id,
        sourceName: 'State Bank of India',
        connected: true,
      },
    }),
    prisma.account.create({
      data: {
        userId: user.id,
        sourceName: 'HDFC Credit Card',
        connected: true,
      },
    }),
    prisma.account.create({
      data: {
        userId: user.id,
        sourceName: 'Paytm Wallet',
        connected: false,
      },
    }),
  ]);

  console.log(`Created ${accounts.length} accounts`);

  // Create sample transactions
  const now = new Date();
  const transactionsData = [
    // Income transactions
    {
      userId: user.id,
      date: new Date(now.getFullYear(), now.getMonth(), 1),
      description: 'Monthly Salary',
      amount: 85000,
      type: 'income',
      category: 'Salary',
    },
    {
      userId: user.id,
      date: new Date(now.getFullYear(), now.getMonth(), 15),
      description: 'Freelance Project Payment',
      amount: 25000,
      type: 'income',
      category: 'Freelance',
    },
    {
      userId: user.id,
      date: new Date(now.getFullYear(), now.getMonth() - 1, 1),
      description: 'Monthly Salary',
      amount: 85000,
      type: 'income',
      category: 'Salary',
    },
    
    // Expense transactions - Housing
    {
      userId: user.id,
      date: new Date(now.getFullYear(), now.getMonth(), 5),
      description: 'Rent Payment',
      amount: 30000,
      type: 'expense',
      category: 'Housing',
    },
    {
      userId: user.id,
      date: new Date(now.getFullYear(), now.getMonth(), 10),
      description: 'Electricity Bill',
      amount: 2500,
      type: 'expense',
      category: 'Utilities',
    },
    
    // Expense transactions - Food
    {
      userId: user.id,
      date: new Date(now.getFullYear(), now.getMonth(), 3),
      description: 'Grocery Shopping - BigBazaar',
      amount: 4500,
      type: 'expense',
      category: 'Groceries',
    },
    {
      userId: user.id,
      date: new Date(now.getFullYear(), now.getMonth(), 7),
      description: 'Restaurant - Barbeque Nation',
      amount: 2800,
      type: 'expense',
      category: 'Dining',
    },
    {
      userId: user.id,
      date: new Date(now.getFullYear(), now.getMonth(), 12),
      description: 'Zomato Order',
      amount: 650,
      type: 'expense',
      category: 'Dining',
    },
    
    // Expense transactions - Transportation
    {
      userId: user.id,
      date: new Date(now.getFullYear(), now.getMonth(), 8),
      description: 'Uber Rides',
      amount: 1200,
      type: 'expense',
      category: 'Transportation',
    },
    {
      userId: user.id,
      date: new Date(now.getFullYear(), now.getMonth(), 14),
      description: 'Petrol - Indian Oil',
      amount: 3500,
      type: 'expense',
      category: 'Transportation',
    },
    
    // Expense transactions - Healthcare
    {
      userId: user.id,
      date: new Date(now.getFullYear(), now.getMonth(), 6),
      description: 'Medical Checkup',
      amount: 2500,
      type: 'expense',
      category: 'Healthcare',
    },
    {
      userId: user.id,
      date: new Date(now.getFullYear(), now.getMonth(), 9),
      description: 'Pharmacy - Apollo',
      amount: 850,
      type: 'expense',
      category: 'Healthcare',
    },
    
    // Expense transactions - Entertainment
    {
      userId: user.id,
      date: new Date(now.getFullYear(), now.getMonth(), 11),
      description: 'Movie Tickets - PVR',
      amount: 1200,
      type: 'expense',
      category: 'Entertainment',
    },
    {
      userId: user.id,
      date: new Date(now.getFullYear(), now.getMonth(), 13),
      description: 'Netflix Subscription',
      amount: 799,
      type: 'expense',
      category: 'Entertainment',
    },
    
    // Expense transactions - Shopping
    {
      userId: user.id,
      date: new Date(now.getFullYear(), now.getMonth(), 4),
      description: 'Amazon Purchase',
      amount: 5400,
      type: 'expense',
      category: 'Shopping',
    },
    {
      userId: user.id,
      date: new Date(now.getFullYear(), now.getMonth(), 16),
      description: 'Flipkart Order',
      amount: 3200,
      type: 'expense',
      category: 'Shopping',
    },
    
    // Last month transactions
    {
      userId: user.id,
      date: new Date(now.getFullYear(), now.getMonth() - 1, 5),
      description: 'Rent Payment',
      amount: 30000,
      type: 'expense',
      category: 'Housing',
    },
    {
      userId: user.id,
      date: new Date(now.getFullYear(), now.getMonth() - 1, 10),
      description: 'Grocery Shopping',
      amount: 5200,
      type: 'expense',
      category: 'Groceries',
    },
    {
      userId: user.id,
      date: new Date(now.getFullYear(), now.getMonth() - 1, 15),
      description: 'Credit Card Payment',
      amount: 15000,
      type: 'expense',
      category: 'Bills',
    },
  ];

  const transactions = await prisma.transaction.createMany({
    data: transactionsData,
  });

  console.log(`Created ${transactions.count} transactions`);
  console.log('\n✅ Database seeding completed successfully!');
  console.log('\nDemo User Credentials:');
  console.log('Email: demo@bharatledger.com');
  console.log('Password: test123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
