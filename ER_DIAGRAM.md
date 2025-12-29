# Entity-Relationship Diagram (ERD)
## Sustainability Carbon Tracking System

---

## 📋 Overview
This document provides a comprehensive Entity-Relationship (ER) diagram structure for the Sustainability Carbon Tracking Backend System. The system manages organizations, users, carbon emissions tracking, sustainability goals, knowledge base, news articles, and real-time chat functionality.

---

## 🗂️ Database Schema

### **1. Organization Entity**
**Collection Name:** `organizations`

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| _id | ObjectId | PRIMARY KEY | Auto-generated unique identifier |
| name | String | Required, Trim | Organization name |
| registrationNumber | String | Required, Unique, Uppercase | Organization registration number |
| industryType | String | Required, Trim | Type of industry |
| size | String (Enum) | Required | Organization size: `small`, `medium` |
| location | String | Required, Trim | Organization location |
| description | String | Optional | Organization description |
| logoUrl | String | Optional | URL to organization logo |
| website | String | Optional | Organization website URL |
| sustainabilityLevel | Number (Enum) | Default: 1 | Current sustainability level: `1`, `2`, `3` |
| verified | Boolean | Default: false | Organization verification status |
| createdAt | Date | Auto-generated | Record creation timestamp |
| updatedAt | Date | Auto-generated | Last update timestamp |

**Indexes:**
- `registrationNumber` (unique)
- `name` (text search)

**Relationships:**
- **ONE-TO-MANY** with User (one organization has many users)
- **ONE-TO-MANY** with CarbonEntry (one organization has many carbon entries)
- **ONE-TO-MANY** with SustainabilityGoal (one organization has many goals)
- **ONE-TO-ONE** with SustainabilityRoadmap (one organization has one roadmap)
- **MANY-TO-MANY** with Conversation (organizations can have multiple conversations)

---

### **2. User Entity**
**Collection Name:** `users`

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| _id | ObjectId | PRIMARY KEY | Auto-generated unique identifier |
| userId | String | Required, Unique, Uppercase | Custom user ID |
| email | String | Required, Unique, Lowercase | User email address |
| password | String | Required, Min: 8, Select: false | Hashed password (bcrypt) |
| firstName | String | Required, Trim | User first name |
| lastName | String | Required, Trim | User last name |
| role | String (Enum) | Default: 'user' | User role: `admin`, `manager`, `user` |
| organization | ObjectId | FOREIGN KEY, Required | Reference to Organization |
| avatarUrl | String | Optional | URL to user avatar |
| isActive | Boolean | Default: true | User active status |
| emailVerified | Boolean | Default: false | Email verification status |
| lastLogin | Date | Optional | Last login timestamp |
| createdAt | Date | Auto-generated | Record creation timestamp |
| updatedAt | Date | Auto-generated | Last update timestamp |

**Virtual Fields:**
- `fullName` - Computed: `firstName + " " + lastName`

**Indexes:**
- `email` (unique)
- `userId` (unique)
- `organization`

**Relationships:**
- **MANY-TO-ONE** with Organization (many users belong to one organization)
- **ONE-TO-MANY** with CarbonEntry (user creates many carbon entries)
- **ONE-TO-MANY** with KnowledgeArticle (user authors many articles)
- **ONE-TO-MANY** with NewsArticle (user authors many news articles)
- **ONE-TO-MANY** with Message (user sends many messages)
- **MANY-TO-MANY** with Conversation (user participates in many conversations)

---

