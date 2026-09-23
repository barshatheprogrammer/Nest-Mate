import React from 'react';

const AdminPlaceholder = ({ title }) => (
  <div className="w-full h-full flex flex-col items-center justify-center text-white/40 min-h-[60vh]">
    <h1 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">{title}</h1>
    <p>This module is currently under development.</p>
  </div>
);

export default AdminPlaceholder;
