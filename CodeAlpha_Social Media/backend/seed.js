require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');

const USERS = [
  { username: 'alex_vibes', email: 'alex@vgram.io', password: 'password123', bio: 'Photographer & traveler ✈️' },
  { username: 'mia_creates', email: 'mia@vgram.io', password: 'password123', bio: 'Digital artist | Coffee addict ☕' },
  { username: 'devjordan', email: 'jordan@vgram.io', password: 'password123', bio: 'Full-stack dev. Building cool things 🔧' },
  { username: 'sara_lens', email: 'sara@vgram.io', password: 'password123', bio: 'Street photography enthusiast 📸' },
  { username: 'kai_design', email: 'kai@vgram.io', password: 'password123', bio: 'UI/UX designer. Making pixels perfect ✨' },
];

const POSTS = [
  'Just shipped a new feature after 3 days of debugging. The bug was a missing semicolon. I am not okay. 😅',
  'Golden hour in the mountains is something else entirely. No filter needed when nature does the work 🌄',
  'Hot take: dark mode should be the default everywhere. Change my mind.',
  'Three years of grinding finally paid off. Landed my dream job today 🎉 Never give up on what you want.',
  'Made pasta from scratch for the first time. It took 4 hours and looked terrible but tasted incredible 🍝',
  'Coffee shops are the best offices. Change of scenery = change of mindset ☕💻',
  'Redesigned my portfolio again. Fourth time this year. A designer is never truly done.',
  'Read 40 books this year. Best investment I made was in a library card and actually using it.',
  'The hardest part about being a developer is explaining to family what you do for a living.',
  'Sunset walks should be mandatory. Policy proposal: everyone gets one hour off at dusk.',
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[seed] Connected to MongoDB');

    if (process.argv.includes('--clear')) {
      await User.deleteMany({});
      await Post.deleteMany({});
      console.log('[seed] Cleared existing data');
    }

    const createdUsers = await User.create(USERS);
    console.log(`[seed] Created ${createdUsers.length} users`);

    const postDocs = POSTS.map((content, i) => ({
      user: createdUsers[i % createdUsers.length]._id,
      username: createdUsers[i % createdUsers.length].username,
      content,
      likes: createdUsers.slice(0, Math.floor(Math.random() * 4)).map((u) => u._id),
    }));

    await Post.create(postDocs);
    console.log(`[seed] Created ${postDocs.length} posts`);

    console.log('[seed] Done ✓');
    console.log('─────────────────────────────');
    console.log('Login with any seeded account:');
    USERS.forEach((u) => console.log(`  ${u.email}  /  ${u.password}`));
    console.log('─────────────────────────────');
    process.exit(0);
  } catch (err) {
    console.error('[seed] Error:', err.message);
    process.exit(1);
  }
}

seed();
