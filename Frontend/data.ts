import { Author, Category, Tag, Post, Page, Snippet, Comment } from './types';

// Mock Authors
export const authors: Author[] = [
  { id: '1', name: 'Elena Voyage', avatarUrl: 'https://picsum.photos/id/1011/100/100', bio: 'Travel enthusiast and storyteller, sharing tales from around the globe.', followers: 12500 },
  { id: '2', name: 'Marcus Tech', avatarUrl: 'https://picsum.photos/id/1005/100/100', bio: 'Software engineer and futurist, exploring the intersection of technology and society.', followers: 25200 },
  { id: '3', name: 'Chloe Cuisine', avatarUrl: 'https://picsum.photos/id/1027/100/100', bio: 'Passionate chef and food blogger, creating delicious and approachable recipes.', followers: 8900 },
  { id: '4', name: 'Liam Wellness', avatarUrl: 'https://picsum.photos/id/1012/100/100', bio: 'Advocate for mental clarity and physical health, guiding others toward a balanced life.', followers: 15100 },
  { id: '5', name: 'Sophia Finance', avatarUrl: 'https://picsum.photos/id/1025/100/100', bio: 'Financial advisor demystifying money management for the modern generation.', followers: 18000 },
  { id: '6', name: 'David Creative', avatarUrl: 'https://picsum.photos/id/103/100/100', bio: 'Writer and artist dedicated to helping others unlock their creative potential.', followers: 7600 },
];

// Mock Categories
export const categories: Category[] = [
  { id: '1', name: 'Travel', description: 'Explore breathtaking destinations and hidden gems from around the world.', imageUrl: 'https://picsum.photos/id/1018/1200/400' },
  { id: '2', name: 'Technology', description: 'Stay ahead of the curve with the latest in tech, from AI to web development.', imageUrl: 'https://picsum.photos/id/1/1200/400' },
  { id: '3', name: 'Food', description: 'Discover delicious recipes, cooking tips, and culinary adventures.', imageUrl: 'https://picsum.photos/id/1080/1200/400' },
  { id: '4', name: 'Productivity', description: 'Boost your efficiency with proven techniques and smart habits.', imageUrl: 'https://picsum.photos/id/1079/1200/400' },
  { id: '5', name: 'Lifestyle', description: 'Insights and inspiration for living a more fulfilling and balanced life.', imageUrl: 'https://picsum.photos/id/1040/1200/400' },
  { id: '6', name: 'Finance', description: 'Master your money with practical advice on budgeting, investing, and financial planning.', imageUrl: 'https://picsum.photos/id/1078/1200/400' },
  { id: '7', name: 'Wellness', description: 'Nourish your mind, body, and soul with tips on health, fitness, and mindfulness.', imageUrl: 'https://picsum.photos/id/1068/1200/400' },
  { id: '8', name: 'Creativity', description: 'Unlock your imagination and learn new skills in writing, art, and design.', imageUrl: 'https://picsum.photos/id/1050/1200/400' },
];

// Mock Tags
export const tags: Tag[] = [
  { id: '1', name: 'Europe' },
  { id: '2', name: 'Asia' },
  { id: '3', name: 'AI' },
  { id: '4', name: 'Web Dev' },
  { id: '5', name: 'Baking' },
  { id: '6', name: 'Healthy' },
  { id: '7', name: 'Habits' },
  { id: '8', name: 'Solo Travel' },
  { id: '9', name: 'JavaScript' },
  { id: '10', name: 'Investing' },
  { id: '11', name: 'Budgeting' },
  { id: '12', name: 'Mindfulness' },
  { id: '13', name: 'Fitness' },
  { id: '14', name: 'Writing' },
  { id: '15', name: 'Blockchain' },
  { id: '16', name: 'Remote Work' },
  { id: '17', name: 'Coffee' },
  { id: '18', name: 'Japan' },
  { id: '19', name: 'Canada' },
  { id: '20', name: 'Mental Health' },
];

// Mock Comments
export const comments: Comment[] = [
    { id: 'c1', postId: '1', authorName: 'David', authorAvatarUrl: 'https://picsum.photos/id/237/50/50', text: 'This is an amazing guide! I\'m planning my trip now.', timestamp: '2 days ago', status: 'approved' },
    { id: 'c2', postId: '1', authorName: 'Sophia', authorAvatarUrl: 'https://picsum.photos/id/238/50/50', text: 'The Path of the Gods was the highlight of my Italy trip. Thanks for bringing back memories!', timestamp: '1 day ago', status: 'approved' },
    { id: 'c3', postId: '1', authorName: 'GuestUser', authorAvatarUrl: 'https://picsum.photos/id/42/50/50', text: 'This looks interesting, but is it safe for beginners?', timestamp: '3 hours ago', status: 'pending' },
    { id: 'c4', postId: '2', authorName: 'Mark', authorAvatarUrl: 'https://picsum.photos/id/111/50/50', text: 'Great article on AI! Very insightful.', timestamp: '5 days ago', status: 'approved' },
    { id: 'c5', postId: '4', authorName: 'ProductivityPro', authorAvatarUrl: 'https://picsum.photos/id/99/50/50', text: 'The Pomodoro Technique changed my life!', timestamp: '1 week ago', status: 'approved' },
    { id: 'c6', postId: '4', authorName: 'SpamBot', authorAvatarUrl: 'https://picsum.photos/id/123/50/50', text: 'BUY CHEAP FOLLOWERS NOW!!! www.example.com', timestamp: '2 days ago', status: 'spam' },
    { id: 'c7', postId: '5', authorName: 'Anna', authorAvatarUrl: 'https://picsum.photos/id/301/50/50', text: 'This solo travel guide is exactly what I needed to finally book my trip. Thank you!', timestamp: '1 day ago', status: 'approved' },
    { id: 'c8', postId: '6', authorName: 'CodeWizard', authorAvatarUrl: 'https://picsum.photos/id/302/50/50', text: 'Excellent explanation of blockchain. You made a complex topic very approachable.', timestamp: '4 days ago', status: 'approved' },
    { id: 'c9', postId: '7', authorName: 'FitLife', authorAvatarUrl: 'https://picsum.photos/id/303/50/50', text: 'Sleep hygiene is so underrated. Great tips!', timestamp: '6 hours ago', status: 'pending' },
    { id: 'c10', postId: '15', authorName: 'Bookworm', authorAvatarUrl: 'https://picsum.photos/id/304/50/50', text: 'Overcoming creative block is my biggest struggle. These tips are gold.', timestamp: '2 days ago', status: 'approved' },
    { id: 'c11', postId: '18', authorName: 'InvestorJane', authorAvatarUrl: 'https://picsum.photos/id/305/50/50', text: 'Finally, an investing guide that doesn\'t feel intimidating. Great for beginners!', timestamp: '3 days ago', status: 'approved' },
];


