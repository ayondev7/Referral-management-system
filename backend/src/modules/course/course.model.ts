import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description: string;
  author: string;
  price: number;
  imageUrl: string;
  category?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    author: {
      type: String,
      required: [true, 'Course author is required'],
      trim: true,
      maxlength: [100, 'Author name cannot be more than 100 characters']
    },
    price: {
      type: Number,
      required: [true, 'Course price is required'],
      min: [0, 'Price cannot be negative']
    },
    imageUrl: {
      type: String,
      required: [true, 'Course image URL is required'],
      trim: true
    },
    category: {
      type: String,
      trim: true,
      maxlength: [50, 'Category cannot be more than 50 characters']
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

courseSchema.index({ isActive: 1, createdAt: -1 });
courseSchema.index({ category: 1 });

export const Course = mongoose.model<ICourse>('Course', courseSchema);
