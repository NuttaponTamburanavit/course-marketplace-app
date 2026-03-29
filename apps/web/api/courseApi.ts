import type { Course } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function getCourse(courseId: string): Promise<Course> {
  const res = await fetch(`${API_URL}/api/courses/${courseId}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('ไม่พบข้อมูลคอร์ส');
  const json = (await res.json()) as { data: Course };
  return json.data;
}

export async function getCourses(): Promise<Course[]> {
  const res = await fetch(`${API_URL}/api/courses`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  const json = (await res.json()) as { data: Course[] };
  return json.data;
}