// Mock Posts
export const posts: Post[] = [
  {
    id: '1',
    title: 'Unveiling the Hidden Gems of the Amalfi Coast',
    slug: 'unveiling-hidden-gems-amalfi-coast',
    excerpt: 'Beyond the popular towns of Positano and Amalfi, a world of secluded beaches, charming villages, and breathtaking hikes awaits.',
    content: `
      <p class="mb-4">The Amalfi Coast is a dream for many travelers, but its true magic lies beyond the postcard-perfect, crowded towns. In this guide, we'll venture off the beaten path to uncover the secrets that make this slice of Italian paradise so special.</p>
      <h2 class="text-2xl font-bold font-serif my-6">1. The Path of the Gods (Sentiero degli Dei)</h2>
      <p class="mb-4">This legendary hiking trail offers unparalleled panoramic views of the coastline. Starting in Bomerano and ending in Nocelle, this 4-hour hike is moderately challenging but rewards you with vistas that will leave you speechless. Remember to wear sturdy shoes and bring plenty of water!</p>
      <img src="https://picsum.photos/id/1015/800/400" alt="Amalfi Coast Hike" class="rounded-lg my-6 shadow-lg">
      <h2 class="text-2xl font-bold font-serif my-6">2. Furore's Fiord</h2>
      <p class="mb-4">Tucked away in a deep gorge is the Fiordo di Furore, a tiny, picturesque beach where a small fishing village once thrived. It’s a stunningly unique spot, with an old stone bridge arching over the turquoise water. It's a perfect place for a quiet afternoon swim away from the crowds.</p>
      <h2 class="text-2xl font-bold font-serif my-6">3. Ravello's Serene Gardens</h2>
      <p>While Ravello is well-known, its gardens at Villa Cimbrone and Villa Rufolo offer a peaceful escape. The Terrace of Infinity at Villa Cimbrone, lined with marble busts, provides what might be the most beautiful view in the world. It’s a place for quiet contemplation and awe.</p>
    `,
    imageUrl: 'https://picsum.photos/id/10/600/400',
    author: authors[0],
    category: categories[0],
    tags: [tags[0]],
    publishedDate: '2024-07-15',
    readingTime: 8,
    likes: 241,
    featured: true,
    status: 'published',
  },
  {
    id: '2',
    title: 'The Rise of AI: How It\'s Shaping Modern Web Development',
    slug: 'rise-of-ai-shaping-web-development',
    excerpt: 'Artificial intelligence is no longer a futuristic concept; it\'s a powerful tool that is revolutionizing how we design, build, and deploy web applications.',
    content: `
      <p class="mb-4">From intelligent code completion to automated testing and personalized user experiences, AI is fundamentally changing the landscape of web development. Let's explore some of the key areas where AI is making a significant impact.</p>
      <h2 class="text-2xl font-bold font-serif my-6">1. AI-Powered Coding Assistants</h2>
      <p class="mb-4">Tools like GitHub Copilot and Tabnine are transforming the developer workflow. By leveraging machine learning models trained on vast amounts of code, these assistants can suggest entire functions, boilerplate code, and even help debug complex problems, significantly boosting productivity.</p>
      <blockquote class="border-l-4 border-primary-500 italic my-6 pl-4 text-slate-600 dark:text-slate-400">"The best AI assistants don't replace developers; they augment their abilities, allowing them to focus on creative problem-solving rather than rote coding."</blockquote>
      <h2 class="text-2xl font-bold font-serif my-6">2. Automated Testing and QA</h2>
      <p class="mb-4">AI can automate the tedious process of quality assurance. Intelligent testing tools can automatically generate test cases, identify visual regressions, and even predict potential bugs before they make it to production. This leads to more robust and reliable applications.</p>
      <h2 class="text-2xl font-bold font-serif my-6">3. Personalized User Experiences</h2>
      <p>By analyzing user behavior, an AI algorithms can tailor content, recommendations, and UI elements in real-time. This level of personalization, seen on platforms like Netflix and Amazon, is now becoming accessible for all web applications, leading to higher engagement and conversion rates.</p>
    `,
    imageUrl: 'https://picsum.photos/id/2/600/400',
    author: authors[1],
    category: categories[1],
    tags: [tags[2], tags[3]],
    publishedDate: '2024-07-12',
    readingTime: 10,
    likes: 589,
    featured: true,
    status: 'published',
  },
  {
    id: '3',
    title: 'Mastering the Art of Sourdough: A Beginner\'s Guide',
    slug: 'mastering-art-of-sourdough',
    excerpt: 'Baking the perfect loaf of sourdough bread is a rewarding journey of patience and science. This guide will walk you through the essential steps to get started.',
    content: `
      <p class="mb-4">Sourdough baking can seem intimidating, but at its core, it's a simple process that connects us to an ancient tradition. All you need is flour, water, salt, and a little bit of patience. Let's break it down.</p>
      <h2 class="text-2xl font-bold font-serif my-6">1. Creating Your Starter</h2>
      <p class="mb-4">The heart of any sourdough bread is the starter - a living culture of wild yeast and bacteria. We'll show you how to create one from scratch using just flour and water. It takes about a week, but the tangy flavor it develops is worth the wait.</p>
      <img src="https://picsum.photos/id/30/800/400" alt="Sourdough Starter" class="rounded-lg my-6 shadow-lg">
      <h2 class="text-2xl font-bold font-serif my-6">2. The Bulk Fermentation</h2>
      <p class="mb-4">This is where the magic happens. After mixing your dough, you'll let it ferment for several hours, performing a series of "stretch and folds" to build strength in the gluten. This step develops the flavor and structure of your loaf.</p>
      <h2 class="text-2xl font-bold font-serif my-6">3. Shaping and Baking</h2>
      <p>Finally, you'll shape your dough and let it have a final rest (proof) before baking it in a hot Dutch oven. The steam trapped inside the pot creates that beautiful, crispy crust and soft, airy interior that every baker dreams of.</p>
    `,
    imageUrl: 'https://picsum.photos/id/3/600/400',
    author: authors[2],
    category: categories[2],
    tags: [tags[4], tags[5]],
    publishedDate: '2024-07-10',
    readingTime: 12,
    likes: 312,
    status: 'published',
  },
  {
    id: '4',
    title: 'The Pomodoro Technique: Boost Your Productivity',
    slug: 'pomodoro-technique-boost-productivity',
    excerpt: 'Discover a simple yet effective time management method that can help you power through distractions, hyper-focus, and get things done in short bursts.',
    content: `
      <p class="mb-4">The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. It uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks. Each interval is known as a pomodoro, from the Italian word for 'tomato', after the tomato-shaped kitchen timer that Cirillo used as a university student.</p>
      <h2 class="text-2xl font-bold font-serif my-6">How it works:</h2>
      <ol class="list-decimal list-inside space-y-2 mb-4">
          <li>Choose a task to be accomplished.</li>
          <li>Set the Pomodoro timer to 25 minutes.</li>
          <li>Work on the task until the timer rings.</li>
          <li>Take a short break (5 minutes).</li>
          <li>After four Pomodoros, take a longer break (15-30 minutes).</li>
      </ol>
      <p>This technique is effective because it helps you resist all of those self-interruptions and re-train your brains to focus. Each pomodoro is an indivisible unit of work, and the short breaks help maintain focus and prevent burnout.</p>
    `,
    imageUrl: 'https://picsum.photos/id/4/600/400',
    author: authors[1],
    category: categories[3],
    tags: [tags[6]],
    publishedDate: '2024-07-08',
    readingTime: 5,
    likes: 450,
    status: 'published',
  },
  {
    id: '5',
    title: 'A Guide to Solo Travel in Southeast Asia',
    slug: 'guide-to-solo-travel-southeast-asia',
    excerpt: 'Embark on the adventure of a lifetime. Our comprehensive guide to solo travel in Southeast Asia covers everything from budgeting to safety.',
    content: `
      <p>Traveling solo in Southeast Asia is an incredibly rewarding experience. The region is known for its friendly locals, delicious food, and affordable prices. This guide will help you plan your journey.</p>
      <h3>Destinations</h3>
      <p>From the temples of Angkor Wat in Cambodia to the beaches of Thailand, there's something for everyone. Don't miss the vibrant street life of Hanoi, Vietnam, or the serene landscapes of Laos.</p>
      <h3>Budgeting</h3>
      <p>You can travel comfortably on a budget of $30-50 per day in most countries. This includes accommodation, food, transport, and activities.</p>
    `,
    imageUrl: 'https://picsum.photos/id/101/600/400',
    author: authors[0],
    category: categories[0],
    tags: [tags[1], { id: '8', name: 'Solo Travel' }],
    publishedDate: '2024-07-20',
    readingTime: 15,
    likes: 620,
    featured: false,
    status: 'published',
  },
  {
    id: '6',
    title: 'Demystifying Blockchain: Beyond Cryptocurrency',
    slug: 'demystifying-blockchain-beyond-cryptocurrency',
    excerpt: 'Blockchain technology is poised to revolutionize more than just finance. Learn about its potential applications in supply chain, healthcare, and voting systems.',
    content: `
      <p>When people hear "blockchain," they usually think of Bitcoin. But the underlying technology has far-reaching implications.</p>
      <h2>What is a Blockchain?</h2>
      <p>At its core, a blockchain is a distributed, immutable ledger. This means that transactions are recorded across many computers, and once a record is added, it cannot be altered. This creates an unprecedented level of trust and transparency.</p>
    `,
    imageUrl: 'https://picsum.photos/id/103/600/400',
    author: authors[1],
    category: categories[1],
    tags: [{ id: '15', name: 'Blockchain' }, tags[2]],
    publishedDate: '2024-07-18',
    readingTime: 12,
    likes: 480,
    status: 'published',
  },
  {
    id: '7',
    title: 'The Importance of Sleep for Mental and Physical Health',
    slug: 'importance-of-sleep-for-health',
    excerpt: 'Quality sleep is not a luxury; it\'s a biological necessity. Discover how prioritizing sleep can transform your overall well-being.',
    content: `
      <p>In our fast-paced world, sleep is often the first thing we sacrifice. However, skimping on sleep can have serious consequences for both your mental and physical health.</p>
      <h3>Better Cognitive Function</h3>
      <p>Sleep plays a critical role in memory consolidation, learning, and problem-solving. A good night's rest can leave you feeling sharp and focused.</p>
    `,
    imageUrl: 'https://picsum.photos/id/104/600/400',
    author: authors[3],
    category: categories[6],
    tags: [{ id: '20', name: 'Mental Health' }, tags[5]],
    publishedDate: '2024-07-16',
    readingTime: 9,
    likes: 550,
    status: 'published',
  },
  {
    id: '8',
    title: 'The Science of the Perfect Pizza Dough',
    slug: 'science-of-perfect-pizza-dough',
    excerpt: 'Unlock the secrets to chewy, crispy, and flavorful pizza crust at home. It\'s all about understanding the science of fermentation and hydration.',
    content: `
      <p>Making great pizza at home starts with the foundation: the dough. It might seem simple—flour, water, yeast, salt—but the magic is in the technique.</p>
      <h2>Hydration is Key</h2>
      <p>The ratio of water to flour, or hydration, determines the texture of your crust. Higher hydration doughs are stickier and harder to work with, but they produce a light, airy crust with large holes.</p>
    `,
    imageUrl: 'https://picsum.photos/id/106/600/400',
    author: authors[2],
    category: categories[2],
    tags: [tags[4], { id: '17', name: 'Cooking' }],
    publishedDate: '2024-07-14',
    readingTime: 10,
    likes: 380,
    status: 'published',
  },
  {
    id: '9',
    title: 'Minimalism for Beginners: A Practical Guide',
    slug: 'minimalism-for-beginners-practical-guide',
    excerpt: 'Living with less can lead to more happiness, freedom, and intention. Here’s how to start your journey into minimalism without feeling overwhelmed.',
    content: `
      <p>Minimalism isn't about owning nothing; it's about making room for what matters. By intentionally removing the clutter from our lives, we can focus on what truly brings us joy and value.</p>
      <h3>The 90/90 Rule</h3>
      <p>Look at a possession. Have you used it in the last 90 days? Will you use it in the next 90? If not, it's a candidate for decluttering.</p>
    `,
    imageUrl: 'https://picsum.photos/id/108/600/400',
    author: authors[3],
    category: categories[4],
    tags: [tags[6]],
    publishedDate: '2024-07-11',
    readingTime: 7,
    likes: 410,
    status: 'published',
  },
  {
    id: '10',
    title: 'Investing 101: A Beginner\'s Guide to the Stock Market',
    slug: 'investing-101-beginners-guide',
    excerpt: 'The stock market doesn\'t have to be intimidating. Learn the basics of investing, from understanding stocks to building a diversified portfolio.',
    content: `
      <p>Investing is one of the most effective ways to build long-term wealth. This guide will cover the fundamental concepts you need to know to get started.</p>
      <h2>What Are Stocks?</h2>
      <p>A stock represents a share of ownership in a public company. When you buy a stock, you're buying a small piece of that company.</p>
    `,
    imageUrl: 'https://picsum.photos/id/110/600/400',
    author: authors[4],
    category: categories[5],
    tags: [{ id: '10', name: 'Investing' }, { id: '11', name: 'Budgeting' }],
    publishedDate: '2024-07-09',
    readingTime: 11,
    likes: 710,
    featured: true,
    status: 'published',
  },
  {
    id: '11',
    title: 'A Weekend Itinerary for Kyoto, Japan',
    slug: 'weekend-itinerary-kyoto-japan',
    excerpt: 'Experience the magic of Japan\'s ancient capital. This packed 48-hour itinerary covers serene temples, vibrant markets, and enchanting bamboo forests.',
    content: `
      <p>Kyoto is a city that seamlessly blends ancient tradition with modern life. With so much to see, a well-planned itinerary is essential.</p>
      <h3>Day 1: Arashiyama and Kinkaku-ji</h3>
      <p>Start your day early at the Arashiyama Bamboo Grove to avoid the crowds. In the afternoon, visit the stunning golden pavilion of Kinkaku-ji.</p>
    `,
    imageUrl: 'https://picsum.photos/id/111/600/400',
    author: authors[0],
    category: categories[0],
    tags: [tags[1], { id: '18', name: 'Japan' }],
    publishedDate: '2024-07-07',
    readingTime: 8,
    likes: 580,
    status: 'published',
  },
  {
    id: '12',
    title: 'Building a "Second Brain": A Guide to Digital Note-Taking',
    slug: 'building-a-second-brain-digital-note-taking',
    excerpt: 'Stop forgetting great ideas. Learn how to build a digital system to capture, organize, and connect your thoughts for maximum creativity and productivity.',
    content: `
      <p>A "Second Brain" is a digital system for knowledge management. It helps you offload information from your biological brain, freeing up mental space for deeper thinking.</p>
      <h2>The CODE Method</h2>
      <p>Capture, Organize, Distill, and Express. This framework helps you process information effectively and turn it into creative output.</p>
    `,
    imageUrl: 'https://picsum.photos/id/112/600/400',
    author: authors[1],
    category: categories[3],
    tags: [tags[6]],
    publishedDate: '2024-07-05',
    readingTime: 9,
    likes: 650,
    status: 'published',
  },
  {
    id: '13',
    title: 'The Future of Remote Work: Tools and Trends',
    slug: 'future-of-remote-work-tools-and-trends',
    excerpt: 'Remote work is here to stay. We explore the cutting-edge tools and cultural shifts that are shaping the future of distributed teams.',
    content: `
      <p>The shift to remote work has accelerated innovation in collaboration technology. From virtual reality meeting rooms to AI-powered project management, the way we work is evolving rapidly.</p>
      <h3>Asynchronous Communication</h3>
      <p>The most effective remote teams master asynchronous communication, reducing the need for constant meetings and allowing for deep, focused work.</p>
    `,
    imageUrl: 'https://picsum.photos/id/113/600/400',
    author: authors[1],
    category: categories[1],
    tags: [{ id: '16', name: 'Remote Work' }, tags[6]],
    publishedDate: '2024-07-03',
    readingTime: 7,
    likes: 490,
    status: 'published',
  },
  {
    id: '14',
    title: 'Mindful Movement: Finding Joy in Exercise',
    slug: 'mindful-movement-finding-joy-in-exercise',
    excerpt: 'Tired of grueling workouts? Discover how the practice of mindful movement can transform your relationship with exercise and your body.',
    content: `
      <p>Mindful movement is about paying attention to your body and its sensations as you move, without judgment. It shifts the focus from performance to experience.</p>
      <h2>Benefits of Mindful Movement</h2>
      <p>It can reduce stress, improve body awareness, and increase enjoyment of physical activity, making you more likely to stick with it long-term.</p>
    `,
    imageUrl: 'https://picsum.photos/id/114/600/400',
    author: authors[3],
    category: categories[6],
    tags: [{ id: '13', name: 'Fitness' }, { id: '12', name: 'Mindfulness' }],
    publishedDate: '2024-07-01',
    readingTime: 6,
    likes: 510,
    status: 'published',
  },
  {
    id: '15',
    title: 'Overcoming Creative Blocks: Techniques for Artists and Writers',
    slug: 'overcoming-creative-blocks',
    excerpt: 'Feeling stuck? Don\'t let creative blocks derail your projects. Here are proven strategies to reignite your inspiration and get back to creating.',
    content: `
      <p>Every creative person faces blocks. The key is not to avoid them, but to have a toolbox of techniques to work through them.</p>
      <h3>Try a New Medium</h3>
      <p>If you're a writer, try painting. If you're a painter, try writing a poem. Switching mediums can unlock new neural pathways and spark fresh ideas.</p>
    `,
    imageUrl: 'https://picsum.photos/id/115/600/400',
    author: authors[5],
    category: categories[7],
    tags: [{ id: '14', name: 'Writing' }],
    publishedDate: '2024-06-29',
    readingTime: 8,
    likes: 470,
    status: 'published',
  },
  {
    id: '16',
    title: 'From Bean to Cup: A Guide to Home Coffee Brewing',
    slug: 'home-coffee-brewing-guide',
    excerpt: 'Elevate your morning routine by mastering the art of coffee brewing. We cover everything from choosing beans to perfecting your pour-over technique.',
    content: `
      <p>A great cup of coffee is the perfect start to any day. And you don't need a fancy cafe to enjoy one.</p>
      <h2>Grind Size Matters</h2>
      <p>The size of your coffee grounds is crucial. A coarse grind is best for French press, while a fine grind is needed for espresso. The right grind ensures proper extraction and a balanced flavor.</p>
    `,
    imageUrl: 'https://picsum.photos/id/116/600/400',
    author: authors[2],
    category: categories[2],
    tags: [{ id: '17', name: 'Coffee' }],
    publishedDate: '2024-06-27',
    readingTime: 9,
    likes: 420,
    status: 'published',
  },
  {
    id: '17',
    title: 'A Deep Dive into CSS Grid and Flexbox',
    slug: 'css-grid-and-flexbox-deep-dive',
    excerpt: 'Master modern CSS layouts. This comprehensive guide explains when to use Flexbox and when to use Grid for building responsive, complex web designs.',
    content: `
      <p>Flexbox and Grid have revolutionized CSS layout. Understanding their strengths and weaknesses is key to becoming a proficient front-end developer.</p>
      <h3>Flexbox for One Dimension</h3>
      <p>Flexbox is ideal for laying out items in a single dimension—either in a row or a column. Think navigation bars, button groups, and aligning items within a container.</p>
      <h3>Grid for Two Dimensions</h3>
      <p>Grid is designed for two-dimensional layouts, with rows and columns. It's perfect for overall page layouts, image galleries, and any design that requires precise control over both axes.</p>
    `,
    imageUrl: 'https://picsum.photos/id/117/600/400',
    author: authors[1],
    category: categories[1],
    tags: [tags[3], { id: '9', name: 'JavaScript' }],
    publishedDate: '2024-06-25',
    readingTime: 14,
    likes: 820,
    status: 'published',
  },
  {
    id: '18',
    title: 'How to Create a Budget You\'ll Actually Stick To',
    slug: 'how-to-create-a-budget',
    excerpt: 'Budgeting is the cornerstone of financial health. Forget restrictive spreadsheets—we\'ll show you flexible methods that work for real life.',
    content: `
      <p>Many people fail at budgeting because they make it too complicated or restrictive. The key is to find a system that aligns with your personality and goals.</p>
      <h2>The 50/30/20 Rule</h2>
      <p>A simple starting point: allocate 50% of your after-tax income to needs, 30% to wants, and 20% to savings and debt repayment.</p>
    `,
    imageUrl: 'https://picsum.photos/id/118/600/400',
    author: authors[4],
    category: categories[5],
    tags: [{ id: '11', name: 'Budgeting' }],
    publishedDate: '2024-06-23',
    readingTime: 7,
    likes: 680,
    status: 'published',
  },
  {
    id: '19',
    title: 'The Ultimate Road Trip Through the Canadian Rockies',
    slug: 'canadian-rockies-road-trip',
    excerpt: 'Azure lakes, towering peaks, and abundant wildlife await. Our week-long itinerary takes you through the stunning national parks of Banff and Jasper.',
    content: `
      <p>A road trip through the Canadian Rockies is an unforgettable experience. The Icefields Parkway, which connects Banff and Jasper, is one of the most scenic drives in the world.</p>
      <h3>Must-See Stops</h3>
      <p>Don't miss Lake Louise, Moraine Lake, Peyto Lake, and Maligne Canyon. Plan for short hikes at each stop to fully appreciate the scenery.</p>
    `,
    imageUrl: 'https://picsum.photos/id/119/600/400',
    author: authors[0],
    category: categories[0],
    tags: [{ id: '19', name: 'Canada' }],
    publishedDate: '2024-06-21',
    readingTime: 10,
    likes: 750,
    featured: true,
    status: 'published',
  },
  {
    id: '20',
    title: 'The Art of Deep Work in a Distracted World',
    slug: 'art-of-deep-work',
    excerpt: 'In a world of constant notifications, the ability to focus without distraction is a superpower. Learn how to cultivate deep work and produce high-value results.',
    content: `
      <p>Deep work is the ability to focus without distraction on a cognitively demanding task. It's a skill that allows you to quickly master complicated information and produce better results in less time.</p>
      <h2>Time Blocking</h2>
      <p>One of the most effective techniques for deep work is time blocking. Schedule specific, uninterrupted blocks in your calendar for your most important tasks.</p>
    `,
    imageUrl: 'https://picsum.photos/id/120/600/400',
    author: authors[1],
    category: categories[3],
    tags: [tags[6]],
    publishedDate: '2024-06-19',
    readingTime: 9,
    likes: 690,
    status: 'published',
  },
  {
    id: '21',
    title: 'Ethical AI: Navigating the Moral Landscape',
    slug: 'ethical-ai-moral-landscape',
    excerpt: 'As AI becomes more powerful, the ethical questions surrounding it become more urgent. We explore the key challenges of bias, privacy, and accountability.',
    content: `
      <p>The development of artificial intelligence presents enormous opportunities, but it also comes with significant ethical responsibilities. Ensuring that AI systems are fair, transparent, and accountable is one of the greatest challenges of our time.</p>
      <h3>The Problem of Bias</h3>
      <p>AI models trained on biased data can perpetuate and even amplify societal inequalities. Addressing this requires careful data curation and algorithmic fairness techniques.</p>
    `,
    imageUrl: 'https://picsum.photos/id/121/600/400',
    author: authors[1],
    category: categories[1],
    tags: [tags[2], { id: '20', name: 'Mental Health' }],
    publishedDate: '2024-06-17',
    readingTime: 11,
    likes: 530,
    status: 'published',
  },
  {
    id: '22',
    title: 'A Culinary Tour of Mediterranean Appetizers',
    slug: 'culinary-tour-mediterranean-appetizers',
    excerpt: 'From hummus to spanakopita, discover the vibrant and healthy world of Mediterranean mezze. Perfect for your next gathering!',
    content: `
      <p>The Mediterranean diet is renowned for its health benefits and delicious flavors. A great way to explore this cuisine is through its appetizers, or "mezze."</p>
      <h3>Hummus and Baba Ghanoush</h3>
      <p>These classic dips, made from chickpeas and eggplant respectively, are staples of any mezze platter. Serve with warm pita bread and fresh vegetables.</p>
    `,
    imageUrl: 'https://picsum.photos/id/122/600/400',
    author: authors[2],
    category: categories[2],
    tags: [tags[5], { id: '17', name: 'Cooking' }],
    publishedDate: '2024-06-15',
    readingTime: 7,
    likes: 450,
    status: 'published',
  },
  {
    id: '23',
    title: 'The Benefits of a Daily Meditation Practice',
    slug: 'benefits-of-daily-meditation',
    excerpt: 'Just 10 minutes of meditation a day can reduce stress, improve focus, and increase self-awareness. Here\'s how to get started with a simple mindfulness practice.',
    content: `
      <p>Meditation is a practice of training the mind to achieve a state of deep relaxation and focus. It's not about stopping your thoughts, but about observing them without judgment.</p>
      <h2>A Simple Breathing Exercise</h2>
      <p>Sit comfortably. Close your eyes. Focus on your breath, noticing the sensation of the air entering and leaving your body. When your mind wanders, gently guide your attention back to your breath.</p>
    `,
    imageUrl: 'https://picsum.photos/id/124/600/400',
    author: authors[3],
    category: categories[6],
    tags: [{ id: '12', name: 'Mindfulness' }, { id: '20', name: 'Mental Health' }],
    publishedDate: '2024-06-13',
    readingTime: 6,
    likes: 610,
    status: 'published',
  },
  {
    id: '24',
    title: 'Finding the Best Street Food in Mexico City',
    slug: 'best-street-food-mexico-city',
    excerpt: 'A journey through the culinary heart of Mexico. Forget the restaurants—the real flavor of Mexico City is found on its bustling streets.',
    content: `
      <p>Mexico City is a paradise for food lovers, and its street food scene is legendary. From tacos al pastor to tlayudas, there's a delicious discovery around every corner.</p>
      <h3>Tacos Al Pastor</h3>
      <p>This is the quintessential Mexico City street taco. Pork is marinated in a blend of chilies and spices, then cooked on a vertical rotisserie called a trompo. It's served on a small corn tortilla with pineapple, onions, and cilantro.</p>
    `,
    imageUrl: 'https://picsum.photos/id/125/600/400',
    author: authors[0],
    category: categories[0],
    tags: [tags[0], { id: '17', name: 'Cooking' }],
    publishedDate: '2024-06-11',
    readingTime: 9,
    likes: 780,
    status: 'published',
  },
];

