import mongoose from 'mongoose';
import { LibraryResource } from '../models/library.model';
import { User } from '../models';
import config from '../config/environment';

const libraryResources = [
  // ========================================
  // LEVEL 1 - FOUNDATION & MEASUREMENT
  // ========================================

  // Templates
  {
    title: 'Carbon Footprint Calculation Template',
    description: 'Excel template for calculating your organization\'s carbon footprint across Scope 1, 2, and 3 emissions. Includes pre-built formulas and guidance.',
    category: 'template',
    tags: ['carbon-footprint', 'scope-1', 'scope-2', 'scope-3', 'excel', 'calculation'],
    fileType: 'xlsx',
    fileUrl: 'https://example.com/resources/carbon-footprint-template.xlsx',
    fileSize: 1024000,
    thumbnailUrl: 'https://example.com/thumbnails/carbon-template.jpg',
    level: 1,
    industry: ['general', 'manufacturing', 'retail', 'services'],
    isFeatured: true,
    isPremium: false,
    version: '2.0',
  },
  {
    title: 'GHG Inventory Reporting Template',
    description: 'Comprehensive template for creating annual GHG inventory reports compliant with international standards.',
    category: 'template',
    tags: ['ghg-inventory', 'reporting', 'annual-report', 'compliance'],
    fileType: 'docx',
    fileUrl: 'https://example.com/resources/ghg-inventory-template.docx',
    fileSize: 512000,
    level: 1,
    industry: ['general'],
    isFeatured: false,
    isPremium: false,
  },

  // Regulatory Documents
  {
    title: 'GHG Protocol Corporate Standard',
    description: 'The most widely used international accounting tool for quantifying greenhouse gas emissions. Essential reading for carbon measurement.',
    category: 'regulatory',
    tags: ['ghg-protocol', 'standards', 'emissions', 'accounting', 'wri', 'wbcsd'],
    fileType: 'pdf',
    fileUrl: 'https://ghgprotocol.org/sites/default/files/standards/ghg-protocol-revised.pdf',
    fileSize: 3072000,
    thumbnailUrl: 'https://example.com/thumbnails/ghg-protocol.jpg',
    level: 1,
    industry: ['general'],
    isFeatured: true,
    isPremium: false,
    version: 'Revised Edition',
  },
  {
    title: 'ISO 14064-1:2018 Standard',
    description: 'International standard specifying principles and requirements for designing, developing, managing and reporting organizational GHG inventories.',
    category: 'regulatory',
    tags: ['iso', 'iso-14064', 'standards', 'certification', 'ghg-inventory'],
    fileType: 'pdf',
    fileUrl: 'https://example.com/resources/iso-14064-1-2018.pdf',
    fileSize: 2048000,
    level: 1,
    industry: ['general'],
    isFeatured: false,
    isPremium: true,
  },

  // Guides
  {
    title: 'Getting Started with Carbon Accounting',
    description: 'A beginner-friendly guide to understanding carbon accounting principles, emission scopes, and measurement methodologies.',
    category: 'guide',
    tags: ['beginner', 'carbon-accounting', 'measurement', 'basics', 'introduction'],
    fileType: 'pdf',
    fileUrl: 'https://example.com/resources/carbon-accounting-guide.pdf',
    fileSize: 1536000,
    thumbnailUrl: 'https://example.com/thumbnails/accounting-guide.jpg',
    level: 1,
    industry: ['general'],
    isFeatured: true,
    isPremium: false,
  },

  // ========================================
  // LEVEL 2 - EFFICIENCY & INTEGRATION
  // ========================================

  // Case Studies
  {
    title: 'Microsoft: Carbon Negative by 2030',
    description: 'Case study examining Microsoft\'s ambitious plan to become carbon negative, including their strategies for emissions reduction and carbon removal.',
    category: 'case-study',
    tags: ['microsoft', 'carbon-negative', 'tech-industry', 'strategy', 'renewable-energy'],
    fileType: 'pdf',
    fileUrl: 'https://example.com/resources/microsoft-carbon-negative.pdf',
    fileSize: 2560000,
    thumbnailUrl: 'https://example.com/thumbnails/microsoft-case.jpg',
    level: 2,
    industry: ['technology', 'services'],
    isFeatured: true,
    isPremium: false,
  },
  {
    title: 'Unilever: Sustainable Supply Chain Transformation',
    description: 'How Unilever reduced supply chain emissions by 40% through supplier engagement, renewable energy, and sustainable sourcing.',
    category: 'case-study',
    tags: ['unilever', 'supply-chain', 'scope-3', 'supplier-engagement', 'fmcg'],
    fileType: 'pdf',
    fileUrl: 'https://example.com/resources/unilever-supply-chain.pdf',
    fileSize: 1792000,
    level: 2,
    industry: ['manufacturing', 'retail', 'fmcg'],
    isFeatured: false,
    isPremium: false,
  },

  // Reports
  {
    title: 'IEA Net Zero by 2050 Roadmap',
    description: 'Comprehensive roadmap from the International Energy Agency outlining pathways to achieve net zero emissions globally by 2050.',
    category: 'report',
    tags: ['iea', 'net-zero', 'roadmap', 'energy', 'transition', 'global'],
    fileType: 'pdf',
    fileUrl: 'https://example.com/resources/iea-net-zero-2050.pdf',
    fileSize: 4096000,
    thumbnailUrl: 'https://example.com/thumbnails/iea-report.jpg',
    level: 2,
    industry: ['general', 'energy'],
    isFeatured: true,
    isPremium: false,
    version: '2023 Update',
  },

  // Templates
  {
    title: 'Energy Efficiency Audit Checklist',
    description: 'Comprehensive checklist for conducting energy efficiency audits across facilities, including HVAC, lighting, and process equipment.',
    category: 'template',
    tags: ['energy-efficiency', 'audit', 'facilities', 'hvac', 'lighting'],
    fileType: 'xlsx',
    fileUrl: 'https://example.com/resources/energy-audit-checklist.xlsx',
    fileSize: 768000,
    level: 2,
    industry: ['manufacturing', 'facilities', 'retail'],
    isFeatured: false,
    isPremium: false,
  },
  {
    title: 'Carbon Reduction Action Plan Template',
    description: 'Strategic planning template for developing a comprehensive carbon reduction action plan with goals, initiatives, and tracking.',
    category: 'template',
    tags: ['action-plan', 'reduction', 'strategy', 'planning', 'goals'],
    fileType: 'pptx',
    fileUrl: 'https://example.com/resources/reduction-action-plan.pptx',
    fileSize: 2048000,
    level: 2,
    industry: ['general'],
    isFeatured: false,
    isPremium: false,
  },

  // Videos & Webinars
  {
    title: 'Renewable Energy Procurement Strategies',
    description: 'Webinar recording covering PPAs, RECs, virtual PPAs, and other mechanisms for procuring renewable energy for your organization.',
    category: 'webinar',
    tags: ['renewable-energy', 'procurement', 'ppa', 'recs', 'webinar'],
    fileType: 'video',
    fileUrl: 'https://example.com/resources/renewable-procurement-webinar.mp4',
    fileSize: 157286400,
    thumbnailUrl: 'https://example.com/thumbnails/renewable-webinar.jpg',
    level: 2,
    industry: ['general'],
    isFeatured: false,
    isPremium: true,
  },

  // Guides
  {
    title: 'Scope 3 Emissions Measurement Guide',
    description: 'Detailed guide for identifying, measuring, and managing Scope 3 emissions across 15 categories of the value chain.',
    category: 'guide',
    tags: ['scope-3', 'supply-chain', 'value-chain', 'measurement', 'categories'],
    fileType: 'pdf',
    fileUrl: 'https://example.com/resources/scope3-guide.pdf',
    fileSize: 2304000,
    level: 2,
    industry: ['general'],
    isFeatured: true,
    isPremium: false,
  },

  // ========================================
  // LEVEL 3 - TRANSFORMATION & NET ZERO
  // ========================================

  // Regulatory Documents
  {
    title: 'Science Based Targets Initiative (SBTi) Criteria',
    description: 'Official criteria and recommendations for setting science-based emissions reduction targets aligned with climate science.',
    category: 'regulatory',
    tags: ['sbti', 'science-based-targets', 'net-zero', 'validation', 'standards'],
    fileType: 'pdf',
    fileUrl: 'https://example.com/resources/sbti-criteria.pdf',
    fileSize: 1843200,
    thumbnailUrl: 'https://example.com/thumbnails/sbti.jpg',
    level: 3,
    industry: ['general'],
    isFeatured: true,
    isPremium: false,
    version: 'Version 5.0',
  },
  {
    title: 'TCFD Recommendations',
    description: 'Task Force on Climate-related Financial Disclosures framework for disclosing climate-related risks and opportunities.',
    category: 'regulatory',
    tags: ['tcfd', 'climate-risk', 'disclosure', 'financial', 'governance'],
    fileType: 'pdf',
    fileUrl: 'https://example.com/resources/tcfd-recommendations.pdf',
    fileSize: 2621440,
    level: 3,
    industry: ['general', 'finance'],
    isFeatured: true,
    isPremium: false,
  },

  // Case Studies
  {
    title: 'Apple: Carbon Neutral Supply Chain by 2030',
    description: 'In-depth analysis of Apple\'s strategy to achieve carbon neutrality across its entire supply chain, including innovations and partnerships.',
    category: 'case-study',
    tags: ['apple', 'carbon-neutral', 'supply-chain', 'innovation', 'technology'],
    fileType: 'pdf',
    fileUrl: 'https://example.com/resources/apple-carbon-neutral.pdf',
    fileSize: 3145728,
    thumbnailUrl: 'https://example.com/thumbnails/apple-case.jpg',
    level: 3,
    industry: ['technology', 'manufacturing'],
    isFeatured: true,
    isPremium: false,
  },
  {
    title: 'Ørsted: From Coal to Renewable Energy Leader',
    description: 'Transformation journey of Ørsted from Europe\'s most coal-intensive utility to a global renewable energy leader.',
    category: 'case-study',
    tags: ['orsted', 'transformation', 'renewable-energy', 'coal-phase-out', 'energy'],
    fileType: 'pdf',
    fileUrl: 'https://example.com/resources/orsted-transformation.pdf',
    fileSize: 2097152,
    level: 3,
    industry: ['energy', 'utilities'],
    isFeatured: false,
    isPremium: false,
  },

  // Reports
  {
    title: 'IPCC Sixth Assessment Report - Mitigation',
    description: 'Latest IPCC assessment on climate change mitigation strategies, pathways, and the urgency of action.',
    category: 'report',
    tags: ['ipcc', 'climate-science', 'mitigation', 'assessment', 'global'],
    fileType: 'pdf',
    fileUrl: 'https://example.com/resources/ipcc-ar6-mitigation.pdf',
    fileSize: 10485760,
    thumbnailUrl: 'https://example.com/thumbnails/ipcc-report.jpg',
    level: 3,
    industry: ['general'],
    isFeatured: true,
    isPremium: false,
    version: 'AR6',
  },
  {
    title: 'Corporate Net Zero Pathways Report 2024',
    description: 'Analysis of corporate net zero commitments, strategies, and progress across industries worldwide.',
    category: 'report',
    tags: ['net-zero', 'corporate', 'pathways', 'commitments', 'analysis'],
    fileType: 'pdf',
    fileUrl: 'https://example.com/resources/net-zero-pathways-2024.pdf',
    fileSize: 5242880,
    level: 3,
    industry: ['general'],
    isFeatured: true,
    isPremium: true,
  },

  // Guides
  {
    title: 'Carbon Offsetting and Removal Guide',
    description: 'Comprehensive guide to carbon offsetting, carbon removal technologies, quality criteria, and best practices for credible climate action.',
    category: 'guide',
    tags: ['carbon-offsetting', 'carbon-removal', 'credits', 'quality', 'best-practices'],
    fileType: 'pdf',
    fileUrl: 'https://example.com/resources/offsetting-removal-guide.pdf',
    fileSize: 2867200,
    thumbnailUrl: 'https://example.com/thumbnails/offsetting-guide.jpg',
    level: 3,
    industry: ['general'],
    isFeatured: true,
    isPremium: false,
  },
  {
    title: 'Climate Risk Assessment Framework',
    description: 'Framework for identifying, assessing, and managing physical and transition climate risks to business operations.',
    category: 'guide',
    tags: ['climate-risk', 'risk-assessment', 'adaptation', 'resilience', 'framework'],
    fileType: 'pdf',
    fileUrl: 'https://example.com/resources/climate-risk-framework.pdf',
    fileSize: 1966080,
    level: 3,
    industry: ['general', 'finance'],
    isFeatured: false,
    isPremium: true,
  },

  // Videos
  {
    title: 'Net Zero Strategy Masterclass',
    description: 'Expert-led video series on developing and implementing a comprehensive net zero strategy, including target setting and roadmap development.',
    category: 'video',
    tags: ['net-zero', 'strategy', 'masterclass', 'training', 'targets'],
    fileType: 'video',
    fileUrl: 'https://example.com/resources/net-zero-masterclass.mp4',
    fileSize: 314572800,
    thumbnailUrl: 'https://example.com/thumbnails/masterclass.jpg',
    level: 3,
    industry: ['general'],
    isFeatured: true,
    isPremium: true,
  },

  // Templates
  {
    title: 'Net Zero Roadmap Template',
    description: 'Strategic roadmap template for planning your organization\'s journey to net zero, including milestones, initiatives, and investments.',
    category: 'template',
    tags: ['net-zero', 'roadmap', 'strategy', 'planning', 'milestones'],
    fileType: 'pptx',
    fileUrl: 'https://example.com/resources/net-zero-roadmap.pptx',
    fileSize: 3145728,
    level: 3,
    industry: ['general'],
    isFeatured: false,
    isPremium: false,
  },
  {
    title: 'Climate Risk Register Template',
    description: 'Template for documenting and tracking climate-related risks and opportunities, aligned with TCFD recommendations.',
    category: 'template',
    tags: ['climate-risk', 'risk-register', 'tcfd', 'tracking', 'governance'],
    fileType: 'xlsx',
    fileUrl: 'https://example.com/resources/climate-risk-register.xlsx',
    fileSize: 1048576,
    level: 3,
    industry: ['general', 'finance'],
    isFeatured: false,
    isPremium: true,
  },
];

