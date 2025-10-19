import { Request, Response } from 'express';
import { Course } from './course.model';
import { asyncHandler } from '../../utils/asyncHandler';

// Get all courses with pagination
export const getAllCourses = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 9;
  const category = req.query.category as string;

  const skip = (page - 1) * limit;

  // Build query
  const query: any = { isActive: true };
  if (category) {
    query.category = category;
  }

  // Get total count for pagination
  const total = await Course.countDocuments(query);

  // Get courses with pagination
  const courses = await Course.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('-__v');

  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    data: {
      courses,
      pagination: {
        currentPage: page,
        totalPages,
        totalCourses: total,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    }
  });
});

// Get course by ID
export const getCourseById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const course = await Course.findOne({ _id: id, isActive: true }).select('-__v');

  if (!course) {
    res.status(404).json({
      success: false,
      message: 'Course not found or has been removed'
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: course
  });
});

// Get latest courses (for dashboard)
export const getLatestCourses = asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 6;

  const courses = await Course.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('-__v');

  res.status(200).json({
    success: true,
    data: courses
  });
});

// Create course (Admin only - you can add auth middleware later)
export const createCourse = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, author, price, imageUrl, category } = req.body;

  // Validation
  if (!title || !description || !author || price === undefined || !imageUrl) {
    res.status(400).json({
      success: false,
      message: 'Please provide all required fields: title, description, author, price, and imageUrl'
    });
    return;
  }

  const course = await Course.create({
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

// Update course (Admin only)
export const updateCourse = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, author, price, imageUrl, category, isActive } = req.body;

  const course = await Course.findById(id);

  if (!course) {
    res.status(404).json({
      success: false,
      message: 'Course not found'
    });
    return;
  }

  // Update fields
  if (title !== undefined) course.title = title;
  if (description !== undefined) course.description = description;
  if (author !== undefined) course.author = author;
  if (price !== undefined) course.price = price;
  if (imageUrl !== undefined) course.imageUrl = imageUrl;
  if (category !== undefined) course.category = category;
  if (isActive !== undefined) course.isActive = isActive;

  await course.save();

  res.status(200).json({
    success: true,
    data: course,
    message: 'Course updated successfully'
  });
});

// Delete course (Admin only - soft delete)
export const deleteCourse = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const course = await Course.findById(id);

  if (!course) {
    res.status(404).json({
      success: false,
      message: 'Course not found'
    });
    return;
  }

  // Soft delete
  course.isActive = false;
  await course.save();

  res.status(200).json({
    success: true,
    message: 'Course deleted successfully'
  });
});
