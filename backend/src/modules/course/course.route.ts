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

const router = Router();

// Public routes
router.get('/', getAllCourses);
router.get('/latest', getLatestCourses);
router.get('/:id', getCourseById);

// Protected routes (Add admin middleware later if needed)
router.post('/', authMiddleware, createCourse);
router.put('/:id', authMiddleware, updateCourse);
router.delete('/:id', authMiddleware, deleteCourse);

export default router;
