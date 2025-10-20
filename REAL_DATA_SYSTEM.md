# Real Data System - How GridShare Calculates Metrics

## 🎯 Overview

All metrics in GridShare are now **100% based on actual marketplace transactions**. No mock data, no random values, no fake numbers!

---

## 🔄 How The System Works

### Data Flow

```
User Actions (Marketplace) 
    ↓
Create Listings / Purchase Energy
    ↓
MongoDB Transactions & Listings
    ↓
Derived Energy Metrics
    ↓
Dashboard & Analytics Display
```

---

## 📊 Metric Calculations

### 1. **Production** (Energy You Sell)

**Source**: Transactions where you are the SELLER

**Calculation**:
```typescript
Production = SUM(energyAmount) WHERE sellerId = your_user_id
```

**How it works**:
- When you create a listing and someone buys it → That energy counts as YOUR PRODUCTION
- Aggregated by hour for last 7 days
- Example: You sold 10 kWh at 2pm = 10 kWh production at 2pm

**Real-World Meaning**: Energy you generated (solar panels, wind turbine, etc.) and sold to others

---

### 2. **Consumption** (Energy You Buy)

**Source**: Transactions where you are the BUYER

**Calculation**:
```typescript
Consumption = SUM(energyAmount) WHERE buyerId = your_user_id
```

**How it works**:
- When you purchase energy from marketplace → That counts as YOUR CONSUMPTION
- Aggregated by hour for last 7 days
- Example: You bought 5 kWh at 3pm = 5 kWh consumption at 3pm

**Real-World Meaning**: Energy you purchased and consumed from neighbors

---

### 3. **Current Production** (Dashboard Card)

**Formula**: Latest hour's production value

```typescript
currentProduction = energyData[most_recent_hour].production
```

**Change %**: 
```typescript
last24h = SUM(production for last 24 hours)
previous24h = SUM(production for hours 24-48 ago)
change = ((last24h - previous24h) / previous24h) × 100
```

---

### 4. **Daily Consumption** (Dashboard Card)

**Formula**: Sum of last 24 hours consumption

```typescript
dailyConsumption = SUM(last 24 hours of consumption)
```

**Change %**: Compares last 24h vs previous 24h
- **Green (negative)**: Consuming LESS energy (good!)
- **Red (positive)**: Consuming MORE energy

---

### 5. **Monthly Savings** (Dashboard Card)

**Formula**: Real savings from P2P vs Grid price

```typescript
energyBought = SUM(energyAmount WHERE buyerId = you, last 30 days)
actualCost = SUM(totalAmount WHERE buyerId = you, last 30 days)
gridCost = energyBought × $0.22 (standard grid price)
savingsPercent = ((gridCost - actualCost) / gridCost) × 100
savingsDollars = gridCost - actualCost
```

**Example**:
- You bought 100 kWh from neighbors at avg $0.16/kWh = $16
- Grid would charge: 100 kWh × $0.22 = $22
- **Savings: 27% or $6.00**

---

### 6. **Transactions Count** (Dashboard Card)

**Formula**: Count of all transactions in last 30 days

```typescript
currentMonth = COUNT(transactions in last 30 days)
previousMonth = COUNT(transactions 30-60 days ago)
change = ((currentMonth - previousMonth) / previousMonth) × 100
```

---

### 7. **Price Comparison Chart** (Dashboard)

**P2P Price** (Green line):
```typescript
For each day:
  if transactions exist:
    avgPrice = AVERAGE(pricePerKwh from transactions)
  else if listings exist:
    avgPrice = AVERAGE(pricePerKwh from listings)
  else:
    avgPrice = $0.165 (default 25% savings)
```

**Grid Price** (Red line): Fixed at $0.22/kWh (standard utility rate)

**Savings**: Gap between lines = your savings per kWh

---

### 8. **Energy Flow Chart** (Dashboard)

Shows hourly production vs consumption for last 24 hours

**Data**: Direct from derived energy data
- Green area = Production (energy you sold)
- Blue area = Consumption (energy you bought)

**Interpretation**:
- Green > Blue = You're a net producer (selling more than buying)
- Blue > Green = You're a net consumer (buying more than selling)

---

### 9. **Analytics: Energy Produced/Consumed**

**Time Range Based**:
- **Last Week**: Sum of last 7 days
- **Last Month**: Sum of last 30 days  
- **Last 3 Months**: Sum of last 90 days

**Change %**: Compares current period vs equal previous period
```typescript
current = SUM(production in selected period)
previous = SUM(production in equal previous period)
change = ((current - previous) / previous) × 100
```

---

### 10. **Analytics: Total Earnings**

**Formula**: Money earned from selling energy

```typescript
totalEarnings = SUM(totalAmount WHERE sellerId = you)
```

**By time range selected**:
- Last Week: Earnings from last 7 days
- Last Month: Earnings from last 30 days
- Last 3 Months: Earnings from last 90 days

---

### 11. **Analytics: Total Spending**

**Formula**: Money spent buying energy

