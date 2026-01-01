-- Clear existing products to prevent duplicates
TRUNCATE TABLE produits_femme CASCADE;

-- Reset sequence for clean IDs
ALTER SEQUENCE IF EXISTS produits_femme_id_seq RESTART WITH 1;

-- Insert 20 Women's Products
INSERT INTO produits_femme (nom, categorie, prix, description, image_url, created_at, updated_at) VALUES
('Elegant Silk Dress', 'Robes', 249.99, 'Stunning silk midi dress in emerald green. Perfect for special occasions.', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', NOW(), NOW()),
('Classic Trench Coat', 'Manteaux', 199.99, 'Timeless beige trench coat with belt. British elegance for any weather.', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400', NOW(), NOW()),
('High Waist Skinny Jeans', 'Jeans', 79.99, 'Flattering high-waist skinny jeans in dark indigo. Perfect fit guaranteed.', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400', NOW(), NOW()),
('Cashmere Cardigan', 'Pulls', 169.99, 'Luxurious cashmere cardigan in soft pink. Cozy elegance.', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400', NOW(), NOW()),
('Stiletto Heels Black', 'Chaussures', 139.99, 'Classic black stiletto heels. Timeless sophistication for any outfit.', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400', NOW(), NOW()),
('Floral Blouse', 'Chemisiers', 64.99, 'Beautiful floral print blouse in spring colors. Feminine and fresh.', 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400', NOW(), NOW()),
('Leather Handbag Tan', 'Sacs', 189.99, 'Premium leather handbag in tan. Spacious and stylish for everyday.', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400', NOW(), NOW()),
('Pleated Midi Skirt', 'Jupes', 69.99, 'Elegant pleated midi skirt in blush pink. Graceful movement.', 'https://images.unsplash.com/photo-1583496661160-fb5886a0uj73?w=400', NOW(), NOW()),
('Pearl Necklace', 'Bijoux', 129.99, 'Classic freshwater pearl necklace. Timeless elegance.', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400', NOW(), NOW()),
('Wrap Dress Red', 'Robes', 119.99, 'Flattering wrap dress in vibrant red. Curves in all the right places.', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400', NOW(), NOW()),
('Ankle Boots Suede', 'Chaussures', 149.99, 'Chic suede ankle boots in camel. Perfect for autumn style.', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400', NOW(), NOW()),
('Silk Scarf Floral', 'Accessoires', 59.99, 'Luxurious silk scarf with floral pattern. Versatile accessory.', 'https://images.unsplash.com/photo-1601370690183-1c7796ecec61?w=400', NOW(), NOW()),
('Wide Leg Pants Cream', 'Pantalons', 84.99, 'Elegant wide leg pants in cream. Effortless sophistication.', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400', NOW(), NOW()),
('Lace Evening Gown', 'Robes', 349.99, 'Stunning black lace evening gown. Red carpet ready.', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400', NOW(), NOW()),
('Ballet Flats Nude', 'Chaussures', 69.99, 'Comfortable nude ballet flats. Everyday elegance.', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400', NOW(), NOW()),
('Denim Jacket Light', 'Vestes', 89.99, 'Classic light wash denim jacket. Casual cool essential.', 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=400', NOW(), NOW()),
('Crossbody Bag Black', 'Sacs', 79.99, 'Compact crossbody bag in black leather. Practical and chic.', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400', NOW(), NOW()),
('Cashmere Turtleneck', 'Pulls', 159.99, 'Soft cashmere turtleneck in ivory. Winter luxury.', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400', NOW(), NOW()),
('Cocktail Dress Navy', 'Robes', 179.99, 'Elegant navy cocktail dress with lace details. Party perfect.', 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=400', NOW(), NOW()),
('Gold Hoop Earrings', 'Bijoux', 49.99, 'Classic gold hoop earrings. Everyday glamour.', 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400', NOW(), NOW());

