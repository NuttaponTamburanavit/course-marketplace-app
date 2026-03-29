import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCourse } from '@/api/courseApi';
import { formatSatang } from '@/utils/formatSatang';
import { BuyButton } from './_components/BuyButton';
import type { Course } from '@/api/types';

interface Props {
  params: { courseId: string };
}

const MOCK_COURSES: Record<string, Course> = {
  'mock-1': {
    id: 'mock-1',
    title: 'React & Next.js 14 ฉบับสมบูรณ์ — จาก 0 ถึง Production',
    description:
      'เรียนรู้ React และ Next.js 14 App Router ตั้งแต่พื้นฐานจนถึงระดับ Production พร้อม TypeScript, Tailwind CSS และ Server Components ครอบคลุมทุกหัวข้อที่นักพัฒนา Frontend ต้องรู้ ได้แก่ การจัดการ State, Data Fetching, Authentication, Performance Optimization และการ Deploy บน Vercel',
    listPrice: 299900,
    instructorName: 'อาจารย์สมชาย ใจดี',
  },
  'mock-2': {
    id: 'mock-2',
    title: 'NestJS Clean Architecture — สร้าง API ระดับ Enterprise',
    description:
      'ออกแบบและสร้าง REST API ด้วย NestJS ตามหลัก Clean Architecture, TypeORM, PostgreSQL และ JWT Authentication ครอบคลุม Domain Layer, Infrastructure Layer, Presentation Layer พร้อมหลักการ SOLID และการเขียน Unit Test และ Integration Test อย่างถูกต้อง',
    listPrice: 249900,
    instructorName: 'อาจารย์วิชัย โค้ดเก่ง',
  },
  'mock-3': {
    id: 'mock-3',
    title: 'TypeScript Advanced Patterns — เขียนโค้ดให้ถูกต้องและปลอดภัย',
    description:
      'เจาะลึก TypeScript ขั้นสูง ครอบคลุม Generics, Utility Types, Conditional Types, Mapped Types และ Design Patterns ที่ใช้งานจริงในโปรเจกต์ระดับ Production เหมาะสำหรับนักพัฒนาที่ต้องการยกระดับทักษะ TypeScript ให้แข็งแกร่ง',
    listPrice: 199900,
    instructorName: 'อาจารย์มานี ไทป์สคริปต์',
  },
};

export default async function CoursePage({ params }: Props) {
  let course: Course | undefined;

  try {
    course = await getCourse(params.courseId);
  } catch {
    course = MOCK_COURSES[params.courseId];
  }

  if (!course) notFound();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link href="/" className="mb-4 inline-flex items-center gap-1 text-sm text-brand-600 hover:underline">
          ← กลับหน้าหลัก
        </Link>
        <div className="mt-4 rounded-xl bg-white shadow-sm overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-brand-100 to-brand-50 flex items-center justify-center">
            <span className="text-7xl">📚</span>
          </div>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
            {course.instructorName && (
              <p className="text-gray-500 mt-1">โดย {course.instructorName}</p>
            )}
            <p className="text-gray-700 mt-4 leading-relaxed">{course.description}</p>
            <div className="mt-6 flex items-center justify-between border-t pt-6">
              <div>
                <p className="text-sm text-gray-500">ราคา</p>
                <p className="text-3xl font-bold text-brand-600">{formatSatang(course.listPrice)}</p>
              </div>
              <BuyButton courseId={course.id} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
