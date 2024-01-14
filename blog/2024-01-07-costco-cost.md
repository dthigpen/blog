---
slug: costco-cost
title: Is a Costco Membership Worth it?
authors: [dthigpen]
tags: [costco, food, money, finance]
---

If you happen to live in one of the 500+ cities in the United States that have a Costco, you may have considered whether getting a membership is worth it or not. This post walks through my process of evaluating that question to determine if it was worth it for my household. If you don't have a Costco nearby or live outside the United States, the same process could be used for any membership based grocer, so it may still be worth the read.

### The Perks

A Costco membership has several perks to consider even at the base level. Depending on your lifestyle, you may take advantage of more or less of these. Here are the main ones:

- All Memberships
  - Valid at Costco locations worldwide
  - Costco Gas
  - Costco Optical
  - Costco Travel
  - Costco Tire Center
- Gold Star Membership
  - All of the above perks
  - Annual $60 fee
- Executive
  - All of the above perks
  - Extra benefits on select Costco Travel products
  - Annual 2% Reward on qualified Costco purchases
  - Annual $120 fee

For my household, I can really only guarantee that we will be using the membership for groceries and gas. While we do take at least one annual flight where we could take advantage of the travel benefits or discounted airline giftcards, it's enough of an unknown to not be considered in this calculation.

### Baseline Costs

Before we look at how Costco membership stacks up, we need a baseline ot compare against.

#### Gas Costs

I used [Gas Buddy](https://www.gasbuddy.com/) to find out the cost of gas in my area, average together the ones I frequently go to. Similarly, I was able to find the cost of gas at my nearest Costco. This came out to to $3.12/gallon for gas stations and $2.89/gallon for Costco.

#### Grocery and Gas Expenses

I looked back at my transactions to estimate my grocery and gas expenses in the last few months. I did this with [plaid-cli-python](https://github.com/dthigpen/plaid-cli-python), a program I wrote to download bank transactions with Plaid.

With my bank already linked, I exported all of the transactions to a file.

```
plaid-cli-python -o csv transactions --account bank-cc bank > cc.csv
```

Next I filter only the grocery and gas transactions respectively. If you are not sure what to filter on, open the file and skim through the category and transaction names first.

```
$ grep -i grocer cc.csv > groceries.csv
$ grep -i gas cc.csv > gas.csv
```

The last step is to calculate the monthly averages with a spreadsheet tool such as Excel, Sheets, or LibreOffice Calc. For me the values came out to about $245 per month for groceries and $96 per month for gas.

### Cost Comparison

Putting it all together, these are the values I came up with for my household. Now we can determine the break even point of the membership cost to determine if would be worth it or not.

| Item              | Value  |
|-------------------|--------|
| Gas Station       | $3.12/gal |
| Gas Costco        | $2.89/gal |
| Gas Expenses      | $96     |
| Gas Gallons       | Gas Expenses / Gas Station |
| Food Expenses     | $245    |
| Annual Membership | $60 or $120 |

```
Food Expenses + (Gas Costco * Gas Gallons) + (Membership / 12) <= Food Expenses + Gas Expenses
245 + 88.92 + (m / 12) <= 341
...
m <= 84.96
```

That is, assuming constant food expenses and gallons of gas a membership can cost up to $84 before it is no longer worth it based on the gas price reduction alone! That also means that unless you count on using Costco to reduce your grocery expenditure, increasing your gas usage significantly or heavily gaming the 2% Annual rewards, the Executive membership would already not be worth it.
