import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
      <div className="max-w-screen-2xl mx-auto px-6 text-center">
        <p className="text-sm text-slate-900 opacity-70">
          © {new Date().getFullYear()} CourseHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
