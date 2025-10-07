import swaggerJsdoc from 'swagger-jsdoc';
import config from './environment';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Solidify API - SME Carbon Management Platform',
    version: '1.0.0',
    description: `
      Solidify is a comprehensive SME Carbon Management Platform designed for businesses in Ghana.
      This API provides endpoints for carbon footprint tracking, inter-organizational chat,
      knowledge base management, and sustainability news.

      **Features:**
      - 🔐 JWT Authentication with Access & Refresh Tokens
      - 💬 Real-time Chat with Socket.io
      - 📊 Carbon Footprint Tracking (Scope 1, 2, 3)
      - 📚 Knowledge Base & Resources
      - 📰 Sustainability News Feed
      - 🎯 3-Level Sustainability System (Foundation, Efficiency, Transformation)
      - 🏢 Multi-organization Support

      **Getting Started:**
      1. **Login:** Use credentials: \`admin@solidify.com\` / \`Admin1234\`
      2. **Authorize:** Copy ONLY the accessToken (without "Bearer") and click "Authorize" 🔓 button above
      3. **Paste Token:** In the dialog, just paste the token - Swagger adds "Bearer" automatically
      4. **Get Organizations:** Use \`GET /organizations\` or \`GET /auth/organizations\` to see available orgs
      5. **Create/Register:** Now you can create new organizations or register new users

      **Available Organizations (from seed data):**
      - Electroland Ghana Ltd: \`68e4fddf48b66e92d9ef1f88\`
      - Hisense Ghana: \`68e4fddf48b66e92d9ef1f89\`

      **Author:** Jehiel Britstot Houmanou (BSc Capstone Project - June 2025)
    `,
    contact: {
      name: 'Solidify Support',
      email: 'aliutijani21@gmail.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.PORT}/api/${config.API_VERSION}`,
      description: 'Development server',
    },
    {
      url: `https://solidify-api.onrender.com/api/${config.API_VERSION}`,
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Just paste your access token (WITHOUT "Bearer" prefix - Swagger adds it automatically)',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'Error message',
          },
          errors: {
            type: 'array',
            items: {
              type: 'object',
            },
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '507f1f77bcf86cd799439011',
          },
          userId: {
            type: 'string',
            example: 'USR001',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'john.doe@company.com',
          },
          firstName: {
            type: 'string',
            example: 'John',
          },
          lastName: {
            type: 'string',
            example: 'Doe',
          },
          role: {
            type: 'string',
            enum: ['admin', 'manager', 'user'],
            example: 'user',
          },
          organization: {
            type: 'string',
            example: '507f1f77bcf86cd799439011',
          },
          avatarUrl: {
            type: 'string',
            nullable: true,
            example: 'https://res.cloudinary.com/demo/image/upload/avatar.jpg',
          },
          isActive: {
            type: 'boolean',
            example: true,
          },
          emailVerified: {
            type: 'boolean',
            example: false,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      Organization: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
          },
          name: {
            type: 'string',
            example: 'Eco Solutions Ghana',
          },
          industryType: {
            type: 'string',
            example: 'Manufacturing',
          },
          size: {
            type: 'string',
            enum: ['small', 'medium'],
            example: 'medium',
          },
          location: {
            type: 'string',
            example: 'Accra, Greater Accra, Ghana',
          },
          registrationNumber: {
            type: 'string',
            example: 'GH-123456789',
          },
          description: {
            type: 'string',
            nullable: true,
          },
          website: {
            type: 'string',
            nullable: true,
          },
          logoUrl: {
            type: 'string',
            nullable: true,
          },
          sustainabilityLevel: {
            type: 'number',
            enum: [1, 2, 3],
            example: 1,
          },
          verified: {
            type: 'boolean',
            example: false,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      CarbonEntry: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
          },
          entryId: {
            type: 'string',
            example: 'CE001',
          },
          organization: {
            type: 'string',
          },
          scope: {
            type: 'string',
            enum: ['scope1', 'scope2', 'scope3'],
            example: 'scope1',
          },
          category: {
            type: 'string',
            example: 'Electricity',
          },
          value: {
            type: 'number',
            example: 1500.5,
          },
          unit: {
            type: 'string',
            example: 'kWh',
          },
          co2Emissions: {
            type: 'number',
            example: 750.25,
          },
          period: {
            type: 'object',
            properties: {
              month: { type: 'number', example: 10 },
              year: { type: 'number', example: 2025 },
            },
          },
        },
      },
      Conversation: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
          },
          type: {
            type: 'string',
            enum: ['direct', 'group'],
            example: 'direct',
          },
          name: {
            type: 'string',
            nullable: true,
            example: 'Project Discussion',
          },
          participants: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                user: {
                  type: 'object',
                  properties: {
                    _id: { type: 'string' },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    avatarUrl: { type: 'string', nullable: true },
                  },
                },
                joinedAt: {
                  type: 'string',
                  format: 'date-time',
                },
                lastReadAt: {
                  type: 'string',
                  format: 'date-time',
                  nullable: true,
                },
                isActive: {
                  type: 'boolean',
                },
              },
            },
          },
          lastMessage: {
            type: 'object',
            nullable: true,
            properties: {
              content: { type: 'string' },
              sender: { type: 'string' },
              timestamp: { type: 'string', format: 'date-time' },
            },
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      Message: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
          },
          conversation: {
            type: 'string',
            description: 'Conversation ID',
          },
          sender: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              avatarUrl: { type: 'string', nullable: true },
            },
          },
          content: {
            type: 'string',
            example: 'Hello, how can we collaborate on carbon reduction?',
          },
          messageType: {
            type: 'string',
            enum: ['text', 'file', 'image'],
            example: 'text',
          },
          fileUrl: {
            type: 'string',
            nullable: true,
          },
          fileName: {
            type: 'string',
            nullable: true,
          },
          isDeleted: {
            type: 'boolean',
            default: false,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      KnowledgeArticle: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
          },
          articleId: {
            type: 'string',
            example: 'ART001',
          },
          title: {
            type: 'string',
            example: 'Understanding Scope 1, 2, and 3 Emissions',
          },
          slug: {
            type: 'string',
            example: 'understanding-scope-emissions',
          },
          content: {
            type: 'string',
          },
          category: {
            type: 'string',
            enum: ['carbon-tracking', 'regulations', 'best-practices', 'case-studies', 'tools'],
            example: 'carbon-tracking',
          },
          level: {
            type: 'string',
            enum: ['foundation', 'efficiency', 'transformation'],
            example: 'foundation',
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
            example: ['emissions', 'carbon', 'basics'],
          },
        },
      },
      NewsArticle: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
          },
          newsId: {
            type: 'string',
            example: 'NEWS001',
          },
          title: {
            type: 'string',
            example: 'Ghana Launches New Carbon Credit Initiative',
          },
          slug: {
            type: 'string',
          },
          content: {
            type: 'string',
          },
          excerpt: {
            type: 'string',
          },
          coverImage: {
            type: 'string',
            nullable: true,
          },
          category: {
            type: 'string',
            enum: ['policy', 'technology', 'success-stories', 'events', 'global-trends'],
            example: 'policy',
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
          },
          publishedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    {
      name: 'Authentication',
      description: 'User authentication and authorization endpoints',
    },
    {
      name: 'Organizations',
      description: 'Organization management and CRUD operations',
    },
    {
      name: 'Carbon Tracking',
      description: 'Carbon footprint tracking and reporting',
    },
    {
      name: 'Chat',
      description: 'Inter-organizational messaging',
    },
    {
      name: 'Knowledge Base',
      description: 'Educational resources and articles',
    },
    {
      name: 'News',
      description: 'Sustainability news and updates',
    },
  ],
};

const options: swaggerJsdoc.Options = {
  definition: swaggerDefinition,
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
