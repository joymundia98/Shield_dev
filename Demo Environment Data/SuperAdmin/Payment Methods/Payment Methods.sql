--SELECT * FROM payment_methods;
INSERT INTO payment_methods (name, provider, created_at, updated_at) VALUES
-- 1. Cash
('Cash', 'Cash', NOW(), NOW()),

-- 2. Credit Card (all banks separate)
('Credit Card', 'ABSA Bank Zambia Plc', NOW(), NOW()),
('Credit Card', 'Access Bank Zambia Ltd', NOW(), NOW()),
('Credit Card', 'Bank of China (Zambia) Ltd', NOW(), NOW()),
('Credit Card', 'Citibank Zambia Ltd', NOW(), NOW()),
('Credit Card', 'Ecobank Zambia Ltd', NOW(), NOW()),
('Credit Card', 'First Alliance Bank Zambia Ltd', NOW(), NOW()),
('Credit Card', 'First Capital Bank Zambia Ltd', NOW(), NOW()),
('Credit Card', 'FNB Zambia Ltd', NOW(), NOW()),
('Credit Card', 'Indo-Zambia Bank Ltd', NOW(), NOW()),
('Credit Card', 'Stanbic Bank Zambia Ltd', NOW(), NOW()),
('Credit Card', 'Standard Chartered Bank Zambia Plc', NOW(), NOW()),
('Credit Card', 'UBA Zambia Ltd', NOW(), NOW()),
('Credit Card', 'ZICB', NOW(), NOW()),
('Credit Card', 'Zanaco', NOW(), NOW()),
('Credit Card', 'AB Bank Zambia Ltd', NOW(), NOW()),

-- 3. Debit Card (all banks separate)
('Debit Card', 'ABSA Bank Zambia Plc', NOW(), NOW()),
('Debit Card', 'Access Bank Zambia Ltd', NOW(), NOW()),
('Debit Card', 'Bank of China (Zambia) Ltd', NOW(), NOW()),
('Debit Card', 'Citibank Zambia Ltd', NOW(), NOW()),
('Debit Card', 'Ecobank Zambia Ltd', NOW(), NOW()),
('Debit Card', 'First Alliance Bank Zambia Ltd', NOW(), NOW()),
('Debit Card', 'First Capital Bank Zambia Ltd', NOW(), NOW()),
('Debit Card', 'FNB Zambia Ltd', NOW(), NOW()),
('Debit Card', 'Indo-Zambia Bank Ltd', NOW(), NOW()),
('Debit Card', 'Stanbic Bank Zambia Ltd', NOW(), NOW()),
('Debit Card', 'Standard Chartered Bank Zambia Plc', NOW(), NOW()),
('Debit Card', 'UBA Zambia Ltd', NOW(), NOW()),
('Debit Card', 'ZICB', NOW(), NOW()),
('Debit Card', 'Zanaco', NOW(), NOW()),
('Debit Card', 'AB Bank Zambia Ltd', NOW(), NOW()),

-- 4. Bank Transfer (all banks + remittance)
('Bank Transfer', 'ABSA Bank Zambia Plc', NOW(), NOW()),
('Bank Transfer', 'Access Bank Zambia Ltd', NOW(), NOW()),
('Bank Transfer', 'Bank of China (Zambia) Ltd', NOW(), NOW()),
('Bank Transfer', 'Citibank Zambia Ltd', NOW(), NOW()),
('Bank Transfer', 'Ecobank Zambia Ltd', NOW(), NOW()),
('Bank Transfer', 'First Alliance Bank Zambia Ltd', NOW(), NOW()),
('Bank Transfer', 'First Capital Bank Zambia Ltd', NOW(), NOW()),
('Bank Transfer', 'FNB Zambia Ltd', NOW(), NOW()),
('Bank Transfer', 'Indo-Zambia Bank Ltd', NOW(), NOW()),
('Bank Transfer', 'Stanbic Bank Zambia Ltd', NOW(), NOW()),
('Bank Transfer', 'Standard Chartered Bank Zambia Plc', NOW(), NOW()),
('Bank Transfer', 'UBA Zambia Ltd', NOW(), NOW()),
('Bank Transfer', 'ZICB', NOW(), NOW()),
('Bank Transfer', 'Zanaco', NOW(), NOW()),
('Bank Transfer', 'AB Bank Zambia Ltd', NOW(), NOW()),
('Bank Transfer', 'Western Union', NOW(), NOW()),
('Bank Transfer', 'Mukuru', NOW(), NOW()),

