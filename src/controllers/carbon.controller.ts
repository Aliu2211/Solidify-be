import { Response } from 'express';
import { AuthRequest } from '../types';
import { CarbonEntry, EmissionFactor, SustainabilityRoadmap, SustainabilityGoal, Organization } from '../models';
import { ApiResponseUtil } from '../utils/response';
import { Helpers } from '../utils/helpers';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, ROADMAP_MILESTONES } from '../utils/constants';
import { asyncHandler } from '../middleware/errorHandler';

export class CarbonController {
  /**
   * Create carbon entry
   */
  static createEntry = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { entryDate, entryType, quantity, unit, emissionFactorId, sustainabilityLevel, notes } = req.body;
    const organizationId = req.user!.organization;

    // Get emission factor
    const emissionFactor = await EmissionFactor.findById(emissionFactorId);
    if (!emissionFactor) {
      return ApiResponseUtil.notFound(res, ERROR_MESSAGES.EMISSION_FACTOR_NOT_FOUND);
    }

    // Calculate CO2 equivalent
    const co2Equivalent = Helpers.calculateCO2Equivalent(quantity, emissionFactor.factorValue);

    // Get organization's current level if not provided
    let level = sustainabilityLevel;
    if (!level) {
      const org = await Organization.findById(organizationId);
      level = org?.sustainabilityLevel || 1;
    }

    const entry = await CarbonEntry.create({
      organization: organizationId,
      sustainabilityLevel: level,
      entryDate,
      entryType,
      quantity,
      unit,
      emissionFactor: emissionFactorId,
      co2Equivalent,
      notes,
      createdBy: req.user!.id,
    });

    await entry.populate('emissionFactor');

    return ApiResponseUtil.created(res, SUCCESS_MESSAGES.ENTRY_CREATED, entry);
  });

  /**
   * Get carbon entries
   */
  static getEntries = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { level, startDate, endDate, entryType, page = 1, limit = 10 } = req.query;
    const organizationId = req.user!.organization;

    const query: any = { organization: organizationId };

    if (level) query.sustainabilityLevel = parseInt(level as string);
    if (entryType) query.entryType = entryType;
    if (startDate || endDate) {
      query.entryDate = {};
      if (startDate) query.entryDate.$gte = new Date(startDate as string);
      if (endDate) query.entryDate.$lte = new Date(endDate as string);
    }

    const { skip, limit: limitNum } = Helpers.getPagination(Number(page), Number(limit));

    const [entries, total] = await Promise.all([
      CarbonEntry.find(query)
        .populate('emissionFactor')
        .populate('createdBy', 'firstName lastName')
        .sort({ entryDate: -1 })
        .skip(skip)
        .limit(limitNum),
      CarbonEntry.countDocuments(query),
    ]);

    return ApiResponseUtil.paginated(
      res,
      'Carbon entries retrieved successfully',
      entries,
      Number(page),
      limitNum,
      total
    );
  });

  /**
   * Get dashboard analytics
   */
  static getDashboard = asyncHandler(async (req: AuthRequest, res: Response) => {
    const organizationId = req.user!.organization;

    // Get total emissions
    const totalEmissions = await CarbonEntry.aggregate([
      { $match: { organization: organizationId } },
      { $group: { _id: null, total: { $sum: '$co2Equivalent' } } },
    ]);

    // Get emissions by type
    const byType = await CarbonEntry.aggregate([
      { $match: { organization: organizationId } },
      { $group: { _id: '$entryType', total: { $sum: '$co2Equivalent' } } },
    ]);

    // Get monthly trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrend = await CarbonEntry.aggregate([
      { $match: { organization: organizationId, entryDate: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$entryDate' } },
          total: { $sum: '$co2Equivalent' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get roadmap
    const roadmap = await SustainabilityRoadmap.findOne({ organization: organizationId });

    // Get active goals
    const goals = await SustainabilityGoal.find({
      organization: organizationId,
      status: 'in_progress',
    });

    return ApiResponseUtil.success(res, 'Dashboard data retrieved successfully', {
      totalEmissions: totalEmissions[0]?.total || 0,
      emissionsByType: byType,
      monthlyTrend,
      roadmap,
      activeGoals: goals,
    });
  });

  /**
   * Get/Create roadmap
   */
  static getRoadmap = asyncHandler(async (req: AuthRequest, res: Response) => {
    const organizationId = req.user!.organization;

    let roadmap = await SustainabilityRoadmap.findOne({ organization: organizationId });

    if (!roadmap) {
      // Create initial roadmap
      roadmap = await SustainabilityRoadmap.create({
        organization: organizationId,
        currentLevel: 1,
        milestones: ROADMAP_MILESTONES.map(m => ({
          number: m.number,
          title: m.title,
          description: m.description,
          completed: false,
        })),
        progressPercentage: 0,
      });
    }

    return ApiResponseUtil.success(res, 'Roadmap retrieved successfully', roadmap);
  });

  /**
   * Update roadmap milestone
   */
  static updateMilestone = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { milestoneNumber, completed } = req.body;
    const organizationId = req.user!.organization;

    const roadmap = await SustainabilityRoadmap.findOne({ organization: organizationId });

    if (!roadmap) {
      return ApiResponseUtil.notFound(res, 'Roadmap not found');
    }

    const milestone = roadmap.milestones.find(m => m.number === milestoneNumber);
    if (!milestone) {
      return ApiResponseUtil.notFound(res, 'Milestone not found');
    }

    milestone.completed = completed;
    if (completed) {
      milestone.completedAt = new Date();
    } else {
      milestone.completedAt = undefined;
    }

    await roadmap.save();

    return ApiResponseUtil.success(res, SUCCESS_MESSAGES.ROADMAP_UPDATED, roadmap);
  });

  /**
   * Create sustainability goal
   */
  static createGoal = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { level, targetYear, targetReductionPercentage, description } = req.body;
    const organizationId = req.user!.organization;

    const goal = await SustainabilityGoal.create({
      organization: organizationId,
      level,
      targetYear,
      targetReductionPercentage,
      description,
      status: 'in_progress',
    });

    return ApiResponseUtil.created(res, SUCCESS_MESSAGES.GOAL_CREATED, goal);
  });

  /**
   * Get emission factors
   */
  static getEmissionFactors = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { level, category } = req.query;

    const query: any = { isActive: true };
    if (level) query.sustainabilityLevel = parseInt(level as string);
    if (category) query.category = category;

    const factors = await EmissionFactor.find(query).sort({ category: 1 });

    return ApiResponseUtil.success(res, 'Emission factors retrieved successfully', factors);
  });
}
