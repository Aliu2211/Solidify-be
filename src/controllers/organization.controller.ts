import { Response } from 'express';
import { AuthRequest } from '../types';
import { asyncHandler } from '../middleware/errorHandler';
import { ApiResponseUtil } from '../utils/response';
import Organization from '../models/Organization';

export class OrganizationController {
  /**
   * Get all organizations
   */
  static getAllOrganizations = asyncHandler(async (_req: AuthRequest, res: Response) => {
    const organizations = await Organization.find({}).select('-__v');

    return ApiResponseUtil.success(res, 'Organizations retrieved successfully', organizations);
  });

  /**
   * Get single organization
   */
  static getOrganization = asyncHandler(async (req: AuthRequest, res: Response) => {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return ApiResponseUtil.notFound(res, 'Organization not found');
    }

    return ApiResponseUtil.success(res, 'Organization retrieved successfully', organization);
  });

  /**
   * Create new organization (Admin only)
   */
  static createOrganization = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { name, industryType, size, location, registrationNumber, description, website, logoUrl } = req.body;

    // Check if organization with same name or registration number exists
    const existingOrg = await Organization.findOne({
      $or: [
        { name: { $regex: new RegExp(`^${name}$`, 'i') } },
        { registrationNumber: registrationNumber.toUpperCase() }
      ]
    });

    if (existingOrg) {
      return ApiResponseUtil.badRequest(res, 'Organization with this name or registration number already exists');
    }

    const organization = await Organization.create({
      name,
      industryType,
      size,
      location,
      registrationNumber: registrationNumber.toUpperCase(),
      description,
      website,
      logoUrl
    });

    return ApiResponseUtil.created(res, 'Organization created successfully', organization);
  });

  /**
   * Update organization (Admin only)
   */
  static updateOrganization = asyncHandler(async (req: AuthRequest, res: Response) => {
    const organization = await Organization.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!organization) {
      return ApiResponseUtil.notFound(res, 'Organization not found');
    }

    return ApiResponseUtil.success(res, 'Organization updated successfully', organization);
  });

  /**
   * Delete organization (Admin only)
   */
  static deleteOrganization = asyncHandler(async (req: AuthRequest, res: Response) => {
    const organization = await Organization.findByIdAndDelete(req.params.id);

    if (!organization) {
      return ApiResponseUtil.notFound(res, 'Organization not found');
    }

    return ApiResponseUtil.success(res, 'Organization deleted successfully');
  });
}