async function seedLibrary() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find an admin user to attribute resources to
    const adminUser = await User.findOne({ role: 'admin' });

    if (!adminUser) {
      console.error('❌ No admin user found. Please create an admin user first.');
      process.exit(1);
    }

    console.log(`📝 Found admin user: ${adminUser.email}`);

    // Clear existing library resources
    await LibraryResource.deleteMany({});
    console.log('🗑️  Cleared existing library resources');

    // Add uploadedBy and resourceId to all resources
    const resourcesWithUploader = libraryResources.map((resource, index) => ({
      ...resource,
      resourceId: `LIB${String(index + 1).padStart(6, '0')}`,
      uploadedBy: adminUser._id,
      isActive: true,
    }));

    // Insert resources
    const createdResources = await LibraryResource.insertMany(resourcesWithUploader);

    console.log('\n✅ Successfully seeded library resources!');
    console.log(`📚 Total resources created: ${createdResources.length}`);

    // Summary by category
    const categorySummary = createdResources.reduce((acc: any, resource) => {
      acc[resource.category] = (acc[resource.category] || 0) + 1;
      return acc;
    }, {});

    console.log('\n📊 Resources by category:');
    Object.entries(categorySummary).forEach(([category, count]) => {
      console.log(`   ${category}: ${count}`);
    });

    // Summary by level
    const levelSummary = createdResources.reduce((acc: any, resource) => {
      const level = resource.level || 'General';
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {});

    console.log('\n📈 Resources by level:');
    Object.entries(levelSummary).forEach(([level, count]) => {
      console.log(`   Level ${level}: ${count}`);
    });

    console.log('\n🎉 Library seeding complete!');

    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error seeding library:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the seed function
seedLibrary();
