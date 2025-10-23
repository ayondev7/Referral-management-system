import { Request, Response } from 'express';
import { Course } from './course.model';
import { asyncHandler } from '../../utils/asyncHandler';
import { AuthRequest } from '../../middleware/auth.middleware';
import { Purchase } from '../purchase/purchase.model';

export const getAllCourses = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 9;
  const category = req.query.category as string;

  const skip = (page - 1) * limit;

  const query: any = { isActive: true };
  if (category) {
    query.category = category;
  }

  const total = await Course.countDocuments(query);

  const courses = await Course.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('-__v')
    .lean();

  let coursesWithPurchaseStatus = courses;

  if (req.user) {
    const purchasedCourses = await Purchase.find({
      userId: req.user.id,
      status: 'paid'
    }).distinct('courseId');

    const purchasedCourseIds = new Set(purchasedCourses.map(id => id.toString()));

    coursesWithPurchaseStatus = courses.map(course => ({
      ...course,
      isPurchased: purchasedCourseIds.has(course._id.toString())
    }));
  } else {
    coursesWithPurchaseStatus = courses.map(course => ({
      ...course,
      isPurchased: false
    }));
  }

  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    data: {
      courses: coursesWithPurchaseStatus,
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

export const getCourseById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const course = await Course.findOne({ _id: id, isActive: true }).select('-__v').lean();

  if (!course) {
    res.status(404).json({
      success: false,
      message: 'Course not found or has been removed'
    });
    return;
  }

  let isPurchased = false;

  if (req.user) {
    const purchase = await Purchase.findOne({
      userId: req.user.id,
      courseId: id,
      status: 'paid'
    });
    isPurchased = !!purchase;
  }

  res.status(200).json({
    success: true,
    data: {
      ...course,
      isPurchased
    }
  });
});

export const getLatestCourses = asyncHandler(async (req: AuthRequest, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 6;

  const courses = await Course.find({ isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('-__v')
    .lean();

  let coursesWithPurchaseStatus = courses;

  if (req.user) {
    const purchasedCourses = await Purchase.find({
      userId: req.user.id,
      status: 'paid'
    }).distinct('courseId');

    const purchasedCourseIds = new Set(purchasedCourses.map(id => id.toString()));

    coursesWithPurchaseStatus = courses.map(course => ({
      ...course,
      isPurchased: purchasedCourseIds.has(course._id.toString())
    }));
  } else {
    coursesWithPurchaseStatus = courses.map(course => ({
      ...course,
      isPurchased: false
    }));
  }

  res.status(200).json({
    success: true,
    data: coursesWithPurchaseStatus
  });
});

export const createCourse = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, author, price, imageUrl, category } = req.body;

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

  course.isActive = false;
  await course.save();

  res.status(200).json({
    success: true,
    message: 'Course deleted successfully'
  });
});
