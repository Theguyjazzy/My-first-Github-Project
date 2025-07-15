"use client";

import React, { useEffect, useState } from 'react';
import MediaCard from '../components/MediaCard';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export default function HomePage() {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    fetch('/media.json')
      .then((res) => res.json())
      .then((data) => setMedia(data));
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Media Gallery</h1>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {media.map((item: any) => (
          <MediaCard
            key={item.id}
            type={item.type}
            title={item.title}
            src={item.src}
            description={item.description}
          />
        ))}
      </motion.div>
    </div>
  );
}