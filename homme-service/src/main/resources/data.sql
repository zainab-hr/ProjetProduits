-- Clear existing products to prevent duplicates
TRUNCATE TABLE produits_homme CASCADE;

-- Reset sequence for clean IDs
ALTER SEQUENCE IF EXISTS produits_homme_id_seq RESTART WITH 1;

-- Insert 20 Men's Products
INSERT INTO produits_homme (nom, categorie, prix, description, image_url, created_at, updated_at) VALUES
('Classic Navy Blazer', 'Vestes', 189.99, 'Elegant navy blue blazer perfect for business and casual occasions. Made with premium wool blend.', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400', NOW(), NOW()),
('Slim Fit White Shirt', 'Chemises', 59.99, 'Crisp white cotton shirt with modern slim fit. Perfect for any occasion.', 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400', NOW(), NOW()),
('Dark Denim Jeans', 'Jeans', 89.99, 'Premium dark wash jeans with comfortable stretch. Classic straight leg fit.', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', NOW(), NOW()),
('Leather Oxford Shoes', 'Chaussures', 149.99, 'Handcrafted leather oxford shoes in classic brown. Timeless elegance.', 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400', NOW(), NOW()),
('Wool Overcoat', 'Manteaux', 299.99, 'Luxurious wool overcoat in charcoal grey. Perfect for winter elegance.', 'https://images.unsplash.com/photo-1544923246-77307dd628b0?w=400', NOW(), NOW()),
('Cashmere Sweater', 'Pulls', 179.99, 'Soft cashmere crew neck sweater in burgundy. Ultimate comfort and style.', 'https://images.unsplash.com/photo-1638718774915-0dc61a7f7f8e?w=400', NOW(), NOW()),
('Chino Pants Beige', 'Pantalons', 69.99, 'Classic beige chino pants with perfect fit. Versatile for any occasion.', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400', NOW(), NOW()),
('Polo Shirt Navy', 'Polos', 49.99, 'Premium cotton polo shirt in navy blue. Casual yet refined.', 'https://images.unsplash.com/photo-1625910513413-5fc5b62a5db4?w=400', NOW(), NOW()),
('Leather Belt Brown', 'Accessoires', 45.99, 'Genuine leather belt with classic silver buckle. Essential accessory.', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', NOW(), NOW()),
('Sports Sneakers', 'Chaussures', 119.99, 'Comfortable athletic sneakers in white and grey. Perfect for active lifestyle.', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', NOW(), NOW()),
('Bomber Jacket Black', 'Vestes', 159.99, 'Stylish black bomber jacket with satin finish. Urban street style.', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', NOW(), NOW()),
('Striped Tie', 'Accessoires', 35.99, 'Silk striped tie in blue and silver. Professional elegance.', 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=400', NOW(), NOW()),
('V-Neck T-Shirt Grey', 'T-Shirts', 29.99, 'Soft cotton v-neck t-shirt in heather grey. Everyday essential.', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', NOW(), NOW()),
('Cargo Shorts Khaki', 'Shorts', 54.99, 'Comfortable cargo shorts in khaki. Perfect for summer adventures.', 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400', NOW(), NOW()),
('Suede Loafers', 'Chaussures', 129.99, 'Italian suede loafers in tan. Sophisticated casual footwear.', 'https://images.unsplash.com/photo-1614252368787-61e6d0affc29?w=400', NOW(), NOW()),
('Hooded Sweatshirt', 'Sweats', 79.99, 'Cozy hooded sweatshirt in forest green. Relaxed comfort style.', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400', NOW(), NOW()),
('Linen Shirt Blue', 'Chemises', 74.99, 'Breathable linen shirt in sky blue. Perfect for summer occasions.', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400', NOW(), NOW()),
('Dress Watch Silver', 'Accessoires', 199.99, 'Elegant silver dress watch with leather strap. Timeless sophistication.', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400', NOW(), NOW()),
('Track Pants Black', 'Pantalons', 64.99, 'Athletic track pants in black with white stripes. Sporty comfort.', 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400', NOW(), NOW()),
('Quilted Vest Navy', 'Vestes', 99.99, 'Lightweight quilted vest in navy. Perfect layering piece for fall.', 'https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=400', NOW(), NOW())
ON CONFLICT DO NOTHING;
