# ERP SYSTEM API

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/37r4n/erp-system-api.git
cd erp-system-api

# 2. Install dependencies
npm install

# 3. Set up your environment variables
cp .env.example .env

# 4. Run the application
npm run tsc
npx prisma db push
prisma db pull
npm run start
```
