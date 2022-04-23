import React from 'react';

export default function Logo() {
  return (
    <div className="flex">
      <img
        src="/logo.svg"
        alt="VNDIRECT - Wisdom to success"
        className="w-5 h-auto"
      />
      <div className="ml-3 text-lg text-white">PMS</div>
    </div>
  );
}
