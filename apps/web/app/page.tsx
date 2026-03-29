import { getCourses } from '@/api/courseApi';
import type { Course } from '@/api/types';
import type { CourseCardProps } from '@/components/molecules/CourseCard';
import { AvailableLearningPaths } from '@/components/organisms/AvailableLearningPaths';
import { HeroSection } from '@/components/organisms/HeroSection';

const MOCK_COURSES: Course[] = [
  {
    id: 'mock-1',
    title: 'React & Next.js 14 ฉบับสมบูรณ์ — จาก 0 ถึง Production',
    description:
      'เรียนรู้ React และ Next.js 14 App Router ตั้งแต่พื้นฐานจนถึงระดับ Production พร้อม TypeScript, Tailwind CSS และ Server Components',
    listPrice: 299900,
    instructorName: 'อาจารย์สมชาย ใจดี',
    // React component tree / JSX code on screen
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
  },
  {
    id: 'mock-2',
    title: 'NestJS Clean Architecture — สร้าง API ระดับ Enterprise',
    description:
      'ออกแบบและสร้าง REST API ด้วย NestJS ตามหลัก Clean Architecture, TypeORM, PostgreSQL และ JWT Authentication',
    listPrice: 249900,
    instructorName: 'อาจารย์วิชัย โค้ดเก่ง',
    // Server racks / backend infrastructure
    thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
  },
  {
    id: 'mock-3',
    title: 'TypeScript Advanced Patterns — เขียนโค้ดให้ถูกต้องและปลอดภัย',
    description:
      'เจาะลึก TypeScript ขั้นสูง ครอบคลุม Generics, Utility Types, Conditional Types, Mapped Types และ Design Patterns',
    listPrice: 199900,
    instructorName: 'อาจารย์มานี ไทป์สคริปต์',
    // Code editor with TypeScript syntax
    thumbnailUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80',
  },
];

export default async function HomePage() {
  let courses: Course[] = [];
  try {
    const fetched = await getCourses();
    courses = fetched.length > 0 ? fetched : MOCK_COURSES;
  } catch {
    courses = MOCK_COURSES;
  }

  const engineerCount = Number.parseInt(process.env.NEXT_PUBLIC_ENGINEER_COUNT ?? '0', 10);

  const courseCards: CourseCardProps[] = courses.map((course) => ({
    title: course.title,
    description: course.description,
    href: `/courses/${course.id}`,
    thumbnailUrl: course.thumbnailUrl,
  }));

  return (
    <>
      <HeroSection activeCourseCount={courses.length} engineerCount={engineerCount} />
      <AvailableLearningPaths courses={courseCards} />
    </>
  );
}
