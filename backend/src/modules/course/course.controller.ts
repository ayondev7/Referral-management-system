import { Request, Response } from 'express';
import { CourseService } from './course.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthRequest } from '../../middleware/auth.middleware';

const courseService = new CourseService();

export const getAllCourses = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 9;
  const category = req.query.category as string;
  const userId = req.user?.id;

  const result = await courseService.getAllCourses(page, limit, category, userId);

  res.status(200).json({
    success: true,
    data: result
  });
});

export const getCourseById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  const course = await courseService.getCourseById(id, userId);

  res.status(200).json({
    success: true,
    data: course
  });
});

export const getLatestCourses = asyncHandler(async (req: AuthRequest, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 6;
  const userId = req.user?.id;

  const courses = await courseService.getLatestCourses(limit, userId);

  res.status(200).json({
    success: true,
    data: courses
  });
});

export const createCourse = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, author, price, imageUrl, category } = req.body;

  const course = await courseService.createCourse({
    title,
    description,
    author,
    price,
    imageUrl,
    category
  });

  res.status(201).json({
    success: true,
    data: course,
    message: 'Course created successfully'
  });
});

export const updateCourse = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, author, price, imageUrl, category, isActive } = req.body;

  const course = await courseService.updateCourse(id, {
    title,
    description,
    author,
    price,
    imageUrl,
    category,
    isActive
  });

  res.status(200).json({
    success: true,
    data: course,
    message: 'Course updated successfully'
  });
});

export const deleteCourse = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  await courseService.deleteCourse(id);

  res.status(200).json({
    success: true,
    message: 'Course deleted successfully'
  });
});
