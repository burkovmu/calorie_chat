'use client';

import React from 'react';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export default function Icon({ name, size = 24, className = '' }: IconProps) {
  const iconPath = `/icons/${name}.svg`;
  
  return (
    <img 
      src={iconPath} 
      alt={name}
      width={size}
      height={size}
      className={className}
    />
  );
} 