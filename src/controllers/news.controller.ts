import { Response } from 'express';
import { AuthRequest } from '../types';
import { NewsArticle } from '../models';
import { ApiResponseUtil } from '../utils/response';
import { Helpers } from '../utils/helpers';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/constants';
import { asyncHandler } from '../middleware/errorHandler';

export class NewsController {
  /**
   * Get all news articles
   */
  static getNews = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { category, featured, page = 1, limit = 10 } = req.query;

    const query: any = { status: 'published' };
    if (category) query.category = category;
    if (featured) query.featured = featured === 'true';

    const { skip, limit: limitNum } = Helpers.getPagination(Number(page), Number(limit));

    const [articles, total] = await Promise.all([
      NewsArticle.find(query)
        .populate('author', 'firstName lastName')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limitNum),
      NewsArticle.countDocuments(query),
    ]);

    return ApiResponseUtil.paginated(
      res,
      'News articles retrieved successfully',
      articles,
      Number(page),
      limitNum,
      total
    );
  });

  /**
   * Get single news article
   */
  static getNewsArticle = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { slug } = req.params;

    const article = await NewsArticle.findOne({ slug, status: 'published' })
      .populate('author', 'firstName lastName');

    if (!article) {
      return ApiResponseUtil.notFound(res, ERROR_MESSAGES.NEWS_NOT_FOUND);
    }

    article.viewCount += 1;
    await article.save();

    return ApiResponseUtil.success(res, 'News article retrieved successfully', article);
  });

  /**
   * Create news article (Admin only)
   */
  static createNews = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { title, content, summary, imageUrl, category, tags, source, sourceUrl, featured } = req.body;

    const slug = Helpers.generateSlug(title);

    const article = await NewsArticle.create({
      title,
      slug,
      content,
      summary,
      imageUrl,
      category,
      tags,
      source,
      sourceUrl,
      featured,
      author: req.user!.id,
      status: 'published',
      publishedAt: new Date(),
    });

    return ApiResponseUtil.created(res, SUCCESS_MESSAGES.NEWS_CREATED, article);
  });
}
