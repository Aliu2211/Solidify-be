import mongoose from 'mongoose';
import { Organization, User, EmissionFactor } from '../models';
import config from '../config/environment';
import logger from './logger';

const seedDatabase = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    logger.info('Connected to MongoDB for seeding');

    // Clear existing data (careful in production!)
    await Promise.all([
      Organization.deleteMany({}),
      User.deleteMany({}),
      EmissionFactor.deleteMany({}),
    ]);

    // Create sample organizations
    const organizations = await Organization.create([
      {
        name: 'Electroland Ghana Ltd',
        registrationNumber: 'ORG001',
        industryType: 'Electronics Manufacturing',
        size: 'medium',
        location: 'Accra, Ghana',
        description: 'Leading electronics manufacturer in Ghana',
        sustainabilityLevel: 1,
        verified: true,
      },
      {
        name: 'Hisense Ghana',
        registrationNumber: 'ORG002',
        industryType: 'Electronics Manufacturing',
        size: 'medium',
        location: 'Tema, Ghana',
        description: 'Electronics and appliances manufacturer',
        sustainabilityLevel: 2,
        verified: true,
      },
    ]);

    logger.info(`Created ${organizations.length} organizations`);

    // Create admin user
    const adminUser = await User.create({
      userId: 'SME000001',
      email: 'admin@solidify.com',
      password: 'Admin1234',
      firstName: 'System',
      lastName: 'Administrator',
      role: 'admin',
      organization: organizations[0]._id,
      emailVerified: true,
    });

    logger.info('Created admin user: admin@solidify.com / Admin1234');

    // Create Ghana-specific emission factors
    const emissionFactors = await EmissionFactor.create([
      // Level 1 - Foundation & Measurement
      {
        category: 'Electricity',
        subCategory: 'Grid Electricity',
        description: 'Ghana national grid electricity',
        factorValue: 0.45, // kg CO2e per kWh
        unit: 'kWh',
        source: 'Ghana EPA 2023',
        region: 'Ghana',
        sustainabilityLevel: 1,
        isActive: true,
      },
      {
        category: 'Fuel',
        subCategory: 'Diesel',
        description: 'Diesel fuel consumption',
        factorValue: 2.68, // kg CO2e per liter
        unit: 'liters',
        source: 'IPCC 2023',
        region: 'Ghana',
        sustainabilityLevel: 1,
        isActive: true,
      },
      {
        category: 'Fuel',
        subCategory: 'Petrol',
        description: 'Petrol fuel consumption',
        factorValue: 2.31, // kg CO2e per liter
        unit: 'liters',
        source: 'IPCC 2023',
        region: 'Ghana',
        sustainabilityLevel: 1,
        isActive: true,
      },
      {
        category: 'Transport',
        subCategory: 'Company Vehicle',
        description: 'Company vehicle transport',
        factorValue: 0.21, // kg CO2e per km
        unit: 'km',
        source: 'Ghana Transport Authority',
        region: 'Ghana',
        sustainabilityLevel: 1,
        isActive: true,
      },

      // Level 2 - Efficiency & Integration
      {
        category: 'Renewable Energy',
        subCategory: 'Solar Power',
        description: 'Solar power generation (offset)',
        factorValue: -0.05, // negative = offset
        unit: 'kWh',
        source: 'Ghana Renewable Energy Authority',
        region: 'Ghana',
        sustainabilityLevel: 2,
        isActive: true,
      },
      {
        category: 'Waste',
        subCategory: 'Recycled Waste',
        description: 'Waste recycling',
        factorValue: -0.5, // kg CO2e saved per kg recycled
        unit: 'kg',
        source: 'Ghana EPA',
        region: 'Ghana',
        sustainabilityLevel: 2,
        isActive: true,
      },

      // Level 3 - Transformation & Net Zero
      {
        category: 'Carbon Offset',
        subCategory: 'Tree Planting',
        description: 'Tree planting offset',
        factorValue: -21.77, // kg CO2e per tree per year
        unit: 'trees',
        source: 'Ghana Forestry Commission',
        region: 'Ghana',
        sustainabilityLevel: 3,
        isActive: true,
      },
      {
        category: 'Carbon Offset',
        subCategory: 'Carbon Credits',
        description: 'Purchased carbon credits',
        factorValue: -1000, // kg CO2e per credit
        unit: 'credits',
        source: 'Ghana Carbon Registry',
        region: 'Ghana',
        sustainabilityLevel: 3,
        isActive: true,
      },
    ]);

    logger.info(`Created ${emissionFactors.length} emission factors`);

    logger.info('✅ Database seeded successfully!');
    logger.info(`
      🔐 Admin Login:
      Email: admin@solidify.com
      Password: Admin1234
      User ID: SME000001

      🏢 Organizations created: ${organizations.length}
      📊 Emission factors created: ${emissionFactors.length}
    `);

    process.exit(0);
  } catch (error) {
    logger.error('Seed error:', error);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;
