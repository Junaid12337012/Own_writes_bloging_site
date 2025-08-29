-- Insert sample authors
INSERT INTO authors (id, name, avatar_url, bio, followers) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'Elena Voyage', 'https://picsum.photos/id/1011/100/100', 'Travel enthusiast and storyteller, sharing tales from around the globe.', 12500),
('550e8400-e29b-41d4-a716-446655440002', 'Marcus Tech', 'https://picsum.photos/id/1005/100/100', 'Software engineer and futurist, exploring the intersection of technology and society.', 25200),
('550e8400-e29b-41d4-a716-446655440003', 'Chloe Cuisine', 'https://picsum.photos/id/1027/100/100', 'Passionate chef and food blogger, creating delicious and approachable recipes.', 8900),
('550e8400-e29b-41d4-a716-446655440004', 'Liam Wellness', 'https://picsum.photos/id/1012/100/100', 'Advocate for mental clarity and physical health, guiding others toward a balanced life.', 15100),
('550e8400-e29b-41d4-a716-446655440005', 'Sophia Finance', 'https://picsum.photos/id/1025/100/100', 'Financial advisor demystifying money management for the modern generation.', 18000),
('550e8400-e29b-41d4-a716-446655440006', 'David Creative', 'https://picsum.photos/id/103/100/100', 'Writer and artist dedicated to helping others unlock their creative potential.', 7600);

-- Insert sample categories
INSERT INTO categories (id, name, description, image_url) VALUES 
('650e8400-e29b-41d4-a716-446655440001', 'Travel', 'Explore breathtaking destinations and hidden gems from around the world.', 'https://picsum.photos/id/1018/1200/400'),
('650e8400-e29b-41d4-a716-446655440002', 'Technology', 'Stay ahead of the curve with the latest in tech, from AI to web development.', 'https://picsum.photos/id/1/1200/400'),
('650e8400-e29b-41d4-a716-446655440003', 'Food', 'Discover delicious recipes, cooking tips, and culinary adventures.', 'https://picsum.photos/id/1080/1200/400'),
('650e8400-e29b-41d4-a716-446655440004', 'Productivity', 'Boost your efficiency with proven techniques and smart habits.', 'https://picsum.photos/id/1079/1200/400'),
('650e8400-e29b-41d4-a716-446655440005', 'Lifestyle', 'Insights and inspiration for living a more fulfilling and balanced life.', 'https://picsum.photos/id/1040/1200/400'),
('650e8400-e29b-41d4-a716-446655440006', 'Finance', 'Master your money with practical advice on budgeting, investing, and financial planning.', 'https://picsum.photos/id/1078/1200/400'),
('650e8400-e29b-41d4-a716-446655440007', 'Wellness', 'Nourish your mind, body, and soul with tips on health, fitness, and mindfulness.', 'https://picsum.photos/id/1068/1200/400'),
('650e8400-e29b-41d4-a716-446655440008', 'Creativity', 'Unlock your imagination and learn new skills in writing, art, and design.', 'https://picsum.photos/id/1050/1200/400');

-- Insert sample tags
INSERT INTO tags (id, name) VALUES 
('750e8400-e29b-41d4-a716-446655440001', 'Europe'),
('750e8400-e29b-41d4-a716-446655440002', 'Asia'),
('750e8400-e29b-41d4-a716-446655440003', 'AI'),
('750e8400-e29b-41d4-a716-446655440004', 'Web Dev'),
('750e8400-e29b-41d4-a716-446655440005', 'Baking'),
('750e8400-e29b-41d4-a716-446655440006', 'Healthy'),
('750e8400-e29b-41d4-a716-446655440007', 'Habits'),
('750e8400-e29b-41d4-a716-446655440008', 'Solo Travel'),
('750e8400-e29b-41d4-a716-446655440009', 'JavaScript'),
('750e8400-e29b-41d4-a716-446655440010', 'Investing'),
('750e8400-e29b-41d4-a716-446655440011', 'Budgeting'),
('750e8400-e29b-41d4-a716-446655440012', 'Mindfulness'),
('750e8400-e29b-41d4-a716-446655440013', 'Fitness'),
('750e8400-e29b-41d4-a716-446655440014', 'Writing'),
('750e8400-e29b-41d4-a716-446655440015', 'Blockchain'),
('750e8400-e29b-41d4-a716-446655440016', 'Remote Work'),
('750e8400-e29b-41d4-a716-446655440017', 'Coffee'),
('750e8400-e29b-41d4-a716-446655440018', 'Japan'),
('750e8400-e29b-41d4-a716-446655440019', 'Canada'),
('750e8400-e29b-41d4-a716-446655440020', 'Mental Health');

