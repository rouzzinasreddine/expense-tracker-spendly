import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Create a mock user
  const hashedPassword = await bcrypt.hash('demo1234', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@spendly.com' },
    update: {},
    create: {
      email: 'demo@spendly.com',
      name: 'Demo User',
      password: hashedPassword,
    },
  });
  console.log(`User created/updated with id: ${user.id}`);

  // 2. Clear existing data to prevent duplicates on rerun
  await prisma.transaction.deleteMany({ where: { userId: user.id } });
  await prisma.category.deleteMany({ where: { userId: user.id } });

  // 3. Create Categories
  const categoriesData = [
    { name: 'Food & Dining', emoji: 'fi-rr-utensils', type: 'EXPENSE', budget: 500, userId: user.id },
    { name: 'Transport', emoji: 'fi-rr-car', type: 'EXPENSE', budget: 200, userId: user.id },
    { name: 'Shopping', emoji: 'fi-rr-shopping-bag', type: 'EXPENSE', budget: 300, userId: user.id },
    { name: 'Health', emoji: 'fi-rr-heart', type: 'EXPENSE', budget: 150, userId: user.id },
    { name: 'Travel', emoji: 'fi-rr-plane', type: 'EXPENSE', budget: 1000, userId: user.id },
    { name: 'Home', emoji: 'fi-rr-home', type: 'EXPENSE', budget: 1200, userId: user.id },
    { name: 'Salary', emoji: 'fi-rr-money', type: 'INCOME', budget: null, userId: user.id },
  ];

  const categories = await Promise.all(
    categoriesData.map(async (data) => {
      return prisma.category.create({
        data,
      });
    })
  );
  
  console.log(`Created ${categories.length} categories.`);

  // Helpers to find categories
  const getCat = (name: string) => categories.find((c: any) => c.name === name)!;

  // 4. Create 15 realistic transactions spread across the last 30 days
  const today = new Date();
  
  const randomDate = (daysAgo: number) => {
    const d = new Date();
    d.setDate(today.getDate() - daysAgo);
    return d;
  };

  const transactionsData = [
    // Income
    { title: 'Monthly Salary', amount: 5000, type: 'INCOME', date: randomDate(25), categoryId: getCat('Salary').id, userId: user.id, note: 'October Salary' },
    
    // Expenses
    { title: 'Grocery Shopping', amount: 85.5, type: 'EXPENSE', date: randomDate(24), categoryId: getCat('Food & Dining').id, userId: user.id, note: 'Weekly groceries at Walmart' },
    { title: 'Uber to work', amount: 12.0, type: 'EXPENSE', date: randomDate(22), categoryId: getCat('Transport').id, userId: user.id },
    { title: 'Coffee', amount: 4.5, type: 'EXPENSE', date: randomDate(22), categoryId: getCat('Food & Dining').id, userId: user.id },
    { title: 'Amazon Purchase', amount: 120.0, type: 'EXPENSE', date: randomDate(20), categoryId: getCat('Shopping').id, userId: user.id, note: 'New headphones' },
    { title: 'Pharmacy', amount: 35.0, type: 'EXPENSE', date: randomDate(18), categoryId: getCat('Health').id, userId: user.id },
    { title: 'Dinner with friends', amount: 65.0, type: 'EXPENSE', date: randomDate(15), categoryId: getCat('Food & Dining').id, userId: user.id },
    { title: 'Gas', amount: 40.0, type: 'EXPENSE', date: randomDate(14), categoryId: getCat('Transport').id, userId: user.id },
    { title: 'Flight Tickets', amount: 350.0, type: 'EXPENSE', date: randomDate(10), categoryId: getCat('Travel').id, userId: user.id, note: 'Trip home' },
    { title: 'Rent', amount: 1200.0, type: 'EXPENSE', date: randomDate(5), categoryId: getCat('Home').id, userId: user.id },
    { title: 'Internet Bill', amount: 60.0, type: 'EXPENSE', date: randomDate(4), categoryId: getCat('Home').id, userId: user.id, note: 'Monthly internet' },
    { title: 'Lunch', amount: 15.0, type: 'EXPENSE', date: randomDate(3), categoryId: getCat('Food & Dining').id, userId: user.id },
    { title: 'Subway Ticket', amount: 2.50, type: 'EXPENSE', date: randomDate(2), categoryId: getCat('Transport').id, userId: user.id },
    { title: 'Protein Powder', amount: 45.0, type: 'EXPENSE', date: randomDate(1), categoryId: getCat('Health').id, userId: user.id },
    { title: 'Coffee', amount: 4.5, type: 'EXPENSE', date: new Date(), categoryId: getCat('Food & Dining').id, userId: user.id },
  ];

  await prisma.transaction.createMany({
    data: transactionsData,
  });

  console.log(`Created ${transactionsData.length} transactions.`);
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
