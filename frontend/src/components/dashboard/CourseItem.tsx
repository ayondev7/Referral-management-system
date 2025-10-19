'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@components/ui/Button';

interface Course {
  _id: string;
  title: string;
  description: string;
  author: string;
  price: number;
  imageUrl: string;
  category?: string;
}

interface CourseItemProps {
  course: Course;
  index?: number;
}

export const CourseItem: React.FC<CourseItemProps> = ({ course, index = 0 }) => {
  // Truncate description to 120 characters
  const truncatedDescription =
    course.description.length > 120
      ? course.description.substring(0, 120) + '...'
      : course.description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group"
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-slate-200">
        {/* Course Image */}
        <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
          <Image
            src={course.imageUrl}
            alt={course.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {course.category && (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-xs font-semibold text-slate-700">
                {course.category}
              </span>
            </div>
          )}
        </div>

        {/* Course Content */}
        <div className="p-5 flex flex-col flex-grow">
          {/* Course Title */}
          <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>

          {/* Author */}
          <p className="text-sm text-slate-600 mb-3">{course.author}</p>

          {/* Description */}
          <p className="text-sm text-slate-600 mb-4 flex-grow line-clamp-3">
            {truncatedDescription}
          </p>

          {/* Price and Button */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ${course.price}
              </span>
            </div>
            <Link href={`/courses/${course._id}/purchase`}>
              <Button size="sm" className="shadow-sm">
                Buy Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