### **3. CarbonEntry Entity**
**Collection Name:** `carbonentries`

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| _id | ObjectId | PRIMARY KEY | Auto-generated unique identifier |
| organization | ObjectId | FOREIGN KEY, Required | Reference to Organization |
| sustainabilityLevel | Number (Enum) | Required | Level at time of entry: `1`, `2`, `3` |
| entryDate | Date | Required | Date of carbon entry |
| entryType | String (Enum) | Required | Entry type: `electricity`, `fuel`, `transport`, `waste`, `water`, `renewable_energy`, `carbon_offset` |
| quantity | Number | Required, Min: 0 | Quantity of resource used |
| unit | String | Required, Trim | Unit of measurement (e.g., kWh, liters, km) |
| emissionFactor | ObjectId | FOREIGN KEY, Required | Reference to EmissionFactor |
| co2Equivalent | Number | Required, Default: 0 | Calculated CO2 equivalent (kg CO2e) |
| notes | String | Optional | Additional notes |
| createdBy | ObjectId | FOREIGN KEY, Required | Reference to User who created entry |
| createdAt | Date | Auto-generated | Record creation timestamp |
| updatedAt | Date | Auto-generated | Last update timestamp |

**Indexes:**
- `organization, entryDate` (compound, descending on entryDate)
- `sustainabilityLevel`
- `entryType`

**Relationships:**
- **MANY-TO-ONE** with Organization (many entries belong to one organization)
- **MANY-TO-ONE** with User (many entries created by one user)
- **MANY-TO-ONE** with EmissionFactor (many entries use one emission factor)

---

### **4. EmissionFactor Entity**
**Collection Name:** `emissionfactors`

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| _id | ObjectId | PRIMARY KEY | Auto-generated unique identifier |
| category | String | Required, Trim | Emission category (e.g., Electricity, Transport) |
| subCategory | String | Optional, Trim | Emission sub-category |
| description | String | Required, Trim | Detailed description of emission factor |
| factorValue | Number | Required | Emission factor value (kg CO2e per unit) |
| unit | String | Required, Trim | Unit of measurement |
| source | String | Required, Trim | Data source (e.g., IPCC, EPA Ghana) |
| region | String | Default: 'Ghana', Trim | Geographic region |
| sustainabilityLevel | Number (Enum) | Required | Applicable level: `1`, `2`, `3` |
| isActive | Boolean | Default: true | Active status |
| createdAt | Date | Auto-generated | Record creation timestamp |
| updatedAt | Date | Auto-generated | Last update timestamp |

**Indexes:**
- `category, sustainabilityLevel` (compound)
- `isActive`

**Relationships:**
- **ONE-TO-MANY** with CarbonEntry (one factor used in many entries)

---

### **5. SustainabilityGoal Entity**
**Collection Name:** `sustainabilitygoals`

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| _id | ObjectId | PRIMARY KEY | Auto-generated unique identifier |
| organization | ObjectId | FOREIGN KEY, Required | Reference to Organization |
| level | Number (Enum) | Required | Goal level: `1`, `2`, `3` |
| targetYear | Number | Required, Min: 2024 | Target year for goal achievement |
| targetReductionPercentage | Number | Required, Range: 0-100 | Target emissions reduction (%) |
| baselineEmissions | Number | Optional, Min: 0 | Baseline emissions (kg CO2e) |
| currentEmissions | Number | Optional, Min: 0 | Current emissions (kg CO2e) |
| status | String (Enum) | Default: 'in_progress' | Goal status: `in_progress`, `achieved`, `failed` |
| description | String | Optional | Goal description |
| createdAt | Date | Auto-generated | Record creation timestamp |
| updatedAt | Date | Auto-generated | Last update timestamp |

**Indexes:**
- `organization, level` (compound)
- `status`

**Relationships:**
- **MANY-TO-ONE** with Organization (many goals belong to one organization)

---

### **6. SustainabilityRoadmap Entity**
**Collection Name:** `sustainabilityroadmaps`

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| _id | ObjectId | PRIMARY KEY | Auto-generated unique identifier |
| organization | ObjectId | FOREIGN KEY, Required, Unique | Reference to Organization |
| currentLevel | Number (Enum) | Default: 1 | Current sustainability level: `1`, `2`, `3` |
| milestones | Array[Milestone] | Embedded documents | Array of milestone objects |
| progressPercentage | Number | Range: 0-100, Default: 0 | Overall progress percentage (auto-calculated) |
| createdAt | Date | Auto-generated | Record creation timestamp |
| updatedAt | Date | Auto-generated | Last update timestamp |

