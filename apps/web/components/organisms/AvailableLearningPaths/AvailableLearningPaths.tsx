'use client';

import { CourseCard, type CourseCardProps } from '@/components/molecules/CourseCard';
import { SearchBar } from '@/components/molecules/SearchBar';
import { useState } from 'react';

interface AvailableLearningPathsProps {
  courses: CourseCardProps[];
}

export function AvailableLearningPaths({ courses }: AvailableLearningPathsProps) {
  const [query, setQuery] = useState('');

  const filtered =
    query.trim() === ''
      ? courses
      : courses.filter((course) => {
        const q = query.toLowerCase();
        return (
          course.title.toLowerCase().includes(q) ||
          course.description.toLowerCase().includes(q) ||
          course.tags?.some((tag) => tag.toLowerCase().includes(q))
        );
      });

  return (
    <section className="bg-surface px-6 py-16">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-2xl font-semibold text-white">
            Available Learning Paths
          </h2>
          <SearchBar value={query} onChange={setQuery} onFilter={() => { }} />
        </div>

        {/* Course grid / empty state */}
        {filtered.length === 0 ? (
          <div className="py-24 text-center text-white/40">
            <p>No courses match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course) => (
              <CourseCard key={course.href} {...course} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
