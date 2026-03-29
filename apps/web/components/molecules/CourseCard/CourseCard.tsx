import { Badge } from '@/components/atoms/Badge';
import { cn } from '@/utils/cn';
import Image from 'next/image';
import Link from 'next/link';

export interface CourseCardProps {
  title: string;
  description: string;
  href: string;
  tags?: string[];
  level?: string;
  duration?: string;
  rating?: number;
  thumbnailUrl?: string;
}

export function CourseCard({
  title,
  description,
  href,
  tags,
  level,
  duration,
  rating,
  thumbnailUrl,
}: CourseCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group block overflow-hidden rounded-[1.5rem] bg-surface-container-low',
        'transition-shadow hover:shadow-[0_0_40px_rgba(129,39,28,0.1)]',
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-surface-bright to-surface" />
        )}
        {tags && tags.length > 0 && (
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Badge key={tag} variant="tag">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="line-clamp-2 font-display font-semibold text-white transition-colors group-hover:text-primary">
          {title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-white/50">{description}</p>

        {(duration !== undefined || level !== undefined || rating !== undefined) && (
          <div className="mt-4 flex items-center justify-between text-xs text-white/40">
            <div className="flex items-center gap-3">
              {duration && <span>{duration}</span>}
              {level && <span>{level}</span>}
            </div>
            {rating !== undefined && (
              <span className="flex items-center gap-1">
                <span className="text-primary">★</span>
                {rating}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
