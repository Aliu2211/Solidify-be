import { Response } from 'express';
import { AuthRequest } from '../types';
import { KnowledgeArticle } from '../models';
import { ApiResponseUtil } from '../utils/response';
import { Helpers } from '../utils/helpers';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/constants';
import { asyncHandler } from '../middleware/errorHandler';

export class KnowledgeController {
  /**
   * Get all articles
   */
  static getArticles = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { level, category, featured, page = 1, limit = 10 } = req.query;

    const query: any = { status: 'published' };
    if (level) query.sustainabilityLevel = parseInt(level as string);
    if (category) query.category = category;
    if (featured) query.featured = featured === 'true';

    const { skip, limit: limitNum } = Helpers.getPagination(Number(page), Number(limit));

    const [articles, total] = await Promise.all([
      KnowledgeArticle.find(query)
        .populate('author', 'firstName lastName')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limitNum),
      KnowledgeArticle.countDocuments(query),
    ]);

    return ApiResponseUtil.paginated(
      res,
      'Articles retrieved successfully',
      articles,
      Number(page),
      limitNum,
      total
    );
  });

  /**
   * Get single article by slug
   */
  static getArticle = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { slug } = req.params;

    const article = await KnowledgeArticle.findOne({ slug, status: 'published' })
      .populate('author', 'firstName lastName');

    if (!article) {
      return ApiResponseUtil.notFound(res, ERROR_MESSAGES.ARTICLE_NOT_FOUND);
    }

    // Increment view count
    article.viewCount += 1;
    await article.save();

    return ApiResponseUtil.success(res, 'Article retrieved successfully', article);
  });

  /**
   * Create article (Admin/Manager only)
   */
  static createArticle = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { title, content, summary, sustainabilityLevel, category, tags, featured } = req.body;

    const slug = Helpers.generateSlug(title);

    const article = await KnowledgeArticle.create({
      title,
      slug,
      content,
      summary,
      sustainabilityLevel,
      category,
      tags,
      featured,
      author: req.user!.id,
      status: 'published',
      publishedAt: new Date(),
    });

    return ApiResponseUtil.created(res, SUCCESS_MESSAGES.ARTICLE_CREATED, article);
  });

  /**
   * Search articles
   */
  static searchArticles = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { q, level, page = 1, limit = 10 } = req.query;

    const query: any = { status: 'published' };

    if (q) {
      query.$text = { $search: q as string };
    }

    if (level) {
      query.sustainabilityLevel = parseInt(level as string);
    }

    const { skip, limit: limitNum } = Helpers.getPagination(Number(page), Number(limit));

    const [articles, total] = await Promise.all([
      KnowledgeArticle.find(query)
        .populate('author', 'firstName lastName')
        .sort({ score: { $meta: 'textScore' } })
        .skip(skip)
        .limit(limitNum),
      KnowledgeArticle.countDocuments(query),
    ]);

    return ApiResponseUtil.paginated(
      res,
      'Search results',
      articles,
      Number(page),
      limitNum,
      total
    );
  });
}
