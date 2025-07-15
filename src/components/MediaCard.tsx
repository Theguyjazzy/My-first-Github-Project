import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion';

interface MediaCardProps {
  type: 'image' | 'video';
  title: string;
  src: string;
  description: string;
}

const MediaCard: React.FC<MediaCardProps> = ({ type, title, src, description }) => {
  return (
    <motion.div
      className="border rounded-lg p-4 bg-white shadow"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="font-semibold mb-2">{title}</h2>
      {type === 'image' ? (
        <Image src={src.replace('/public', '')} alt={title} width={200} height={200} className="mb-2 object-contain" />
      ) : (
        <video controls width={200} height={200} className="mb-2">
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <p className="text-sm text-gray-600">{description}</p>
    </motion.div>
  );
};

export default MediaCard; 