**Milestone Sub-Schema:**
| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| number | Number | Required, Range: 1-6 | Milestone number |
| title | String | Required | Milestone title |
| description | String | Optional | Milestone description |
| completed | Boolean | Default: false | Completion status |
| completedAt | Date | Optional | Completion timestamp |

**Indexes:**
- `organization` (unique)

**Relationships:**
- **ONE-TO-ONE** with Organization (one roadmap per organization)

---

### **7. Conversation Entity**
**Collection Name:** `conversations`

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| _id | ObjectId | PRIMARY KEY | Auto-generated unique identifier |
| conversationId | String | Unique, Auto-generated | Custom conversation ID (e.g., CONV000001) |
| type | String (Enum) | Required | Conversation type: `direct`, `group` |
| name | String | Optional, Trim | Conversation name (for group chats) |
| organizations | Array[ObjectId] | FOREIGN KEY, Required | Array of Organization references |
| participants | Array[Participant] | Embedded documents | Array of participant objects |
| createdBy | ObjectId | FOREIGN KEY, Required | Reference to User who created conversation |
| lastMessage | Object | Optional | Last message details (content, sender, timestamp) |
| isActive | Boolean | Default: true | Conversation active status |
| createdAt | Date | Auto-generated | Record creation timestamp |
| updatedAt | Date | Auto-generated | Last update timestamp |

**Participant Sub-Schema:**
| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| user | ObjectId | FOREIGN KEY, Required | Reference to User |
| organization | ObjectId | FOREIGN KEY, Required | Reference to Organization |
| joinedAt | Date | Default: Date.now | Join timestamp |
| lastReadAt | Date | Optional | Last read timestamp |
| isActive | Boolean | Default: true | Participant active status |

**Indexes:**
- `conversationId` (unique)
- `participants.user`
- `participants.organization`
- `organizations`
- `type`
- `isActive`

**Relationships:**
- **MANY-TO-MANY** with User (many users in many conversations)
- **MANY-TO-MANY** with Organization (many organizations in many conversations)
- **ONE-TO-MANY** with Message (one conversation has many messages)

---

### **8. Message Entity**
**Collection Name:** `messages`

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| _id | ObjectId | PRIMARY KEY | Auto-generated unique identifier |
| messageId | String | Unique, Auto-generated | Custom message ID (e.g., MSG000001) |
| conversation | ObjectId | FOREIGN KEY, Required | Reference to Conversation |
| sender | ObjectId | FOREIGN KEY, Required | Reference to User who sent message |
| messageType | String (Enum) | Default: 'text' | Message type: `text`, `file`, `image` |
| content | String | Required | Message content |
| fileUrl | String | Optional | URL to attached file |
| fileName | String | Optional | Original file name |
| isEdited | Boolean | Default: false | Edit status |
| isDeleted | Boolean | Default: false | Deletion status (soft delete) |
| readBy | Array[ObjectId] | FOREIGN KEY | Array of User references who read message |
| createdAt | Date | Auto-generated | Record creation timestamp |
| updatedAt | Date | Auto-generated | Last update timestamp |

**Indexes:**
- `messageId` (unique)
- `conversation, createdAt` (compound, descending on createdAt)
- `sender`

**Relationships:**
- **MANY-TO-ONE** with Conversation (many messages belong to one conversation)
- **MANY-TO-ONE** with User (many messages sent by one user)
- **MANY-TO-MANY** with User (messages read by multiple users)

---

