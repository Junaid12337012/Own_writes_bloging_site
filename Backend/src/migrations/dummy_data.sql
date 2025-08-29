-- Dummy Data for OwnWrites Blog Platform
-- Run this after creating the schema

-- Insert Authors (skip if already exists)
INSERT INTO authors (id, name, avatar_url, bio, followers) 
SELECT uuid_generate_v4(), name, avatar_url, bio, followers
FROM (VALUES 
  ('Alex Johnson', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 'Tech enthusiast and full-stack developer with 8+ years of experience in web development.', 1250),
  ('Sarah Chen', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', 'UI/UX designer passionate about creating beautiful and functional user experiences.', 890),
  ('Marcus Rodriguez', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 'DevOps engineer and cloud architecture specialist. Love automating everything!', 675),
  ('Emily Watson', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 'Data scientist and machine learning researcher exploring AI applications.', 1100),
  ('David Kim', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', 'Mobile app developer specializing in React Native and Flutter development.', 750)
) AS new_authors(name, avatar_url, bio, followers)
WHERE NOT EXISTS (SELECT 1 FROM authors WHERE authors.name = new_authors.name);

-- Insert Categories (skip if already exists)
INSERT INTO categories (id, name, description, image_url) 
SELECT uuid_generate_v4(), name, description, image_url
FROM (VALUES 
  ('Technology', 'Latest trends and insights in technology', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop'),
  ('Web Development', 'Frontend, backend, and full-stack development tutorials', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop'),
  ('Design', 'UI/UX design principles and creative inspiration', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop'),
  ('DevOps', 'Deployment, automation, and infrastructure management', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop'),
  ('AI & Machine Learning', 'Artificial intelligence and machine learning insights', 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=400&h=200&fit=crop'),
  ('Mobile Development', 'iOS, Android, and cross-platform mobile development', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop')
) AS new_categories(name, description, image_url)
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE categories.name = new_categories.name);

-- Insert Tags (skip if already exists)
INSERT INTO tags (name) 
SELECT name FROM (VALUES 
  ('JavaScript'), ('React'), ('Node.js'), ('TypeScript'), ('CSS'), ('HTML'),
  ('Python'), ('Django'), ('Flask'), ('Docker'), ('Kubernetes'), ('AWS'),
  ('UI/UX'), ('Figma'), ('Design Systems'), ('Machine Learning'), ('AI'),
  ('TensorFlow'), ('PyTorch'), ('Data Science'), ('Mobile'), ('React Native'),
  ('Flutter'), ('iOS'), ('Android'), ('DevOps'), ('CI/CD'), ('Automation'),
  ('Cloud Computing'), ('Microservices'), ('API'), ('Database'), ('PostgreSQL')
) AS new_tags(name)
WHERE NOT EXISTS (SELECT 1 FROM tags WHERE tags.name = new_tags.name);

-- Get IDs for foreign key references (you'll need to replace these with actual IDs from your database)
-- For this example, I'll use variables that you can replace with actual UUIDs

-- Insert Blog Posts
WITH author_ids AS (
  SELECT id, name FROM authors ORDER BY name
),
category_ids AS (
  SELECT id, name FROM categories ORDER BY name
)
INSERT INTO posts (title, slug, excerpt, content, image_url, author_id, category_id, published_date, reading_time, likes, featured, status) 
SELECT 
  title,
  slug,
  excerpt,
  content,
  image_url,
  author_id,
  category_id,
  published_date,
  reading_time,
  likes,
  featured,
  status
FROM (
  VALUES 
  (
    'Getting Started with React 18: New Features and Performance Improvements',
    'getting-started-react-18-new-features',
    'Explore the exciting new features in React 18 including concurrent rendering, automatic batching, and Suspense improvements.',
    '<h2>Introduction to React 18</h2>
<p>React 18 brings significant improvements to the React ecosystem with new features focused on performance and developer experience. In this comprehensive guide, we''ll explore the most important updates and how they can benefit your applications.</p>

<h3>Concurrent Rendering</h3>
<p>One of the biggest changes in React 18 is the introduction of concurrent rendering. This allows React to prepare multiple versions of the UI at the same time, making your apps more responsive.</p>

<pre><code>import { createRoot } from ''react-dom/client'';

const container = document.getElementById(''root'');
const root = createRoot(container);
root.render(&lt;App /&gt;);</code></pre>

<h3>Automatic Batching</h3>
<p>React 18 automatically batches multiple state updates into a single re-render for better performance, even inside promises, timeouts, and native event handlers.</p>

<h3>Suspense Improvements</h3>
<p>Suspense now works on the server and has better support for data fetching libraries. This makes it easier to create loading states and handle asynchronous operations.</p>

<h2>Migration Guide</h2>
<p>Upgrading to React 18 is straightforward for most applications. Start by updating your dependencies and switching to the new createRoot API.</p>',
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    (SELECT id FROM author_ids WHERE name = 'Alex Johnson'),
    (SELECT id FROM category_ids WHERE name = 'Web Development'),
    NOW() - INTERVAL '2 days',
    8,
    45,
    true,
    'published'
  ),
  (
    'Modern CSS Grid Layouts: A Complete Guide',
    'modern-css-grid-layouts-complete-guide',
    'Master CSS Grid with practical examples and learn how to create responsive layouts without frameworks.',
    '<h2>Why CSS Grid?</h2>
<p>CSS Grid is a powerful layout system that allows you to create complex, responsive layouts with ease. Unlike Flexbox, which is one-dimensional, Grid is two-dimensional, giving you control over both rows and columns.</p>

<h3>Basic Grid Setup</h3>
<pre><code>.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
}</code></pre>

<h3>Grid Areas</h3>
<p>One of the most powerful features of CSS Grid is the ability to define named grid areas:</p>

<pre><code>.layout {
  display: grid;
  grid-template-areas: 
    "header header header"
    "sidebar main main"
    "footer footer footer";
}</code></pre>

<h3>Responsive Design</h3>
<p>CSS Grid makes responsive design intuitive with features like auto-fit and minmax():</p>

<pre><code>.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}</code></pre>',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
    (SELECT id FROM author_ids WHERE name = 'Sarah Chen'),
    (SELECT id FROM category_ids WHERE name = 'Design'),
    NOW() - INTERVAL '5 days',
    12,
    67,
    true,
    'published'
  ),
  (
    'Docker Best Practices for Node.js Applications',
    'docker-best-practices-nodejs-applications',
    'Learn how to containerize your Node.js applications efficiently with Docker best practices and optimization techniques.',
    '<h2>Containerizing Node.js Apps</h2>
<p>Docker has revolutionized how we deploy and manage applications. For Node.js developers, understanding Docker best practices is crucial for creating efficient, secure, and maintainable containers.</p>

<h3>Multi-stage Builds</h3>
<p>Use multi-stage builds to reduce image size and improve security:</p>

<pre><code># Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "start"]</code></pre>

<h3>Security Considerations</h3>
<ul>
<li>Use non-root users</li>
<li>Keep base images updated</li>
<li>Scan for vulnerabilities</li>
<li>Use .dockerignore files</li>
</ul>

<h3>Performance Optimization</h3>
<p>Optimize your Docker images for faster builds and smaller sizes by leveraging layer caching and minimizing the number of layers.</p>',
    'https://images.unsplash.com/photo-1605745341112-85968b19335a?w=800&h=400&fit=crop',
    (SELECT id FROM author_ids WHERE name = 'Marcus Rodriguez'),
    (SELECT id FROM category_ids WHERE name = 'DevOps'),
    NOW() - INTERVAL '1 day',
    10,
    32,
    false,
    'published'
  ),
  (
    'Introduction to Machine Learning with Python',
    'introduction-machine-learning-python',
    'A beginner-friendly guide to machine learning concepts and practical implementation using Python and scikit-learn.',
    '<h2>What is Machine Learning?</h2>
<p>Machine Learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every scenario.</p>

<h3>Types of Machine Learning</h3>
<ul>
<li><strong>Supervised Learning:</strong> Learning with labeled data</li>
<li><strong>Unsupervised Learning:</strong> Finding patterns in unlabeled data</li>
<li><strong>Reinforcement Learning:</strong> Learning through interaction and feedback</li>
</ul>

<h3>Getting Started with Scikit-learn</h3>
<pre><code>import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

# Load and prepare data
data = pd.read_csv(''dataset.csv'')
X = data[[''feature1'', ''feature2'']]
y = data[''target'']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train the model
model = LinearRegression()
model.fit(X_train, y_train)

# Make predictions
predictions = model.predict(X_test)</code></pre>

<h3>Next Steps</h3>
<p>Once you understand the basics, explore more advanced topics like deep learning, neural networks, and specialized libraries like TensorFlow and PyTorch.</p>',
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop',
    (SELECT id FROM author_ids WHERE name = 'Emily Watson'),
    (SELECT id FROM category_ids WHERE name = 'AI & Machine Learning'),
    NOW() - INTERVAL '3 days',
    15,
    89,
    true,
    'published'
  ),
  (
    'Building Cross-Platform Mobile Apps with React Native',
    'building-cross-platform-mobile-apps-react-native',
    'Learn how to develop mobile applications for both iOS and Android using React Native and modern development practices.',
    '<h2>Why React Native?</h2>
<p>React Native allows developers to build mobile applications using React and JavaScript, sharing code between iOS and Android platforms while maintaining native performance.</p>

<h3>Setting Up Your Development Environment</h3>
<p>Getting started with React Native requires setting up your development environment:</p>

<pre><code># Install React Native CLI
npm install -g @react-native-community/cli

# Create a new project
npx react-native init MyAwesomeApp

# Run on iOS
npx react-native run-ios

# Run on Android
npx react-native run-android</code></pre>

<h3>Navigation with React Navigation</h3>
<p>React Navigation is the standard navigation library for React Native:</p>

<pre><code>import { NavigationContainer } from ''@react-navigation/native'';
import { createStackNavigator } from ''@react-navigation/stack'';

const Stack = createStackNavigator();

function App() {
  return (
    &lt;NavigationContainer&gt;
      &lt;Stack.Navigator&gt;
        &lt;Stack.Screen name="Home" component={HomeScreen} /&gt;
        &lt;Stack.Screen name="Details" component={DetailsScreen} /&gt;
      &lt;/Stack.Navigator&gt;
    &lt;/NavigationContainer&gt;
  );
}</code></pre>

<h3>Performance Optimization</h3>
<ul>
<li>Use FlatList for large lists</li>
<li>Optimize images with proper sizing</li>
<li>Implement lazy loading</li>
<li>Use native modules when needed</li>
</ul>',
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop',
    (SELECT id FROM author_ids WHERE name = 'David Kim'),
    (SELECT id FROM category_ids WHERE name = 'Mobile Development'),
    NOW() - INTERVAL '4 days',
    11,
    56,
    false,
    'published'
  ),
  (
    'TypeScript Best Practices for Large-Scale Applications',
    'typescript-best-practices-large-scale-applications',
    'Discover essential TypeScript patterns and practices for building maintainable, scalable applications.',
    '<h2>Why TypeScript for Large Applications?</h2>
<p>TypeScript provides static type checking, better IDE support, and improved code maintainability, making it ideal for large-scale applications.</p>

<h3>Strict Configuration</h3>
<p>Always use strict TypeScript configuration for better type safety:</p>

<pre><code>{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}</code></pre>

<h3>Interface vs Type Aliases</h3>
<p>Use interfaces for object shapes that might be extended, and type aliases for unions and computed types:</p>

<pre><code>// Interface for extensible object shapes
interface User {
  id: string;
  name: string;
  email: string;
}

// Type alias for unions
type Status = ''loading'' | ''success'' | ''error'';

// Type alias for computed types
type UserKeys = keyof User;</code></pre>

<h3>Generic Constraints</h3>
<p>Use generic constraints to create reusable, type-safe functions:</p>

<pre><code>function getProperty&lt;T, K extends keyof T&gt;(obj: T, key: K): T[K] {
  return obj[key];
}</code></pre>',
    'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
    (SELECT id FROM author_ids WHERE name = 'Alex Johnson'),
    (SELECT id FROM category_ids WHERE name = 'Web Development'),
    NOW() - INTERVAL '6 days',
    9,
    41,
    false,
    'published'
  )
) AS posts_data(title, slug, excerpt, content, image_url, author_id, category_id, published_date, reading_time, likes, featured, status);

-- Insert Post Tags relationships
WITH post_tag_data AS (
  SELECT 
    p.id as post_id,
    t.id as tag_id
  FROM posts p
  CROSS JOIN tags t
  WHERE 
    (p.slug = 'getting-started-react-18-new-features' AND t.name IN ('React', 'JavaScript', 'TypeScript')) OR
    (p.slug = 'modern-css-grid-layouts-complete-guide' AND t.name IN ('CSS', 'HTML', 'Design Systems')) OR
    (p.slug = 'docker-best-practices-nodejs-applications' AND t.name IN ('Docker', 'Node.js', 'DevOps', 'CI/CD')) OR
    (p.slug = 'introduction-machine-learning-python' AND t.name IN ('Python', 'Machine Learning', 'AI', 'Data Science')) OR
    (p.slug = 'building-cross-platform-mobile-apps-react-native' AND t.name IN ('React Native', 'Mobile', 'JavaScript', 'React')) OR
    (p.slug = 'typescript-best-practices-large-scale-applications' AND t.name IN ('TypeScript', 'JavaScript', 'API'))
)
INSERT INTO post_tags (post_id, tag_id)
SELECT post_id, tag_id FROM post_tag_data;

-- Insert Comments
WITH post_ids AS (
  SELECT id, title FROM posts
)
INSERT INTO comments (post_id, author_name, author_avatar_url, text, status, timestamp) 
SELECT 
  post_id,
  author_name,
  author_avatar_url,
  text,
  status,
  timestamp
FROM (
  VALUES 
  (
    (SELECT id FROM post_ids WHERE title = 'Getting Started with React 18: New Features and Performance Improvements'),
    'John Developer',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50&h=50&fit=crop&crop=face',
    'Great article! The concurrent rendering explanation was really helpful.',
    'approved',
    NOW() - INTERVAL '1 day'
  ),
  (
    (SELECT id FROM post_ids WHERE title = 'Modern CSS Grid Layouts: A Complete Guide'),
    'Jane Designer',
    'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face',
    'Finally, a comprehensive guide to CSS Grid! The examples are perfect.',
    'approved',
    NOW() - INTERVAL '2 days'
  ),
  (
    (SELECT id FROM post_ids WHERE title = 'Docker Best Practices for Node.js Applications'),
    'Mike DevOps',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
    'Multi-stage builds are a game changer. Thanks for the detailed explanation!',
    'approved',
    NOW() - INTERVAL '12 hours'
  )
) AS comments_data(post_id, author_name, author_avatar_url, text, status, timestamp);

-- Insert Subscribers
INSERT INTO subscribers (email, subscribed_at) VALUES 
('subscriber1@example.com', NOW() - INTERVAL '30 days'),
('subscriber2@example.com', NOW() - INTERVAL '15 days'),
('subscriber3@example.com', NOW() - INTERVAL '7 days'),
('subscriber4@example.com', NOW() - INTERVAL '3 days'),
('subscriber5@example.com', NOW() - INTERVAL '1 day');