-- 5. POS
('POS', 'Zanaco', NOW(), NOW()),
('POS', 'Stanbic', NOW(), NOW()),
('POS', 'ABSA', NOW(), NOW()),
('POS', 'FNB', NOW(), NOW()),
('POS', 'TechPay', NOW(), NOW()),

-- 6. Mobile Money
('Mobile Money', 'MTN MoMo', NOW(), NOW()),
('Mobile Money', 'Airtel Money', NOW(), NOW()),
('Mobile Money', 'Zamtel Kwacha', NOW(), NOW()),
('Mobile Money', 'TechPay', NOW(), NOW()),

-- 7. Cheque (all banks separate)
('Cheque', 'ABSA Bank Zambia Plc', NOW(), NOW()),
('Cheque', 'Access Bank Zambia Ltd', NOW(), NOW()),
('Cheque', 'Bank of China (Zambia) Ltd', NOW(), NOW()),
('Cheque', 'Citibank Zambia Ltd', NOW(), NOW()),
('Cheque', 'Ecobank Zambia Ltd', NOW(), NOW()),
('Cheque', 'First Alliance Bank Zambia Ltd', NOW(), NOW()),
('Cheque', 'First Capital Bank Zambia Ltd', NOW(), NOW()),
('Cheque', 'FNB Zambia Ltd', NOW(), NOW()),
('Cheque', 'Indo-Zambia Bank Ltd', NOW(), NOW()),
('Cheque', 'Stanbic Bank Zambia Ltd', NOW(), NOW()),
('Cheque', 'Standard Chartered Bank Zambia Plc', NOW(), NOW()),
('Cheque', 'UBA Zambia Ltd', NOW(), NOW()),
('Cheque', 'ZICB', NOW(), NOW()),
('Cheque', 'Zanaco', NOW(), NOW()),
('Cheque', 'AB Bank Zambia Ltd', NOW(), NOW()),

-- 8. Online Giving Platform
('Online Giving Platform', 'DPO Pay', NOW(), NOW()),
('Online Giving Platform', 'ZynlePay', NOW(), NOW()),
('Online Giving Platform', 'Sampay', NOW(), NOW()),

-- 9. Apple Pay
('Apple Pay', 'Apple Pay (Visa/Mastercard bank card required)', NOW(), NOW()),

-- 10. Google Pay
('Google Pay', 'Google Pay (Visa/Mastercard bank card required)', NOW(), NOW()),

-- 11. Samsung Pay
('Samsung Pay', 'Samsung Pay (Visa/Mastercard bank card required)', NOW(), NOW()),

-- 12. PayPal
('PayPal', 'PayPal', NOW(), NOW()),

-- 13. Cryptocurrency
('Cryptocurrency', 'Binance', NOW(), NOW()),
('Cryptocurrency', 'Coinbase', NOW(), NOW()),
('Cryptocurrency', 'Paxful', NOW(), NOW()),
('Cryptocurrency', 'LocalBitcoins', NOW(), NOW()),

-- 14. Buy Now, Pay Later
('Buy Now, Pay Later', 'Klarna', NOW(), NOW()),
('Buy Now, Pay Later', 'Afterpay', NOW(), NOW()),
('Buy Now, Pay Later', 'Affirm', NOW(), NOW()),

-- 15. Gift Card
('Gift Card', 'Merchant issued', NOW(), NOW()),
('Gift Card', 'Visa Gift Card', NOW(), NOW()),
('Gift Card', 'Mastercard Gift Card', NOW(), NOW()),

-- 16. Prepaid Card
('Prepaid Card', 'Bank issued prepaid card', NOW(), NOW()),
('Prepaid Card', 'Fintech virtual card', NOW(), NOW()),

