import mongoose from 'mongoose';
import dotenv from 'dotenv';
import '../models/User.js';
import '../models/Equipment.js';
import '../models/Team.js';
import '../models/Maintenance.js';
import '../models/Inventory.js';

dotenv.config();

const cleanDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/GearGuard');
    console.log('✅ Connected to MongoDB');

    // Now models are registered, get them
    const User = mongoose.model('User');
    const Equipment = mongoose.model('Equipment');
    const Team = mongoose.model('Team');
    const Maintenance = mongoose.model('Maintenance');
    const Inventory = mongoose.model('Inventory');

    console.log('🗑️ Cleaning database...\n');

    const userResult = await User.deleteMany({});
    console.log(`   ✓ Deleted ${userResult.deletedCount} users`);

    const equipmentResult = await Equipment.deleteMany({});
    console.log(`   ✓ Deleted ${equipmentResult.deletedCount} equipment items`);

    const teamResult = await Team.deleteMany({});
    console.log(`   ✓ Deleted ${teamResult.deletedCount} teams`);

    const maintenanceResult = await Maintenance.deleteMany({});
    console.log(`   ✓ Deleted ${maintenanceResult.deletedCount} maintenance records`);

    const inventoryResult = await Inventory.deleteMany({});
    console.log(`   ✓ Deleted ${inventoryResult.deletedCount} inventory items`);

    console.log('\n✨ Database cleaned successfully!');
    console.log('💡 Run "npm run seed" to populate with fresh data\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error cleaning database:', error.message);
    process.exit(1);
  }
};

cleanDatabase();
