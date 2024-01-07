---
slug: costco-cost
title: Is a Costco Membership Worth it?
authors: [dthigpen]
tags: [costco, food, money, finance]
---

If you happen to live in one of the 500+ cities in the United States that have a Costco, you may have considered whether getting a membership is worth it or not. This post walks through my process of evaluating that question to determine if it was worth it for my household. If you don't have a Costco nearby or live outside the United States, the same process could be used for any membership based grocer, so it may still be worth the read.

<!-- For my household, the factors I am going to consider for the calculation are the cost of groceries and gas, since those are the big two categories we would would consistently take advantage of at Costco. However, you may want to keep in mind other aspects of the membership throughout the calculation depending on your use case. -->

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

Use [Gas Buddy](https://www.gasbuddy.com/) to find out the cost of gas in your area. Both for Costco and at regular gas stations. If you regularly go to a few specific ones, average those together. For me this came out to $3.12/gallon for gas stations and $2.89/gallon for my closest Costco.

#### Grocery and Gas Expenses

Determine an estimate for your grocery and gas expenses any way you like. I am going to do this with [plaid-cli-python](https://github.com/dthigpen/plaid-cli-python), a program I wrote to download bank transactions with Plaid.

With my bank already linked, I exported all of the transactions to a file.

```
plaid-cli-python -o csv transactions --account bank-cc bank > cc.csv
```

Next filter only the grocery and gas transactions respectively. If you are not sure what to filter on, open the file and skim through the category and transaction names first.

```
$ grep -i grocer cc.csv > groceries.csv
$ grep -i gas cc.csv > gas.csv
```

Now you can use your preferred tool to calculate the monthly average. I did this with LibreOffice Calc, because that was what I had installed. For me the values came out to about $245 per month for groceries and $96 per month for gas.

<!-- 
| Expense Category | Avg. Monthly Amount ($)
|------------------|-----------|
| Groceries | 245 |
| Gas       | 96  | -->

### Cost Comparison

Lets formulate various questions to help us compare the costs from different perspectives. I've put the values we found in the last section that we can use in the formulas we make.

| Item | Value |
|----------|-----------|
| Gas Station (gs)      | 3.12  |
| Gas Costco (gc)       | 2.89  |
| Gas Expenses (ge)     | 96    |
| Gas Gallons (ga)      | ge/gs |
| Food Expenses (f)     | 245   |
| Annual Membership (m) | 60,120 |

Assuming constant food expenses and gallons of gas how much could a membership cost before breaking even?

```
f + gc(ga) + (m / 12) <= f + ge
...
m <= 84.92
```

That is, a membership can cost up to $84 before it is no longer worth it based on the gas price reduction alone! That also means that unless you count on using Costco to reduce your grocery expenditure or heavily gaming the 2% Annual rewards, the Executive membership would already not be worth it.

TODO: other cost comparisons
TODO: conclusion
TODO: calculator component
