import { Response } from 'express';
import { LibraryResource } from '../models/library.model';
import { UserFavorite } from '../models/userFavorite.model';
import { AuthRequest } from '../types';
import Organization from '../models/Organization';

export class LibraryController {
  /**
   * Create a new library resource (Admin only)
   */
  static async createResource(req: AuthRequest, res: Response): Promise<void> {
    try {
      const resourceData = {
        ...req.body,
        uploadedBy: req.user!.id,
      };

      const resource = await LibraryResource.create(resourceData);

      res.status(201).json({
        success: true,
        message: 'Library resource created successfully',
        data: resource,
      });
    } catch (error: any) {
      if (error.code === 11000) {
        res.status(409).json({
          success: false,
          message: 'Resource with this ID already exists',
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: 'Failed to create library resource',
        error: error.message,
      });
    }
  }

  /**
   * Get all library resources with filtering
   */
  static async getResources(req: AuthRequest, res: Response): Promise<void> {
    try {
      const {
        category,
        tags,
        level,
        fileType,
        industry,
        isFeatured,
        isPremium,
        search,
        page = 1,
        limit = 20,
      } = req.query;

      const query: any = { isActive: true };

      // Apply filters
      if (category) query.category = category;
      if (level) query.level = parseInt(level as string);
      if (fileType) query.fileType = fileType;
      if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';
      if (isPremium !== undefined) query.isPremium = isPremium === 'true';

      // Array filters
      if (tags) {
        const tagArray = (tags as string).split(',').map(t => t.trim());
        query.tags = { $in: tagArray };
      }
      if (industry) {
        const industryArray = (industry as string).split(',').map(i => i.trim());
        query.industry = { $in: industryArray };
      }

      // Text search
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } },
        ];
      }

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const [resources, total] = await Promise.all([
        LibraryResource.find(query)
          .populate('uploadedBy', 'firstName lastName email')
          .sort({ publishedDate: -1 })
          .skip(skip)
          .limit(limitNum)
          .lean(),
        LibraryResource.countDocuments(query),
      ]);

      res.status(200).json({
        success: true,
        message: 'Library resources retrieved successfully',
        data: resources,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve library resources',
        error: error.message,
      });
    }
  }

  /**
   * Get single resource by ID
   */
  static async getResourceById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const resource = await LibraryResource.findById(id)
        .populate('uploadedBy', 'firstName lastName email')
        .lean();

      if (!resource) {
        res.status(404).json({
          success: false,
          message: 'Library resource not found',
        });
        return;
      }

      // Increment view count
      await LibraryResource.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });

      res.status(200).json({
        success: true,
        message: 'Library resource retrieved successfully',
        data: resource,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve library resource',
        error: error.message,
      });
    }
  }

  /**
   * Update library resource (Admin only)
   */
  static async updateResource(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Don't allow updating uploadedBy or resourceId
      delete updates.uploadedBy;
      delete updates.resourceId;

      const resource = await LibraryResource.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      }).populate('uploadedBy', 'firstName lastName email');

      if (!resource) {
        res.status(404).json({
          success: false,
          message: 'Library resource not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Library resource updated successfully',
        data: resource,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to update library resource',
        error: error.message,
      });
    }
  }

  /**
   * Delete library resource (Admin only - soft delete)
   */
  static async deleteResource(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const resource = await LibraryResource.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!resource) {
        res.status(404).json({
          success: false,
          message: 'Library resource not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Library resource deleted successfully',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete library resource',
        error: error.message,
      });
    }
  }

  /**
   * Download resource (track download count)
   */
  static async downloadResource(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const resource = await LibraryResource.findById(id);

      if (!resource || !resource.isActive) {
        res.status(404).json({
          success: false,
          message: 'Library resource not found',
        });
        return;
      }

      // Check if premium resource and user has access
      if (resource.isPremium) {
        const org = await Organization.findById(req.user!.organization);
        // Add your premium tier check logic here if needed
        // For now, we'll allow all authenticated users
      }

      // Increment download count
      await LibraryResource.findByIdAndUpdate(id, { $inc: { downloadCount: 1 } });

      res.status(200).json({
        success: true,
        message: 'Download URL retrieved successfully',
        data: {
          fileUrl: resource.fileUrl,
          fileName: resource.title,
          fileType: resource.fileType,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to download resource',
        error: error.message,
      });
    }
  }

  /**
   * Add resource to favorites
   */
  static async addFavorite(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Check if resource exists
      const resource = await LibraryResource.findById(id);
      if (!resource || !resource.isActive) {
        res.status(404).json({
          success: false,
          message: 'Library resource not found',
        });
        return;
      }

      // Check if already favorited
      const existingFavorite = await UserFavorite.findOne({
        user: req.user!.id,
        resource: id,
      });

      if (existingFavorite) {
        res.status(400).json({
          success: false,
          message: 'Resource already in favorites',
        });
        return;
      }

      const favorite = await UserFavorite.create({
        user: req.user!.id,
        resource: id,
        organization: req.user!.organization,
      });

      res.status(201).json({
        success: true,
        message: 'Resource added to favorites',
        data: favorite,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to add favorite',
        error: error.message,
      });
    }
  }

  /**
   * Remove resource from favorites
   */
  static async removeFavorite(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const favorite = await UserFavorite.findOneAndDelete({
        user: req.user!.id,
        resource: id,
      });

      if (!favorite) {
        res.status(404).json({
          success: false,
          message: 'Favorite not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Resource removed from favorites',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to remove favorite',
        error: error.message,
      });
    }
  }

  /**
   * Get user's favorite resources
   */
  static async getMyFavorites(req: AuthRequest, res: Response): Promise<void> {
    try {
      const favorites = await UserFavorite.find({ user: req.user!.id })
        .populate({
          path: 'resource',
          populate: {
            path: 'uploadedBy',
            select: 'firstName lastName email',
          },
        })
        .sort({ createdAt: -1 })
        .lean();

      res.status(200).json({
        success: true,
        message: 'Favorites retrieved successfully',
        data: favorites,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve favorites',
        error: error.message,
      });
    }
  }

  /**
   * Get popular resources (most downloaded)
   */
  static async getPopularResources(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { limit = 10 } = req.query;

      const resources = await LibraryResource.find({ isActive: true })
        .populate('uploadedBy', 'firstName lastName email')
        .sort({ downloadCount: -1, viewCount: -1 })
        .limit(parseInt(limit as string))
        .lean();

      res.status(200).json({
        success: true,
        message: 'Popular resources retrieved successfully',
        data: resources,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve popular resources',
        error: error.message,
      });
    }
  }

  /**
   * Get recently added resources
   */
  static async getRecentResources(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { limit = 10 } = req.query;

      const resources = await LibraryResource.find({ isActive: true })
        .populate('uploadedBy', 'firstName lastName email')
        .sort({ publishedDate: -1 })
        .limit(parseInt(limit as string))
        .lean();

      res.status(200).json({
        success: true,
        message: 'Recent resources retrieved successfully',
        data: resources,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve recent resources',
        error: error.message,
      });
    }
  }

  /**
   * Get recommended resources based on user's level
   */
  static async getRecommendedResources(req: AuthRequest, res: Response): Promise<void> {
    try {
      const org = await Organization.findById(req.user!.organization);

      if (!org) {
        res.status(404).json({
          success: false,
          message: 'Organization not found',
        });
        return;
      }

      const currentLevel = org.sustainabilityLevel;

      // Get resources for current level and featured resources
      const resources = await LibraryResource.find({
        isActive: true,
        $or: [{ level: currentLevel }, { isFeatured: true }, { level: { $exists: false } }],
      })
        .populate('uploadedBy', 'firstName lastName email')
        .sort({ isFeatured: -1, downloadCount: -1 })
        .limit(15)
        .lean();

      res.status(200).json({
        success: true,
        message: 'Recommended resources retrieved successfully',
        data: resources,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve recommended resources',
        error: error.message,
      });
    }
  }

  /**
   * Get all categories with resource counts
   */
  static async getCategories(req: AuthRequest, res: Response): Promise<void> {
    try {
      const categories = await LibraryResource.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]);

      res.status(200).json({
        success: true,
        message: 'Categories retrieved successfully',
        data: categories,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve categories',
        error: error.message,
      });
    }
  }
}
