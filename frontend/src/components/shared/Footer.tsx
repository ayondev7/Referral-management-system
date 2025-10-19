import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">
          © {new Date().getFullYear()} CourseHub. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
