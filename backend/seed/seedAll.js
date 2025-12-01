// backend/seed/seedAll.js
// Runs all seed scripts in the correct order
// micheal
import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get the backend directory (parent of seed directory)
const backendDir = join(__dirname, '..');

// Run a seed script
const runSeed = async (scriptName, description) => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🌱 ${description}`);
  console.log(`${'='.repeat(60)}\n`);

  try {
    const { stdout, stderr } = await execAsync(`node ${join(__dirname, scriptName)}`, {
      cwd: backendDir,
      env: { ...process.env },
    });

    if (stdout) console.log(stdout);
    if (stderr && !stderr.includes('Warning')) console.error(stderr);

    return true;
  } catch (error) {
    console.error(`❌ Error running ${scriptName}:`, error.message);
    if (error.stdout) console.error(error.stdout);
    if (error.stderr) console.error(error.stderr);
    return false;
  }
};

// Main seeding function
const seedAll = async () => {
  console.log('\n🚀 Starting complete database seeding process...');
  console.log('📦 This will seed: Users → Courses → Enrollments\n');

  // Check if MONGO_URI is set
  if (!process.env.MONGO_URI && !process.env.MONGODB_URI) {
    console.error('❌ Error: MONGO_URI or MONGODB_URI environment variable is not set');
    console.error('Please create a .env file in the backend directory with your MongoDB Atlas connection string');
    process.exit(1);
  }

  // Run seeds in order
  const steps = [
    { script: 'seedUsers.js', description: 'Seeding Users' },
    { script: 'seedCourses.js', description: 'Seeding Courses' },
    { script: 'seedEnrollments.js', description: 'Seeding Enrollments' },
  ];

  for (const step of steps) {
    const success = await runSeed(step.script, step.description);

    if (!success) {
      console.error(`\n❌ Failed to seed ${step.description}`);
      console.error('Stopping seeding process. Please fix the error and try again.');
      process.exit(1);
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log('✨ All seeding completed successfully!');
  console.log(`${'='.repeat(60)}\n`);
  console.log('📊 Database Summary:');
  console.log('   ✅ Users seeded');
  console.log('   ✅ Courses seeded');
  console.log('   ✅ Enrollments seeded');
  console.log('\n🎉 Your MongoDB Atlas database is now populated!\n');

  process.exit(0);
};

// Run the seeding process
seedAll().catch((error) => {
  console.error('❌ Fatal error during seeding:', error);
  process.exit(1);
});

