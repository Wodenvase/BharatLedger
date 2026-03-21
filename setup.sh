#!/bin/bash

echo "🚀 BharatLedger Next.js Setup"
echo "=============================="
echo ""

# Check if DATABASE_URL is set
if grep -q "postgresql://user:password@localhost" .env; then
    echo "⚠️  WARNING: You haven't updated your DATABASE_URL yet!"
    echo ""
    echo "Please follow these steps:"
    echo "1. Go to https://railway.app (or render.com)"
    echo "2. Create a new PostgreSQL database"
    echo "3. Copy the connection string"
    echo "4. Update the DATABASE_URL in .env file"
    echo ""
    read -p "Press Enter after you've updated .env..."
fi

echo "📦 Generating Prisma Client..."
npx prisma generate

echo ""
echo "🗄️  Pushing schema to database..."
npx prisma db push

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database setup complete!"
    echo ""
    echo "🎉 Starting development server..."
    echo "   Visit: http://localhost:3000"
    echo ""
    npm run dev
else
    echo ""
    echo "❌ Database connection failed!"
    echo "Please check your DATABASE_URL in .env file"
    echo ""
    echo "Need help? Check QUICKSTART.md or MIGRATION_GUIDE.md"
fi
