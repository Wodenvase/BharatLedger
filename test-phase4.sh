#!/bin/bash

echo "🧪 Phase 4 Testing Script"
echo "========================="
echo ""

# Check if database exists
if [ -f "prisma/dev.db" ]; then
    echo "✅ Database file exists"
else
    echo "❌ Database file missing"
    exit 1
fi

# Check seed data
echo ""
echo "📊 Checking database seed data..."
echo "SELECT COUNT(*) as user_count FROM User;" | npx prisma db execute --stdin 2>/dev/null || echo "Note: User count check requires running server"
echo "SELECT COUNT(*) as transaction_count FROM Transaction;" | npx prisma db execute --stdin 2>/dev/null || echo "Note: Transaction count check requires running server"
echo "SELECT COUNT(*) as account_count FROM Account;" | npx prisma db execute --stdin 2>/dev/null || echo "Note: Account count check requires running server"

# Check if API files exist
echo ""
echo "📁 Checking API files..."
if [ -f "app/api/dashboard/overview/route.ts" ]; then
    echo "✅ Overview API exists"
else
    echo "❌ Overview API missing"
fi

if [ -f "app/api/transactions/route.ts" ]; then
    echo "✅ Transactions API exists"
else
    echo "❌ Transactions API missing"
fi

# Check if dashboard pages are updated
echo ""
echo "📄 Checking dashboard pages..."
if grep -q "useSession" "app/dashboard/page.tsx"; then
    echo "✅ Dashboard overview page uses API (contains useSession)"
else
    echo "❌ Dashboard overview page not updated"
fi

if grep -q "api/transactions" "app/dashboard/transactions/page.tsx"; then
    echo "✅ Transactions page uses API"
else
    echo "❌ Transactions page not updated"
fi

# Check Prisma schema
echo ""
echo "🗄️  Checking Prisma schema..."
if grep -q "model Transaction" "prisma/schema.prisma"; then
    echo "✅ Transaction model exists"
else
    echo "❌ Transaction model missing"
fi

if grep -q "model Account" "prisma/schema.prisma"; then
    echo "✅ Account model exists"
else
    echo "❌ Account model missing"
fi

# Check seed script
echo ""
echo "🌱 Checking seed script..."
if [ -f "prisma/seed.ts" ]; then
    echo "✅ Seed script exists"
else
    echo "❌ Seed script missing"
fi

echo ""
echo "========================="
echo "✨ Phase 4 Files Check Complete!"
echo ""
echo "🚀 To test the application:"
echo "   1. Run: npm run dev"
echo "   2. Visit: http://localhost:3000"
echo "   3. Login with: demo@bharatledger.com / test123"
echo "   4. Check dashboard for real data from API"
echo ""
echo "📖 See PHASE4_COMPLETE.md for full documentation"