### **9. KnowledgeArticle Entity**
**Collection Name:** `knowledgearticles`

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| _id | ObjectId | PRIMARY KEY | Auto-generated unique identifier |
| title | String | Required, Trim | Article title |
| slug | String | Required, Unique, Lowercase | URL-friendly slug |
| content | String | Required | Full article content (rich text/markdown) |
| summary | String | Required, Trim, Max: 500 | Article summary |
| sustainabilityLevel | Number (Enum) | Required | Target level: `1`, `2`, `3` |
| category | String | Required, Trim | Article category |
| tags | Array[String] | Optional | Array of tags |
| author | ObjectId | FOREIGN KEY, Required | Reference to User (author) |
| attachments | Array[Attachment] | Embedded documents | Array of attachment objects |
| featured | Boolean | Default: false | Featured article flag |
| viewCount | Number | Default: 0 | Article view count |
| status | String (Enum) | Default: 'draft' | Publication status: `draft`, `published` |
| publishedAt | Date | Optional | Publication timestamp |
| createdAt | Date | Auto-generated | Record creation timestamp |
| updatedAt | Date | Auto-generated | Last update timestamp |

**Attachment Sub-Schema:**
| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| fileName | String | Required | Original file name |
| fileUrl | String | Required | URL to file |
| fileType | String | Required | MIME type |
| uploadedAt | Date | Default: Date.now | Upload timestamp |

**Indexes:**
- `slug` (unique)
- `sustainabilityLevel`
- `status, publishedAt` (compound, descending on publishedAt)
- `title, summary, content` (text search)

**Relationships:**
- **MANY-TO-ONE** with User (many articles authored by one user)

---

### **10. NewsArticle Entity**
**Collection Name:** `newsarticles`

| Field Name | Data Type | Constraints | Description |
|------------|-----------|-------------|-------------|
| _id | ObjectId | PRIMARY KEY | Auto-generated unique identifier |
| title | String | Required, Trim | News title |
| slug | String | Required, Unique, Lowercase | URL-friendly slug |
| content | String | Required | Full news content (rich text/markdown) |
| summary | String | Required, Trim, Max: 500 | News summary |
| imageUrl | String | Optional | URL to featured image |
| category | String (Enum) | Required | News category: `policy`, `technology`, `success-stories`, `events`, `global-trends` |
| tags | Array[String] | Optional | Array of tags |
| author | ObjectId | FOREIGN KEY, Required | Reference to User (author) |
| source | String | Optional | Original news source |
| sourceUrl | String | Optional | URL to original source |
| featured | Boolean | Default: false | Featured news flag |
| viewCount | Number | Default: 0 | News view count |
| status | String (Enum) | Default: 'draft' | Publication status: `draft`, `published` |
| publishedAt | Date | Optional | Publication timestamp |
| createdAt | Date | Auto-generated | Record creation timestamp |
| updatedAt | Date | Auto-generated | Last update timestamp |

**Indexes:**
- `slug` (unique)
- `category`
- `status, publishedAt` (compound, descending on publishedAt)
- `title, summary, content` (text search)

**Relationships:**
- **MANY-TO-ONE** with User (many news articles authored by one user)

---

## 🔗 Entity Relationships Summary

### **Primary Relationships:**

1. **Organization ↔ User**
   - Type: ONE-TO-MANY
   - An organization has many users; each user belongs to one organization

2. **Organization ↔ CarbonEntry**
   - Type: ONE-TO-MANY
   - An organization has many carbon entries; each entry belongs to one organization

3. **Organization ↔ SustainabilityGoal**
   - Type: ONE-TO-MANY
   - An organization has many sustainability goals; each goal belongs to one organization

4. **Organization ↔ SustainabilityRoadmap**
   - Type: ONE-TO-ONE
   - An organization has one roadmap; each roadmap belongs to one organization

5. **User ↔ CarbonEntry**
   - Type: ONE-TO-MANY
   - A user creates many carbon entries; each entry is created by one user

6. **EmissionFactor ↔ CarbonEntry**
   - Type: ONE-TO-MANY
   - An emission factor is used in many carbon entries; each entry uses one factor

7. **User ↔ KnowledgeArticle**
   - Type: ONE-TO-MANY
   - A user authors many knowledge articles; each article has one author

8. **User ↔ NewsArticle**
   - Type: ONE-TO-MANY
   - A user authors many news articles; each article has one author

