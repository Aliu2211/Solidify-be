import mongoose from 'mongoose';
import { Course, User } from '../models';
import config from '../config/environment';

// Simplified course data with basic content
const courses = [
  // Level 1: Foundation & Measurement
  {
    courseId: 'CRS000001',
    title: 'Introduction to Carbon Footprinting',
    description: 'Learn the fundamentals of carbon footprinting and why it matters for your business. Understand the basics of greenhouse gas emissions and their impact on climate change.',
    content: `<h1>Introduction to Carbon Footprinting</h1>
<p>A carbon footprint is the total amount of greenhouse gases (GHG) produced directly and indirectly by an individual, organization, event, or product.</p>
<h2>Why Does It Matter?</h2>
<ul>
<li>Climate Change: GHG emissions contribute to global warming</li>
<li>Regulatory Compliance: Governments are implementing carbon regulations</li>
<li>Cost Savings: Identifying emissions helps reduce energy costs</li>
<li>Reputation: Customers prefer environmentally responsible businesses</li>
</ul>
<h2>The Three Scopes of Emissions</h2>
<p><strong>Scope 1: Direct Emissions</strong> - Company vehicles, on-site fuel combustion, manufacturing processes</p>
<p><strong>Scope 2: Indirect Emissions from Energy</strong> - Purchased electricity, heating/cooling, steam</p>
<p><strong>Scope 3: Other Indirect Emissions</strong> - Business travel, employee commuting, supply chain, waste disposal</p>`,
    level: 1,
    orderInLevel: 1,
    duration: 30,
    completionCriteria: { type: 'read', requiredTime: 15 },
    resources: [
      { title: 'GHG Protocol Corporate Standard', url: 'https://ghgprotocol.org/corporate-standard', type: 'link' }
    ],
  },
  {
    courseId: 'CRS000002',
    title: 'Scope 1 & 2 Emissions: Measurement & Tracking',
    description: 'Master the techniques for measuring and tracking your direct and energy-related emissions. Learn practical methods for data collection and calculation.',
    content: `<h1>Scope 1 & 2 Emissions: Measurement & Tracking</h1>
<h2>Understanding Scope 1 Emissions</h2>
<p>Scope 1 emissions are direct emissions from sources owned or controlled by your organization.</p>
<h3>Common Sources:</h3>
<ul>
<li>Natural gas for heating</li>
<li>Company-owned vehicles</li>
<li>Diesel generators</li>
<li>Refrigerant leaks</li>
</ul>
<h3>How to Measure:</h3>
<p><strong>Formula:</strong> Activity Data × Emission Factor = Emissions</p>
<p><strong>Example:</strong> 1,000 liters of diesel × 2.68 kg CO2/liter = 2,680 kg CO2 (2.68 tonnes)</p>
<h2>Understanding Scope 2 Emissions</h2>
<p>Scope 2 covers indirect emissions from purchased electricity, heat, steam, or cooling.</p>
<p><strong>Formula:</strong> Energy Consumed (kWh) × Grid Emission Factor = Emissions</p>`,
    level: 1,
    orderInLevel: 2,
    duration: 45,
    completionCriteria: { type: 'quiz', passingScore: 70 },
    resources: [
      { title: 'Emission Factor Database', url: 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2023', type: 'link' }
    ],
  },
  {
    courseId: 'CRS000003',
    title: 'Setting Up Your Carbon Accounting System',
    description: 'Build a robust system for tracking and managing your carbon data. Learn about tools, processes, and best practices for accurate reporting.',
    content: `<h1>Setting Up Your Carbon Accounting System</h1>
<h2>Why You Need a System</h2>
<p>A proper carbon accounting system ensures accurate data collection, consistent reporting, regulatory compliance, and progress tracking.</p>
<h2>System Components</h2>
<h3>1. Data Collection Framework</h3>
<p>Track: Energy consumption, transportation, waste, water, purchased goods/services</p>
<h3>2. Organizational Boundaries</h3>
<p>Define your reporting boundary using either control approach or equity share approach</p>
<h3>3. Baseline Year</h3>
<p>Choose a baseline year with complete, reliable data from the past 3-5 years</p>
<h3>4. Calculation Methodology</h3>
<p>Activity Data × Emission Factor = Emissions</p>`,
    level: 1,
    orderInLevel: 3,
    duration: 50,
    completionCriteria: { type: 'read', requiredTime: 25 },
    resources: [
      { title: 'ISO 14064 Standard', url: 'https://www.iso.org/standard/66453.html', type: 'link' }
    ],
  },
  {
    courseId: 'CRS000004',
    title: 'Baseline Assessment & Reporting Fundamentals',
    description: 'Learn how to establish your baseline emissions and create professional carbon reports. Understand key reporting frameworks and disclosure requirements.',
    content: `<h1>Baseline Assessment & Reporting Fundamentals</h1>
<h2>What is a Baseline Assessment?</h2>
<p>A comprehensive measurement of your organization's emissions at a specific point in time, serving as the reference point for tracking progress.</p>
<h2>Conducting a Baseline Assessment</h2>
<ol>
<li>Choose Your Base Year - Select a year with complete, reliable data</li>
<li>Define Scope - Decide geographic, operational boundaries, and emission scopes</li>
<li>Collect Data - Gather 12 months of energy, transportation, waste, water data</li>
<li>Calculate Emissions - Apply appropriate emission factors</li>
<li>Document Everything - Create a baseline report</li>
</ol>
<h2>Reporting Frameworks</h2>
<p><strong>GHG Protocol:</strong> Most widely used framework with principles of relevance, completeness, consistency, transparency, accuracy</p>
<p><strong>CDP:</strong> Annual questionnaire for investor-focused climate change reporting</p>
<p><strong>ISO 14064:</strong> International standard with third-party verification</p>`,
    level: 1,
    orderInLevel: 4,
    duration: 55,
    completionCriteria: { type: 'assessment', passingScore: 75 },
    resources: [
      { title: 'GHG Protocol Reporting Guide', url: 'https://ghgprotocol.org/corporate-standard', type: 'link' }
    ],
  },

  // Level 2: Efficiency & Integration
  {
    courseId: 'CRS000005',
    title: 'Energy Efficiency & Renewable Energy Integration',
    description: 'Discover practical strategies for improving energy efficiency and integrating renewable energy sources into your operations.',
    content: `<h1>Energy Efficiency & Renewable Energy Integration</h1>
<h2>Energy Efficiency Fundamentals</h2>
<p>Energy efficiency means using less energy to perform the same task, eliminating waste.</p>
<h3>Benefits:</h3>
<ul>
<li>Cost Savings: 10-30% reduction in energy bills</li>
<li>Carbon Reduction: Less energy = fewer emissions</li>
<li>Improved Comfort: Better HVAC and lighting</li>
<li>Competitive Advantage: Lower operating costs</li>
</ul>
<h2>Quick Win Opportunities</h2>
<h3>Lighting (20-40% savings)</h3>
<p>Replace with LED bulbs (75% energy savings vs incandescent), install motion sensors, use daylight sensors</p>
<h3>HVAC (20-50% savings)</h3>
<p>Regular maintenance, programmable thermostats, zone control, insulation improvements</p>
<h2>Renewable Energy Options</h2>
<p><strong>Solar PV:</strong> Best for facilities with good roof space, 5-10 year payback</p>
<p><strong>Wind Power:</strong> Rural locations with consistent wind</p>
<p><strong>Green Power Purchase:</strong> Renewable Energy Certificates, PPAs, Community Solar</p>`,
    level: 2,
    orderInLevel: 1,
    duration: 60,
    completionCriteria: { type: 'read', requiredTime: 30 },
    resources: [
      { title: 'Renewable Energy Calculator', url: 'https://www.nrel.gov/pv/', type: 'link' }
    ],
  },
  {
    courseId: 'CRS000006',
    title: 'Supply Chain Carbon Management',
    description: 'Learn strategies for measuring and reducing emissions throughout your supply chain. Engage suppliers in your sustainability journey.',
    content: `<h1>Supply Chain Carbon Management</h1>
<h2>Understanding Scope 3 Emissions</h2>
<p>Scope 3 represents all indirect emissions in your value chain - typically 75-95% of total carbon footprint.</p>
<h2>Why Scope 3 Matters</h2>
<ul>
<li>Critical for comprehensive climate action</li>
<li>Increasing stakeholder expectations</li>
<li>Supply chain resilience</li>
<li>Risk management</li>
</ul>
<h2>Measuring Supply Chain Emissions</h2>
<h3>Spend-Based Method:</h3>
<p>Emissions = Spend ($) × Emission Factor (kg CO2/$)</p>
<h3>Activity-Based Method:</h3>
<p>Emissions = Activity Data × Emission Factor</p>
<h2>Supplier Engagement Strategy</h2>
<ol>
<li>Awareness: Map supply chain, identify key suppliers</li>
<li>Measurement: Request emissions data, provide templates</li>
<li>Collaboration: Share reduction strategies, set joint targets</li>
<li>Integration: Include carbon in procurement decisions</li>
</ol>`,
    level: 2,
    orderInLevel: 2,
    duration: 65,
    completionCriteria: { type: 'quiz', passingScore: 75 },
    resources: [
      { title: 'Scope 3 Calculation Guidance', url: 'https://ghgprotocol.org/scope-3-calculation-guidance', type: 'link' }
    ],
  },
  {
    courseId: 'CRS000007',
    title: 'Carbon Reduction Action Planning',
    description: 'Develop comprehensive carbon reduction strategies and action plans. Learn how to set science-based targets and prioritize initiatives.',
    content: `<h1>Carbon Reduction Action Planning</h1>
<h2>Setting Effective Reduction Targets</h2>
<h3>Science-Based Targets (SBTi)</h3>
<p>Aligned with limiting global warming to 1.5°C:</p>
<ul>
<li>Near-term: 42-50% reduction by 2030</li>
<li>Long-term: Net-zero by 2050</li>
</ul>
<h2>Building Your Abatement Cost Curve</h2>
<p>Rank emission reduction opportunities by cost-effectiveness. Calculate for each initiative: emissions reduction, implementation cost, annual savings, cost per tonne.</p>
<h2>Prioritization Framework</h2>
<p>Score initiatives on: Emissions Impact, Cost-Effectiveness, Implementation Ease, Co-Benefits, Risk</p>
<h2>Implementation Roadmap</h2>
<p><strong>Year 1:</strong> Quick wins (10-15% reduction) - LED, HVAC, behavioral changes</p>
<p><strong>Year 2:</strong> Strategic investments (15-20% additional) - Solar, equipment upgrades, green power</p>
<p><strong>Year 3-5:</strong> Transformation (20-30% additional) - Electrification, EV fleet, supply chain collaboration</p>`,
    level: 2,
    orderInLevel: 3,
    duration: 70,
    completionCriteria: { type: 'assessment', passingScore: 80 },
    resources: [
      { title: 'Science Based Targets Guide', url: 'https://sciencebasedtargets.org/', type: 'link' }
    ],
  },
  {
    courseId: 'CRS000008',
    title: 'Stakeholder Engagement & Climate Communications',
    description: 'Master the art of communicating your carbon reduction efforts to stakeholders. Build support and drive engagement across your organization.',
    content: `<h1>Stakeholder Engagement & Climate Communications</h1>
<h2>Understanding Your Stakeholders</h2>
<h3>Internal:</h3>
<ul>
<li>Leadership: Interested in risk, ROI, reputation</li>
<li>Employees: Purpose, pride, how they can help</li>
<li>Operations: Practical implementation</li>
</ul>
<h3>External:</h3>
<ul>
<li>Customers: Product footprint, company values</li>
<li>Investors: Climate risk, strategy, governance</li>
<li>Suppliers: Requirements, collaboration</li>
</ul>
<h2>Communication Strategy Principles</h2>
<ol>
<li>Transparency: Share successes AND challenges</li>
<li>Credibility: Use verified data</li>
<li>Consistency: Regular updates, aligned messaging</li>
<li>Relevance: Tailor to audience</li>
<li>Actionability: Provide clear calls to action</li>
</ol>
<h2>Avoiding Greenwashing</h2>
<p>Use specific measurable claims, third-party verification, Scope 1+2+3 reporting, science-based targets, transparent challenges.</p>`,
    level: 2,
    orderInLevel: 4,
    duration: 60,
    completionCriteria: { type: 'quiz', passingScore: 70 },
    resources: [
      { title: 'CDP Reporting Guide', url: 'https://www.cdp.net/en/guidance', type: 'link' }
    ],
  },

  // Level 3: Transformation & Net Zero Leadership
  {
    courseId: 'CRS000009',
    title: 'Net Zero Strategy & Carbon Offsetting',
    description: 'Develop a comprehensive net zero strategy. Understand carbon offsetting, carbon removal, and achieving true climate neutrality.',
    content: `<h1>Net Zero Strategy & Carbon Offsetting</h1>
<h2>Understanding Net Zero</h2>
<p>Net zero means reducing emissions as much as possible (typically 90%+) and balancing remaining emissions with carbon removal, achieving net zero CO2 by 2050.</p>
<h2>Net Zero vs Carbon Neutral</h2>
<p><strong>Carbon Neutral:</strong> Can offset ALL emissions, may not require deep reductions</p>
<p><strong>Net Zero:</strong> MUST reduce 90%+ of emissions, only offset residual, science-based pathway</p>
<h2>The Net Zero Pathway</h2>
<ul>
<li>2030: 50% reduction (science-based target)</li>
<li>2040: 80% reduction</li>
<li>2050: 90%+ reduction + carbon removal for residuals = Net Zero</li>
</ul>
<h2>Deep Decarbonization Strategies</h2>
<p><strong>Electrification:</strong> Heat pumps, electric vehicles, electric industrial processes</p>
<p><strong>Green Hydrogen:</strong> High-temperature heat, heavy transport, chemical feedstock</p>
<p><strong>Carbon Capture:</strong> Hard-to-abate sectors like cement, steel</p>
<p><strong>Circular Economy:</strong> Design for longevity, reuse, recycling</p>
<h2>Carbon Removal Types</h2>
<p><strong>Nature-Based:</strong> Afforestation, soil carbon, blue carbon, biochar</p>
<p><strong>Technology-Based:</strong> Direct air capture, BECCS, enhanced weathering</p>`,
    level: 3,
    orderInLevel: 1,
    duration: 75,
    completionCriteria: { type: 'assessment', passingScore: 85 },
    resources: [
      { title: 'SBTi Net Zero Standard', url: 'https://sciencebasedtargets.org/net-zero', type: 'link' }
    ],
  },
  {
    courseId: 'CRS000010',
    title: 'Climate Risk Assessment & Adaptation',
    description: 'Understand climate-related risks to your business. Learn TCFD framework and develop climate resilience strategies.',
    content: `<h1>Climate Risk Assessment & Adaptation</h1>
<h2>Understanding Climate Risks</h2>
<h3>Physical Risks</h3>
<p><strong>Acute:</strong> Extreme weather, floods, wildfires, storms</p>
<p><strong>Chronic:</strong> Rising temperatures, water scarcity, sea level rise</p>
<h3>Transition Risks</h3>
<p><strong>Policy:</strong> Carbon pricing, regulations, litigation</p>
<p><strong>Technology:</strong> Stranded assets, low-carbon alternatives</p>
<p><strong>Market:</strong> Customer preferences, supply disruptions</p>
<p><strong>Reputation:</strong> Stakeholder expectations, brand damage</p>
<h2>TCFD Framework</h2>
<p>Four core elements: Governance, Strategy, Risk Management, Metrics & Targets</p>
<h2>Conducting Risk Assessment</h2>
<ol>
<li>Identify risks (physical and transition)</li>
<li>Evaluate impact and likelihood</li>
<li>Scenario analysis (2°C, 3°C+ scenarios)</li>
<li>Develop adaptation strategies</li>
<li>Disclose findings</li>
</ol>
<h2>Climate Adaptation Strategies</h2>
<p>Infrastructure resilience, supply chain diversification, business continuity planning, water efficiency, flood barriers.</p>`,
    level: 3,
    orderInLevel: 2,
    duration: 80,
    completionCriteria: { type: 'quiz', passingScore: 80 },
    resources: [
      { title: 'TCFD Recommendations', url: 'https://www.fsb-tcfd.org/recommendations/', type: 'link' }
    ],
  },
  {
    courseId: 'CRS000011',
    title: 'Sustainable Innovation & Green Product Development',
    description: 'Drive innovation for sustainability. Learn to develop low-carbon products, implement circular economy, and create business value.',
    content: `<h1>Sustainable Innovation & Green Product Development</h1>
<h2>Life Cycle Assessment (LCA)</h2>
<p>Measure environmental impact across product life: raw materials, manufacturing, transportation, use phase, end-of-life.</p>
<h2>Eco-Design Principles</h2>
<ol>
<li>Design for Longevity: Durable materials, timeless design, repairability</li>
<li>Design for Disassembly: Easy separation, snap-fit, standard components</li>
<li>Material Selection: Recycled content, recyclability, renewable, low toxicity</li>
<li>Design for Zero Waste: Minimal packaging, reusable packaging</li>
<li>Design for Energy Efficiency: Passive design, smart controls</li>
</ol>
<h2>Circular Economy Strategies</h2>
<p><strong>Product-as-a-Service:</strong> Sell function not ownership</p>
<p><strong>Sharing Platforms:</strong> Maximize asset utilization</p>
<p><strong>Refurbishment:</strong> Restore to like-new condition</p>
<p><strong>Recycling/Upcycling:</strong> Material recovery and value creation</p>
<h2>Emerging Sustainable Materials</h2>
<p>Mycelium, algae, agricultural waste, recycled materials, carbon-negative materials</p>`,
    level: 3,
    orderInLevel: 3,
    duration: 85,
    completionCriteria: { type: 'assessment', passingScore: 85 },
    resources: [
      { title: 'Circular Economy Guide', url: 'https://www.ellenmacarthurfoundation.org/', type: 'link' }
    ],
  },
  {
    courseId: 'CRS000012',
    title: 'Leading the Climate Transformation',
    description: 'Become a climate leader. Drive organizational change, influence policy, and contribute to systemic transformation.',
    content: `<h1>Leading the Climate Transformation</h1>
<h2>Characteristics of Climate Leaders</h2>
<ol>
<li>Vision & Purpose: Articulate compelling climate future</li>
<li>Systems Thinking: Understand interconnections</li>
<li>Authenticity & Integrity: Walk the talk</li>
<li>Courage & Resilience: Challenge status quo</li>
<li>Collaboration & Influence: Build coalitions</li>
</ol>
<h2>Building Internal Momentum</h2>
<p>Secure executive buy-in with business case: risk mitigation, opportunity capture, strategic alignment</p>
<p>Engage middle management: make it relevant, provide support, create ownership</p>
<p>Inspire employees: make it personal, easy, social, meaningful</p>
<h2>Change Management Framework</h2>
<ol>
<li>Create urgency</li>
<li>Form guiding coalition</li>
<li>Develop vision & strategy</li>
<li>Communicate frequently</li>
<li>Empower action</li>
<li>Generate short-term wins</li>
<li>Consolidate & build</li>
<li>Anchor in culture</li>
</ol>
<h2>Industry Leadership</h2>
<p>Join sector initiatives (RE100, SBTi), value chain collaboration, cross-sector partnerships</p>
<h2>Policy Engagement</h2>
<p>Direct advocacy, indirect influence, align lobbying with climate position</p>
<h2>Your Legacy</h2>
<p>Define what change you want to create, who benefits, what will be different because you acted.</p>`,
    level: 3,
    orderInLevel: 4,
    duration: 90,
    completionCriteria: { type: 'assessment', passingScore: 90 },
    resources: [
      { title: 'We Mean Business Coalition', url: 'https://www.wemeanbusinesscoalition.org/', type: 'link' },
      { title: 'Project Drawdown', url: 'https://drawdown.org/', type: 'link' }
    ],
  },
];

async function seedCourses() {
  try {
    console.log('🌱 Starting to seed courses...');

    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find an admin user to assign as creator
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      throw new Error('No admin user found. Please seed users first.');
    }
    console.log(`✅ Found admin user: ${adminUser.email}`);

    // Delete existing courses
    const deleteResult = await Course.deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing courses`);

    // Insert new courses with slug generation
    const coursesWithCreator = courses.map(course => ({
      ...course,
      slug: course.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''),
      createdBy: adminUser._id,
      isActive: true,
    }));

    const createdCourses = await Course.insertMany(coursesWithCreator);
    console.log(`✅ Created ${createdCourses.length} courses`);

    // Summary by level
    const level1 = createdCourses.filter(c => c.level === 1).length;
    const level2 = createdCourses.filter(c => c.level === 2).length;
    const level3 = createdCourses.filter(c => c.level === 3).length;

    console.log('\n📊 Course Summary:');
    console.log(`   Level 1 (Foundation & Measurement): ${level1} courses`);
    console.log(`   Level 2 (Efficiency & Integration): ${level2} courses`);
    console.log(`   Level 3 (Transformation & Net Zero): ${level3} courses`);
    console.log(`   Total: ${createdCourses.length} courses\n`);

    console.log('🎉 Course seeding completed successfully!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding courses:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedCourses();
}

export default seedCourses;