export const pages: Page[] = [
    {
        id: '1',
        title: 'About Us',
        slug: 'about',
        isDeletable: false,
        content: `
            <section class="text-center py-16">
                <h1 class="text-5xl md:text-6xl font-bold font-serif text-slate-900 dark:text-white">Our Story</h1>
                <p class="mt-6 max-w-3xl mx-auto text-lg text-slate-600 dark:text-slate-300">
                OwnWrites was born from a simple idea: to create a beautiful, inspiring space for writers to share their stories and for readers to discover new perspectives. We believe in the power of words to connect, educate, and entertain.
                </p>
            </section>
            <section class="text-center">
                <h2 class="text-4xl font-bold font-serif text-slate-900 dark:text-white">Meet the Team</h2>
                <p class="mt-4 max-w-2xl mx-auto text-lg text-slate-500 dark:text-slate-400">
                    The creative minds behind the stories you love. Our talented authors are featured throughout the site on the articles they've written.
                </p>
            </section>
        `
    },
    {
        id: '2',
        title: 'Contact Us',
        slug: 'contact',
        isDeletable: false,
        content: `
            <div class="text-center mb-16">
                <h1 class="text-5xl md:text-6xl font-bold font-serif text-slate-900 dark:text-white">Contact Us</h1>
                <p class="mt-4 max-w-2xl mx-auto text-lg text-slate-500 dark:text-slate-400">
                Have a question or want to work with us? Drop us a line.
                </p>
            </div>
            <div class="bg-white dark:bg-slate-800 p-8 sm:p-12 rounded-2xl shadow-lg">
                <div class="space-y-8">
                    <h2 class="text-3xl font-bold font-serif">Get in Touch</h2>
                    <p class="text-slate-500 dark:text-slate-400">
                        We're here to help and answer any question you might have. We look forward to hearing from you. Please reach out via one of the methods below.
                    </p>
                    <div class="space-y-4">
                        <div class="flex items-start space-x-4">
                            <div class="flex-shrink-0 p-3 bg-primary-100 dark:bg-primary-900/50 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-primary-600 dark:text-primary-400"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold">Our Office</h3>
                                <p class="text-slate-500 dark:text-slate-400">123 OwnWrites Lane, Storyville, USA 12345</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-4">
                            <div class="flex-shrink-0 p-3 bg-primary-100 dark:bg-primary-900/50 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-primary-600 dark:text-primary-400"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold">Email Us</h3>
                                <p class="text-slate-500 dark:text-slate-400">hello@ownwrites.com</p>
                            </div>
                        </div>
                        <div class="flex items-start space-x-4">
                            <div class="flex-shrink-0 p-3 bg-primary-100 dark:bg-primary-900/50 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-primary-600 dark:text-primary-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold">Call Us</h3>
                                <p class="text-slate-500 dark:text-slate-400">(123) 456-7890</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    },
    {
        id: '3',
        title: 'Privacy Policy',
        slug: 'privacy',
        isDeletable: false,
        content: `
            <div class="text-center mb-12">
                <h1 class="text-4xl md:text-5xl font-bold font-serif text-slate-900 dark:text-white">Privacy Policy</h1>
                <p class="mt-4 text-lg text-slate-500 dark:text-slate-400">Last updated: July 1, 2024</p>
            </div>
            
            <div class="prose prose-lg dark:prose-invert max-w-none mx-auto text-slate-700 dark:text-slate-300 font-serif leading-relaxed">
                <p>Welcome to Inkwell. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.</p>
                
                <h2>1. Information We Collect</h2>
                <p>We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website or otherwise when you contact us.</p>
                <p>The personal information that we collect depends on the context of your interactions with us and the website, the choices you make and the products and features you use. The personal information we collect may include the following:</p>
                <ul>
                    <li>Name and Contact Data. We collect your first and last name, email address, postal address, phone number, and other similar contact data.</li>
                    <li>Credentials. We collect passwords, password hints, and similar security information used for authentication and account access.</li>
                    <li>Payment Data. We may collect data necessary to process your payment if you make purchases, such as your payment instrument number (such as a credit card number), and the security code associated with your payment instrument.</li>
                </ul>

                <h2>2. How We Use Your Information</h2>
                <p>We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
                
                <h2>3. Will Your Information Be Shared With Anyone?</h2>
                <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>
                
                <h2>4. Cookies and Other Tracking Technologies</h2>
                <p>We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy.</p>
            </div>
        `
    },
    {
        id: '4',
        title: 'Terms & Conditions',
        slug: 'terms',
        isDeletable: false,
        content: `
            <div class="text-center mb-12">
                <h1 class="text-4xl md:text-5xl font-bold font-serif text-slate-900 dark:text-white">Terms & Conditions</h1>
                <p class="mt-4 text-lg text-slate-500 dark:text-slate-400">Effective date: July 1, 2024</p>
            </div>
            
            <div class="prose prose-lg dark:prose-invert max-w-none mx-auto text-slate-700 dark:text-slate-300 font-serif leading-relaxed">
                <p>Please read these Terms and Conditions ("Terms", "Terms and Conditions") carefully before using the Inkwell website (the "Service") operated by Inkwell, Inc. ("us", "we", or "our").</p>
                <p>Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service.</p>
                
                <h2>1. Accounts</h2>
                <p>When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
                <p>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.</p>
                
                <h2>2. Intellectual Property</h2>
                <p>The Service and its original content, features and functionality are and will remain the exclusive property of Inkwell, Inc. and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.</p>
                
                <h2>3. Links To Other Web Sites</h2>
                <p>Our Service may contain links to third-party web sites or services that are not owned or controlled by Inkwell, Inc.</p>
                <p>Inkwell, Inc. has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that Inkwell, Inc. shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services.</p>
                
                <h2>4. Changes</h2>
                <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
            </div>
        `
    }
];

export const snippets: Snippet[] = [
  {
    id: 'snippet-1',
    name: 'Info Box',
    description: 'A blue box for important information or tips.',
    icon: 'InfoIcon',
    content: `
      <div style="background-color: #e0f2fe; border-left: 4px solid #0ea5e9; padding: 1rem; margin: 1.5rem 0; border-radius: 0 8px 8px 0;">
        <p style="margin: 0; color: #0369a1;"><strong>Did you know?</strong> This is an important piece of information that stands out.</p>
      </div>
    `
  },
  {
    id: 'snippet-7',
    name: 'Warning Box',
    description: 'A yellow box for warnings or cautions.',
    icon: 'AlertTriangleIcon',
    content: `
      <div style="background-color: #fefce8; border-left: 4px solid #facc15; padding: 1rem; margin: 1.5rem 0; border-radius: 0 8px 8px 0;">
        <p style="margin: 0; color: #a16207;"><strong>Warning:</strong> Pay close attention to this message as it contains critical information.</p>
      </div>
    `
  },
  {
    id: 'snippet-6',
    name: 'Task List',
    description: 'A checklist for tasks or to-do items.',
    icon: 'CheckSquareIcon',
    content: `
      <ul style="list-style-type: none; padding-left: 0;">
        <li style="display: flex; align-items: center; margin-bottom: 0.5rem;"><input type="checkbox" style="width: 1em; height: 1em; margin-right: 0.75rem;" /><span>First task to complete</span></li>
        <li style="display: flex; align-items: center; margin-bottom: 0.5rem;"><input type="checkbox" style="width: 1em; height: 1em; margin-right: 0.75rem;" /><span>Another important item</span></li>
        <li style="display: flex; align-items: center; margin-bottom: 0.5rem;"><input type="checkbox" style="width: 1em; height: 1em; margin-right: 0.75rem;" checked /><span>A completed task</span></li>
      </ul>
    `
  },
  {
    id: 'snippet-2',
    name: 'Call to Action',
    description: 'A prominent block to encourage user action.',
    icon: 'MegaphoneIcon',
    content: `
      <div style="background-color: #f0fdf4; border: 2px dashed #4ade80; padding: 1.5rem; margin: 1.5rem 0; border-radius: 12px; text-align: center;">
        <h3 style="margin-top: 0; font-size: 1.25rem; font-weight: bold;">Ready to Get Started?</h3>
        <p style="margin-bottom: 1rem;">Join our community today and unlock exclusive content!</p>
        <a href="#" style="background-color: #22c55e; color: white; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 9999px; font-weight: 600; display: inline-block;">Sign Up Now</a>
      </div>
    `
  },
  {
    id: 'snippet-3',
    name: 'Author\'s Note',
    description: 'A personal note from the author, styled distinctly.',
    icon: 'PenToolIcon',
    content: `
      <div style="background-color: #fefce8; border-top: 2px solid #eab308; border-bottom: 2px solid #eab308; padding: 1rem; margin: 1.5rem 0;">
        <p style="margin: 0; font-style: italic; color: #854d0e;"><strong>A quick note:</strong> This technique requires a bit of practice, but the results are well worth the effort. Happy coding!</p>
      </div>
    `
  },
  {
    id: 'snippet-4',
    name: 'Table',
    description: 'A basic data table with a header row.',
    icon: 'TableIcon',
    content: `
      <table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0;">
        <thead>
          <tr>
            <th style="border: 1px solid #cbd5e1; padding: 0.75rem; text-align: left; background-color: #f1f5f9;">Header 1</th>
            <th style="border: 1px solid #cbd5e1; padding: 0.75rem; text-align: left; background-color: #f1f5f9;">Header 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 0.75rem;">Data 1</td>
            <td style="border: 1px solid #cbd5e1; padding: 0.75rem;">Data 2</td>
          </tr>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 0.75rem;">Data 3</td>
            <td style="border: 1px solid #cbd5e1; padding: 0.75rem;">Data 4</td>
          </tr>
        </tbody>
      </table>
    `
  },
   {
    id: 'snippet-5',
    name: 'Accordion / Spoiler',
    description: 'A collapsible section to hide content.',
    icon: 'ChevronDownIcon',
    content: `
      <details style="border: 1px solid #e2e8f0; border-radius: 8px; margin: 1.5rem 0; background-color: #f8fafc;">
        <summary style="padding: 1rem; cursor: pointer; font-weight: 600;">Click to expand</summary>
        <div style="padding: 0 1rem 1rem; border-top: 1px solid #e2e8f0;">
          <p>This content was hidden and is now visible. Perfect for FAQs or spoilers!</p>
        </div>
      </details>
    `
  },
];