-- Insert sample posts
INSERT INTO posts (id, title, slug, excerpt, content, image_url, author_id, category_id, reading_time, likes, featured, status) VALUES 
('850e8400-e29b-41d4-a716-446655440001', 'Hidden Gems of Eastern Europe', 'hidden-gems-eastern-europe', 'Discover the breathtaking landscapes and rich cultures of Eastern Europe''s most underrated destinations.', '<h1>Hidden Gems of Eastern Europe</h1><p>Eastern Europe is home to some of the world''s most stunning and underexplored destinations...</p>', 'https://picsum.photos/id/1018/800/400', '550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 8, 156, true, 'published'),
('850e8400-e29b-41d4-a716-446655440002', 'The Future of AI in Web Development', 'future-ai-web-development', 'Explore how artificial intelligence is revolutionizing the way we build and interact with websites.', '<h1>The Future of AI in Web Development</h1><p>Artificial intelligence is transforming every industry, and web development is no exception...</p>', 'https://picsum.photos/id/1/800/400', '550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440002', 12, 243, true, 'published'),
('850e8400-e29b-41d4-a716-446655440003', 'Perfect Sourdough: A Beginner''s Guide', 'perfect-sourdough-beginners-guide', 'Learn the art of sourdough baking with this comprehensive guide for beginners.', '<h1>Perfect Sourdough: A Beginner''s Guide</h1><p>There''s nothing quite like the smell of fresh sourdough bread baking in your oven...</p>', 'https://picsum.photos/id/1080/800/400', '550e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440003', 15, 89, false, 'published'),
('850e8400-e29b-41d4-a716-446655440004', 'Building Better Habits in 2024', 'building-better-habits-2024', 'Transform your life with these science-backed strategies for creating lasting positive habits.', '<h1>Building Better Habits in 2024</h1><p>The new year brings new opportunities to transform our lives through better habits...</p>', 'https://picsum.photos/id/1079/800/400', '550e8400-e29b-41d4-a716-446655440004', '650e8400-e29b-41d4-a716-446655440004', 10, 178, true, 'published'),
('850e8400-e29b-41d4-a716-446655440005', 'Investing for Millennials', 'investing-for-millennials', 'A practical guide to building wealth through smart investing strategies tailored for millennials.', '<h1>Investing for Millennials</h1><p>Millennials face unique financial challenges, but with the right investment strategies...</p>', 'https://picsum.photos/id/1078/800/400', '550e8400-e29b-41d4-a716-446655440005', '650e8400-e29b-41d4-a716-446655440006', 14, 267, false, 'published');

-- Insert post tags relationships
INSERT INTO post_tags (post_id, tag_id) VALUES 
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001'),
('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440008'),
('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440003'),
('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440004'),
('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440009'),
('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440005'),
('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440006'),
('850e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440007'),
('850e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440012'),
('850e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440010'),
('850e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440011');

-- Create admin user (password: admin123)
INSERT INTO users (id, name, email, password, avatar_url, is_verified, is_admin) VALUES 
('450e8400-e29b-41d4-a716-446655440001', 'Admin User', 'admin@ownwrites.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdj6SBBzXSBUu', 'https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff', true, true);
