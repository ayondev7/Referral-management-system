import mongoose from 'mongoose';
import { Course, ICourse } from './course.model';
import { Purchase } from '../purchase/purchase.model';

export class CourseService {
  async getAllCourses(page: number, limit: number, category?: string, userId?: string) {
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

    const coursesWithPurchaseStatus = await this.addPurchaseStatus(courses, userId);
    const totalPages = Math.ceil(total / limit);

    return {
      courses: coursesWithPurchaseStatus,
      pagination: {
        currentPage: page,
        totalPages,
        totalCourses: total,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    };
  }

  async getCourseById(id: string, userId?: string) {
    const course = await Course.findOne({ _id: id, isActive: true }).select('-__v').lean();

    if (!course) {
      const error: any = new Error('Course not found or has been removed');
      error.statusCode = 404;
      throw error;
    }

    let isPurchased = false;

    if (userId) {
      const purchase = await Purchase.findOne({
        userId,
        courseId: id,
        status: 'paid'
      });
      isPurchased = !!purchase;
    }

    return {
      ...course,
      isPurchased
    };
  }

  async getLatestCourses(limit: number, userId?: string) {
    const courses = await Course.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-__v')
      .lean();

    return await this.addPurchaseStatus(courses, userId);
  }

  async createCourse(data: {
    title: string;
    description: string;
    author: string;
    price: number;
    imageUrl: string;
    category?: string;
  }) {
    if (!data.title || !data.description || !data.author || data.price === undefined || !data.imageUrl) {
      const error: any = new Error('Please provide all required fields: title, description, author, price, and imageUrl');
      error.statusCode = 400;
      throw error;
    }

    const course = await Course.create(data);
    return course;
  }

  async updateCourse(id: string, data: {
    title?: string;
    description?: string;
    author?: string;
    price?: number;
    imageUrl?: string;
    category?: string;
    isActive?: boolean;
  }) {
    const course = await Course.findById(id);

    if (!course) {
      const error: any = new Error('Course not found');
      error.statusCode = 404;
      throw error;
    }

    if (data.title !== undefined) course.title = data.title;
    if (data.description !== undefined) course.description = data.description;
    if (data.author !== undefined) course.author = data.author;
    if (data.price !== undefined) course.price = data.price;
    if (data.imageUrl !== undefined) course.imageUrl = data.imageUrl;
    if (data.category !== undefined) course.category = data.category;
    if (data.isActive !== undefined) course.isActive = data.isActive;

    await course.save();
    return course;
  }

  async deleteCourse(id: string) {
    const course = await Course.findById(id);

    if (!course) {
      const error: any = new Error('Course not found');
      error.statusCode = 404;
      throw error;
    }

    course.isActive = false;
    await course.save();
    return course;
  }

  private async addPurchaseStatus(courses: any[], userId?: string) {
    if (!userId) {
      return courses.map(course => ({
        ...course,
        isPurchased: false
      }));
    }

    const purchasedCourses = await Purchase.find({
      userId,
      status: 'paid'
    }).distinct('courseId');

    const purchasedCourseIds = new Set(purchasedCourses.map(id => id.toString()));

    return courses.map(course => ({
      ...course,
      isPurchased: purchasedCourseIds.has(course._id.toString())
    }));
  }
}
