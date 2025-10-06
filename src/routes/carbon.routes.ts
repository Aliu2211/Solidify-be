import { Router } from 'express';
import { CarbonController } from '../controllers/carbon.controller';
import { createCarbonEntryValidator, createGoalValidator, updateRoadmapValidator, carbonQueryValidator } from '../validators/carbon.validator';
import { validate } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/entries', createCarbonEntryValidator, validate, CarbonController.createEntry);
router.get('/entries', carbonQueryValidator, validate, CarbonController.getEntries);
router.get('/dashboard', CarbonController.getDashboard);
router.get('/roadmap', CarbonController.getRoadmap);
router.put('/roadmap/milestone', updateRoadmapValidator, validate, CarbonController.updateMilestone);
router.post('/goals', createGoalValidator, validate, CarbonController.createGoal);
router.get('/emission-factors', CarbonController.getEmissionFactors);

export default router;
