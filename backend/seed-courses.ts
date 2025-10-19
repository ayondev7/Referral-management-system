import mongoose from 'mongoose';
import { config } from './src/config/env';
import { Course } from './src/modules/course/course.model';

const sampleCourses = [
  {
    title: 'Complete Web Design: from Figma to Webflow to Freelancing',
    description: '3 in 1 Course: Learn to design websites with Figma, build with Webflow, and make a living freelancing.',
    author: 'Vako Shvili',
    price: 14.99,
    imageUrl: 'https://img-c.udemycdn.com/course/480x270/3456481_cb90.jpg',
    category: 'Web Design',
  },
  {
    title: 'The Complete JavaScript Course 2024: From Zero to Expert',
    description: 'The modern JavaScript course for everyone! Master JavaScript with projects, challenges and theory.',
    author: 'Jonas Schmedtmann',
    price: 89.99,
    imageUrl: 'https://img-c.udemycdn.com/course/480x270/851712_fc61_5.jpg',
    category: 'Programming',
  },
  {
    title: 'React - The Complete Guide 2024',
    description: 'Dive in and learn React.js from scratch! Learn React, Hooks, Redux, React Router, Next.js, Best Practices and way more!',
    author: 'Maximilian Schwarzmüller',
    price: 94.99,
    imageUrl: 'https://img-c.udemycdn.com/course/480x270/1362070_b9a1_2.jpg',
    category: 'Web Development',
  },
  {
    title: 'Python for Data Science and Machine Learning Bootcamp',
    description: 'Learn how to use NumPy, Pandas, Seaborn, Matplotlib, Plotly, Scikit-Learn, Machine Learning, Tensorflow, and more!',
    author: 'Jose Portilla',
    price: 119.99,
    imageUrl: 'https://img-c.udemycdn.com/course/480x270/903744_8eb2.jpg',
    category: 'Data Science',
  },
  {
    title: 'The Complete Node.js Developer Course',
    description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Jest, and more!',
    author: 'Andrew Mead',
    price: 99.99,
    imageUrl: 'https://img-c.udemycdn.com/course/480x270/922484_52a1_8.jpg',
    category: 'Backend Development',
  },
  {
    title: 'Angular - The Complete Guide',
    description: 'Master Angular and build awesome, reactive web apps with the successor of Angular.js',
    author: 'Maximilian Schwarzmüller',
    price: 89.99,
    imageUrl: 'https://img-c.udemycdn.com/course/480x270/756150_c033_2.jpg',
    category: 'Web Development',
  },
  {
    title: 'iOS & Swift - The Complete iOS App Development Bootcamp',
    description: 'From Beginner to iOS App Developer with Just One Course! Fully Updated with a Comprehensive Module Dedicated to SwiftUI!',
    author: 'Dr. Angela Yu',
    price: 109.99,
    imageUrl: 'https://img-c.udemycdn.com/course/480x270/1778502_f4b9_12.jpg',
    category: 'Mobile Development',
  },
  {
    title: 'The Complete Digital Marketing Course',
    description: '12 Courses in 1: SEO, YouTube, Facebook, Instagram, Google Ads, TikTok, LinkedIn, Email, WordPress, Analytics & AI',
    author: 'Rob Percival',
    price: 79.99,
    imageUrl: 'https://img-c.udemycdn.com/course/480x270/1400338_7aa8_3.jpg',
    category: 'Marketing',
  },
  {
    title: 'The Complete 2024 Web Development Bootcamp',
    description: 'Become a Full-Stack Web Developer with just ONE course. HTML, CSS, Javascript, Node, React, PostgreSQL, Web3 and DApps',
    author: 'Dr. Angela Yu',
    price: 99.99,
    imageUrl: 'https://img-c.udemycdn.com/course/480x270/1565838_e54e_18.jpg',
    category: 'Web Development',
  },
  {
    title: 'Machine Learning A-Z: AI, Python & R',
    description: 'Learn to create Machine Learning Algorithms in Python and R from two Data Science experts.',
    author: 'Kirill Eremenko',
    price: 129.99,
    imageUrl: 'https://img-c.udemycdn.com/course/480x270/950390_270f_3.jpg',
    category: 'Machine Learning',
  },
  {
    title: 'The Complete Cyber Security Course',
    description: 'Become a Cyber Security Specialist, Learn How to Stop Hackers, Prevent Hacking, Learn IT Security & INFOSEC',
    author: 'Nathan House',
    price: 109.99,
    imageUrl: 'https://img-c.udemycdn.com/course/480x270/1298024_6e49_2.jpg',
    category: 'Cyber Security',
  },
  {
    title: 'Adobe Photoshop CC – Essentials Training Course',
    description: 'Learn Adobe Photoshop CC from scratch. Gain confidence with real-world projects from an Adobe Certified Expert',
    author: 'Daniel Walter Scott',
    price: 69.99,
    imageUrl: 'https://img-c.udemycdn.com/course/480x270/813554_a58a_3.jpg',
    category: 'Design',
  },
];

async function seedCourses() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing courses (optional - comment out if you want to keep existing data)
    await Course.deleteMany({});
    console.log('🗑️  Cleared existing courses');

    // Insert sample courses
    const result = await Course.insertMany(sampleCourses);
    console.log(`✅ Successfully inserted ${result.length} courses`);

    // Display inserted courses
    result.forEach((course, index) => {
      console.log(`${index + 1}. ${course.title} - $${course.price}`);
    });

    console.log('\n🎉 Course seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding courses:', error);
    process.exit(1);
  }
}

// Run the seeder
seedCourses();