-- 17. Direct Debit (all banks separate)
('Direct Debit', 'ABSA Bank Zambia Plc', NOW(), NOW()),
('Direct Debit', 'Access Bank Zambia Ltd', NOW(), NOW()),
('Direct Debit', 'Bank of China (Zambia) Ltd', NOW(), NOW()),
('Direct Debit', 'Citibank Zambia Ltd', NOW(), NOW()),
('Direct Debit', 'Ecobank Zambia Ltd', NOW(), NOW()),
('Direct Debit', 'First Alliance Bank Zambia Ltd', NOW(), NOW()),
('Direct Debit', 'First Capital Bank Zambia Ltd', NOW(), NOW()),
('Direct Debit', 'FNB Zambia Ltd', NOW(), NOW()),
('Direct Debit', 'Indo-Zambia Bank Ltd', NOW(), NOW()),
('Direct Debit', 'Stanbic Bank Zambia Ltd', NOW(), NOW()),
('Direct Debit', 'Standard Chartered Bank Zambia Plc', NOW(), NOW()),
('Direct Debit', 'UBA Zambia Ltd', NOW(), NOW()),
('Direct Debit', 'ZICB', NOW(), NOW()),
('Direct Debit', 'Zanaco', NOW(), NOW()),
('Direct Debit', 'AB Bank Zambia Ltd', NOW(), NOW()),

-- 18. Standing Order (all banks separate)
('Standing Order', 'ABSA Bank Zambia Plc', NOW(), NOW()),
('Standing Order', 'Access Bank Zambia Ltd', NOW(), NOW()),
('Standing Order', 'Bank of China (Zambia) Ltd', NOW(), NOW()),
('Standing Order', 'Citibank Zambia Ltd', NOW(), NOW()),
('Standing Order', 'Ecobank Zambia Ltd', NOW(), NOW()),
('Standing Order', 'First Alliance Bank Zambia Ltd', NOW(), NOW()),
('Standing Order', 'First Capital Bank Zambia Ltd', NOW(), NOW()),
('Standing Order', 'FNB Zambia Ltd', NOW(), NOW()),
('Standing Order', 'Indo-Zambia Bank Ltd', NOW(), NOW()),
('Standing Order', 'Stanbic Bank Zambia Ltd', NOW(), NOW()),
('Standing Order', 'Standard Chartered Bank Zambia Plc', NOW(), NOW()),
('Standing Order', 'UBA Zambia Ltd', NOW(), NOW()),
('Standing Order', 'ZICB', NOW(), NOW()),
('Standing Order', 'Zanaco', NOW(), NOW()),
('Standing Order', 'AB Bank Zambia Ltd', NOW(), NOW()),

-- 19. Money Order (all banks + Western Union + Mukuru + Zambia Post)
('Money Order', 'Zambia Post', NOW(), NOW()),
('Money Order', 'ABSA Bank Zambia Plc', NOW(), NOW()),
('Money Order', 'Access Bank Zambia Ltd', NOW(), NOW()),
('Money Order', 'Bank of China (Zambia) Ltd', NOW(), NOW()),
('Money Order', 'Citibank Zambia Ltd', NOW(), NOW()),
('Money Order', 'Ecobank Zambia Ltd', NOW(), NOW()),
('Money Order', 'First Alliance Bank Zambia Ltd', NOW(), NOW()),
('Money Order', 'First Capital Bank Zambia Ltd', NOW(), NOW()),
('Money Order', 'FNB Zambia Ltd', NOW(), NOW()),
('Money Order', 'Indo-Zambia Bank Ltd', NOW(), NOW()),
('Money Order', 'Stanbic Bank Zambia Ltd', NOW(), NOW()),
('Money Order', 'Standard Chartered Bank Zambia Plc', NOW(), NOW()),
('Money Order', 'UBA Zambia Ltd', NOW(), NOW()),
('Money Order', 'ZICB', NOW(), NOW()),
('Money Order', 'Zanaco', NOW(), NOW()),
('Money Order', 'AB Bank Zambia Ltd', NOW(), NOW()),
('Money Order', 'Western Union', NOW(), NOW()),
('Money Order', 'Mukuru', NOW(), NOW());