9. **Conversation ↔ Message**
   - Type: ONE-TO-MANY
   - A conversation has many messages; each message belongs to one conversation

10. **User ↔ Conversation**
    - Type: MANY-TO-MANY
    - A user participates in many conversations; a conversation has many participants

11. **Organization ↔ Conversation**
    - Type: MANY-TO-MANY
    - An organization participates in many conversations; a conversation can include multiple organizations

12. **User ↔ Message**
    - Type: ONE-TO-MANY
    - A user sends many messages; each message is sent by one user

---

## 📊 Visual ER Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           SUSTAINABILITY TRACKING SYSTEM                         │
│                                   ER DIAGRAM                                     │
└─────────────────────────────────────────────────────────────────────────────────┘

                                 ┌──────────────────┐
                                 │   Organization   │
                                 ├──────────────────┤
                                 │ PK: _id          │
                                 │ name             │
                                 │ registrationNo   │
                                 │ industryType     │
                                 │ size             │
                                 │ sustainabilityLvl│
                                 │ verified         │
                                 └────────┬─────────┘
                                          │
                    ┌─────────────────────┼─────────────────────┐
                    │                     │                     │
                    │ 1:N                 │ 1:N                 │ 1:1
                    │                     │                     │
           ┌────────▼────────┐   ┌───────▼────────┐   ┌───────▼──────────┐
           │      User       │   │  CarbonEntry   │   │ Sustainability   │
           ├─────────────────┤   ├────────────────┤   │    Roadmap       │
           │ PK: _id         │   │ PK: _id        │   ├──────────────────┤
           │ FK: organization│   │ FK: org        │   │ PK: _id          │
           │ userId          │   │ FK: user       │   │ FK: organization │
           │ email           │   │ FK: emission   │   │ currentLevel     │
           │ firstName       │   │ entryDate      │   │ milestones[]     │
           │ lastName        │   │ entryType      │   │ progressPercent  │
           │ role            │   │ quantity       │   └──────────────────┘
           │ avatarUrl       │   │ co2Equivalent  │
           └────────┬────────┘   └────────────────┘
                    │                     │
          ┌─────────┼─────────────────────┼──────────┐
          │ 1:N     │ 1:N                 │ N:1      │
          │         │                     │          │
┌─────────▼───┐  ┌──▼────────────┐  ┌────▼──────────────┐
│ Knowledge   │  │  NewsArticle  │  │  EmissionFactor   │
│  Article    │  ├───────────────┤  ├───────────────────┤
├─────────────┤  │ PK: _id       │  │ PK: _id           │
│ PK: _id     │  │ FK: author    │  │ category          │
│ FK: author  │  │ title         │  │ subCategory       │
│ title       │  │ slug          │  │ factorValue       │
│ slug        │  │ content       │  │ unit              │
│ content     │  │ category      │  │ sustainabilityLvl │
│ summary     │  │ imageUrl      │  │ source            │
│ level       │  │ status        │  │ region            │
│ category    │  │ featured      │  └───────────────────┘
│ status      │  └───────────────┘
│ featured    │
└─────────────┘

           ┌─────────────────────────────────────────┐
           │              Sustainability             │
           │                   Goal                  │
           ├─────────────────────────────────────────┤
           │ PK: _id                                 │
           │ FK: organization                        │
           │ level                                   │
           │ targetYear                              │
           │ targetReductionPercentage               │
           │ baselineEmissions                       │
           │ currentEmissions                        │
           │ status                                  │
           └─────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────┐