```typescript
totalSpending = SUM(totalAmount WHERE buyerId = you)
```

**Change**:
- **Green (negative)**: Spending LESS (saving money!)
- **Red (positive)**: Spending MORE

---

### 12. **Daily Energy Flow Chart** (Analytics)

Shows last 14 days of production vs consumption

**Data**: Daily aggregation of hourly data
```typescript
For each day:
  production = SUM(hourly production for that day)
  consumption = SUM(hourly consumption for that day)
```

---

### 13. **Monthly Financial Overview** (Analytics)

Shows last 6 months of earnings vs spending

**Data**: Monthly aggregation of transactions
```typescript
For each month:
  earnings = SUM(totalAmount WHERE sellerId = you)
  spending = SUM(totalAmount WHERE buyerId = you)
```

**Goal**: Green line (earnings) above red line (spending) = net profit!

---

### 14. **Energy Source Distribution** (Analytics)

Shows pie chart of energy types you've purchased

**Data**: Aggregates by energySource field
```typescript
For each source (solar, wind, hydro, mixed):
  totalEnergy = SUM(energyAmount WHERE buyerId = you AND energySource = source)
```

**Colors**:
- 🟡 Solar: Yellow (#f59e0b)
- 🔵 Wind: Blue (#3b82f6)
- 🔵 Hydro: Cyan (#06b6d4)
- 🟣 Mixed: Purple (#8b5cf6)

---

### 15. **Trading Summary Cards** (Analytics)

**Total Transactions**: `COUNT(all transactions)`

**Avg. Price**: 
```typescript
avgPrice = SUM(pricePerKwh) / COUNT(transactions)
```

**Energy Traded**: 
```typescript
totalEnergy = SUM(energyAmount from all transactions)
```

**Success Rate**: 
```typescript
successRate = (COUNT(status = 'confirmed') / COUNT(all)) × 100
```

---

## 🚀 How to Populate Your Dashboard

### Step 1: Create a Listing (Sell Energy)

1. Go to **Marketplace** tab
2. Click **"Sell Energy"** button
3. Fill in the form:
   - Energy Amount: e.g., `50 kWh`
   - Price per kWh: e.g., `$0.16`
   - Energy Source: `Solar`, `Wind`, `Hydro`, or `Mixed`
   - Location: Your address
   - Available Until: Future date

4. Click **"Create Listing"**

**Result**: 
✅ When someone buys from this listing:
- Their dashboard shows +50 kWh consumption
- Your dashboard shows +50 kWh production
- You earn money (shows in Analytics earnings)

---

### Step 2: Buy Energy (Purchase)

1. Go to **Marketplace** tab
2. Browse available listings
3. Click **"Buy"** on a listing
4. Enter amount to purchase
5. Confirm purchase

**Result**:
✅ Immediately after purchase:
- Your dashboard shows consumption increase
- Your spending increases
- Seller's production increases
- Seller's earnings increase
- Transaction appears in Recent Activity

---

### Step 3: Check Your Metrics

**Dashboard Tab**:
- ✅ Current Production: Shows latest hour's sales
- ✅ Daily Consumption: Shows last 24h purchases
- ✅ Monthly Savings: Calculates real savings vs grid
- ✅ Transactions: Shows count with month-over-month change
- ✅ Energy Flow Chart: Visualizes hourly activity
- ✅ Price Comparison: Shows market price trends
- ✅ Recent Transactions: Lists your latest activity

**Analytics Tab**:
- ✅ Energy Produced: Total kWh sold
- ✅ Energy Consumed: Total kWh bought
- ✅ Total Earnings: Money made from sales
- ✅ Total Spending: Money spent on purchases
- ✅ All charts update with real data

---

## 📈 Example Scenario

### Day 1: Creating Your First Listing

**Action**: Create listing - 100 kWh Solar at $0.18/kWh

**Dashboard Shows**:
- Production: 0 kWh (no one bought yet)
- Consumption: 0 kWh
- Savings: N/A
- Transactions: 0

---

### Day 2: Someone Buys 25 kWh

**Transaction Created**:
- Buyer purchases 25 kWh at $0.18/kWh
- Total: $4.50

**Your Dashboard Updates**:
- ✅ Production: 25 kWh (+100% from yesterday)
- ✅ Monthly Savings: N/A (you're selling, not buying)
- ✅ Transactions: 1 (+100%)
- ✅ Recent Activity: Shows "Sold 25 kWh - $4.50"

**Your Analytics Updates**:
- ✅ Energy Produced: 25 kWh
- ✅ Total Earnings: $4.50
- ✅ Daily Energy Flow: Shows 25 kWh production bar

---

### Day 3: You Purchase 30 kWh

**Action**: Buy 30 kWh Wind energy at $0.15/kWh = $4.50

**Your Dashboard Updates**:
- ✅ Production: Still 25 kWh
- ✅ Consumption: 30 kWh (NEW!)
- ✅ Monthly Savings: 31.8% ($2.10 saved vs $6.60 grid cost)
- ✅ Transactions: 2 (+100%)
- ✅ Energy Flow: Shows both production and consumption

**Your Analytics Updates**:
- ✅ Energy Produced: 25 kWh
- ✅ Energy Consumed: 30 kWh
- ✅ Total Earnings: $4.50
- ✅ Total Spending: $4.50
- ✅ Net Financial: $0.00 (break even)
- ✅ Energy Source: Shows 30 kWh Wind (100%)

---

## 🎓 Understanding The Math

### Example: Complete Month Calculation

**Your Activity This Month**:

**Sales** (You're the Seller):
- Transaction 1: Sold 25 kWh @ $0.18/kWh = $4.50
- Transaction 2: Sold 50 kWh @ $0.17/kWh = $8.50
- Transaction 3: Sold 30 kWh @ $0.19/kWh = $5.70
- **Total Production**: 105 kWh
- **Total Earnings**: $18.70

**Purchases** (You're the Buyer):
- Transaction 4: Bought 30 kWh @ $0.15/kWh = $4.50
- Transaction 5: Bought 40 kWh @ $0.16/kWh = $6.40
- Transaction 6: Bought 20 kWh @ $0.14/kWh = $2.80
- **Total Consumption**: 90 kWh
- **Total Spending**: $13.70

---

**Dashboard Metrics**:

1. **Current Production**: 
   - Latest hour value (e.g., if Transaction 3 was at 3pm, shows ~30 kWh)

2. **Daily Consumption**: 
   - Sum of last 24h (depends on when transactions occurred)

3. **Monthly Savings**:
   ```
   Grid cost = 90 kWh × $0.22 = $19.80
   Actual cost = $13.70
   Savings = ($19.80 - $13.70) / $19.80 = 30.8%
   Dollar amount = $6.10 saved
   ```

4. **Transactions**: 6 total

---

**Analytics Metrics**:

1. **Energy Produced**: 105 kWh
2. **Energy Consumed**: 90 kWh
3. **Total Earnings**: $18.70
4. **Total Spending**: $13.70
5. **Net Profit**: $18.70 - $13.70 = **$5.00** 💰

6. **Avg. Price**: 
   - Overall: ($0.18 + $0.17 + $0.19 + $0.15 + $0.16 + $0.14) / 6 = **$0.165/kWh**

7. **Energy Source Distribution**:
   - Depends on energySource of purchases
   - Example: 30 kWh Wind, 40 kWh Solar, 20 kWh Hydro

---

## ✅ Data Guarantees

### What is REAL:
- ✅ All transaction amounts
- ✅ All energy quantities (kWh)
- ✅ All prices ($/kWh)
- ✅ All timestamps
- ✅ All user IDs
- ✅ All transaction statuses

### What is CALCULATED (but from real data):
- ✅ Percentage changes (real math comparing real periods)
- ✅ Averages (real aggregations)
- ✅ Totals (real summations)
- ✅ Savings (real comparison with actual grid price)

### What is ESTIMATED:
- ⚠️ Grid price: Fixed at $0.22/kWh (realistic utility average)
- ⚠️ Battery level: Simplified simulation based on net energy

---

## 🔍 Troubleshooting

### "No Data Available"

**Cause**: You haven't made any transactions yet

**Solution**: 
1. Create a listing in Marketplace, or
2. Purchase energy from existing listings

---

### "All values show 0"

**Cause**: No transactions in the selected time period

**Solution**: 
- Try different time ranges in Analytics
- Make more transactions to populate data

---

### "Charts are empty"

**Cause**: Insufficient transaction history

**Solution**: 
- Need at least 1 transaction for data to appear
- More transactions = better charts and trends

---

## 🎯 Key Takeaways

1. **Everything is Transaction-Based**: No fake data, all from real marketplace activity

2. **Production = Sales**: When you sell energy, it counts as your production

3. **Consumption = Purchases**: When you buy energy, it counts as your consumption

4. **Real Savings Calculation**: Compares what you actually paid P2P vs what grid would charge

5. **Historical Comparisons**: All % changes compare equal time periods (last 24h vs previous 24h, etc.)

6. **Immediate Updates**: As soon as a transaction completes, all metrics update

7. **Multi-User System**: Each user's metrics are independent and private

---

## 🚀 Next Steps

Want to see meaningful data?

1. **For Sellers**: Create multiple listings with different amounts and prices
2. **For Buyers**: Purchase from various sellers to diversify your energy sources
3. **Check Progress**: Visit Dashboard and Analytics regularly to see trends
4. **Compare Periods**: Use time range selector in Analytics to see growth
5. **Optimize Prices**: Check Price Comparison chart to set competitive prices

**Remember**: The more you trade, the richer your data becomes! 📊✨

---

## 📧 Summary

GridShare is now a **fully data-driven platform** where every number you see represents:
- Real marketplace activity
- Actual energy transactions
- True financial metrics
- Honest savings calculations

**No random values. No fake percentages. Just real data from real trades.** 💯
