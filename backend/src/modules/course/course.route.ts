import { Router } from 'express';
import {
  getAllCourses,
  getCourseById,
  getLatestCourses,
  createCourse,
  updateCourse,
  deleteCourse
} from './course.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { optionalAuthMiddleware } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', optionalAuthMiddleware, getAllCourses);
router.get('/latest', optionalAuthMiddleware, getLatestCourses);
router.get('/:id', optionalAuthMiddleware, getCourseById);

router.post('/', authMiddleware, createCourse);
router.put('/:id', authMiddleware, updateCourse);
router.delete('/:id', authMiddleware, deleteCourse);

export default router;