│                         CHAT & MESSAGING SUBSYSTEM                           │
└──────────────────────────────────────────────────────────────────────────────┘

         ┌──────────────────┐                    ┌──────────────────┐
         │   Organization   │                    │       User       │
         └────────┬─────────┘                    └────────┬─────────┘
                  │                                       │
                  │ M:N                                   │ M:N
                  │                                       │
                  └───────────────┬───────────────────────┘
                                  │
                         ┌────────▼───────────┐
                         │   Conversation     │
                         ├────────────────────┤
                         │ PK: _id            │
                         │ conversationId     │
                         │ type (direct/group)│
                         │ organizations[]    │
                         │ participants[]     │
                         │   - user           │
                         │   - organization   │
                         │   - joinedAt       │
                         │   - lastReadAt     │
                         │ createdBy          │
                         │ lastMessage        │
                         │ isActive           │
                         └────────┬───────────┘
                                  │
                                  │ 1:N
                                  │
                         ┌────────▼──────────┐
                         │     Message       │
                         ├───────────────────┤
                         │ PK: _id           │
                         │ FK: conversation  │
                         │ FK: sender        │
                         │ messageId         │
                         │ messageType       │
                         │ content           │
                         │ fileUrl           │
                         │ fileName          │
                         │ isEdited          │
                         │ isDeleted         │
                         │ readBy[]          │
                         └───────────────────┘
```

---

## 🔑 Key Design Decisions

### **1. Sustainability Levels**
The system uses a tiered approach with 3 levels:
- **Level 1:** Foundation & Measurement
- **Level 2:** Efficiency & Integration
- **Level 3:** Transformation & Net Zero Leadership

### **2. Carbon Tracking**
- Uses emission factors to calculate CO2 equivalents
- Supports multiple entry types (electricity, fuel, transport, waste, water, renewable energy, carbon offsets)
- Tracks entries at specific sustainability levels for historical accuracy

### **3. Multi-Tenant Architecture**
- Organizations are the primary tenant boundary
- Users belong to organizations
- Data is scoped and filtered by organization

### **4. Chat System**
- Supports both direct (1:1) and group conversations
- Participants are tracked with organization context
- Supports multiple organizations in conversations (B2B collaboration)
- Soft delete for messages (isDeleted flag)

### **5. Content Management**
- Knowledge articles and news articles support draft/published workflow
- Full-text search capabilities
- Sustainability level targeting for knowledge articles
- Featured content support

### **6. Security & Data Integrity**
- Passwords are hashed using bcrypt (select: false)
- Email verification workflow
- Role-based access control (admin, manager, user)
- Soft deletes where appropriate

---

## 📈 Database Statistics & Performance

### **Indexes Summary:**
- **Total Indexes:** 30+ across all collections
- **Unique Constraints:** 10 (emails, IDs, slugs, registration numbers)
- **Compound Indexes:** 8 (for optimized queries)
- **Text Search Indexes:** 3 (knowledge articles, news articles, organizations)

### **Cardinality Estimates:**
- Organizations: Low (hundreds to thousands)
- Users: Medium (thousands to tens of thousands)
- Carbon Entries: High (millions over time)
- Messages: Very High (millions to billions)
- Conversations: Medium (thousands to millions)
- Knowledge Articles: Low (hundreds to thousands)
- News Articles: Medium (thousands)
- Emission Factors: Low (fixed dataset, hundreds)

---

## 🚀 Future Enhancements

### **Potential Schema Extensions:**
1. **Audit Log Entity** - Track all data modifications
2. **File Storage Entity** - Centralized file management
3. **Notification Entity** - System notifications and alerts
4. **Report Entity** - Saved reports and exports
5. **API Key Entity** - Third-party integrations
6. **Carbon Credit Entity** - Carbon credit trading
7. **Supplier Entity** - Supply chain emissions tracking
8. **Product Entity** - Product lifecycle emissions

---

## 📝 Notes

- All timestamps are in UTC
- All IDs use MongoDB ObjectId format
- Custom IDs (userId, conversationId, messageId) are auto-generated with prefixes
- Virtual fields are computed but not stored in database
- Embedded documents (milestones, participants, attachments) are stored within parent documents
- Foreign keys are enforced at application level (mongoose refs)

---

**Generated:** October 22, 2025  
**Version:** 1.0  
**Database:** MongoDB (Mongoose ODM)  
**Project:** Sustainability Carbon Tracking Backend

