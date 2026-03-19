import Image, { ImageProps } from 'next/image'
import { cn } from '@/core/utils'

interface OptimizedImageProps extends Omit<ImageProps, 'loading'> {
  loading?: 'lazy' | 'eager'
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
}

/**
 * Optimized Image component with lazy loading and blur placeholder
 * 
 * @example
 * <OptimizedImage
 *   src="/hero.jpg"
 *   alt="Hero"
 *   width={800}
 *   height={600}
 *   priority={true} // For above-fold images
 * />
 */
export function OptimizedImage({
  loading = 'lazy',
  placeholder = 'blur',
  blurDataURL,
  className,
  ...props
}: OptimizedImageProps) {
  return (
    <Image
      {...props}
      loading={loading}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      className={cn('object-cover', className)}
      quality={75} // Good balance between quality and size
    />
  )
}

/**
 * Avatar Image component with fallback
 * 
 * @example
 * <AvatarImage
 *   src={user.avatar}
 *   alt={user.name}
 *   fallback={user.name}
 * />
 */
interface AvatarImageProps {
  src?: string | null
  alt: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function AvatarImage({
  src,
  alt,
  fallback,
  size = 'md',
  className,
}: AvatarImageProps) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-16 w-16 text-base',
  }

  if (!src) {
    return (
      <div
        className={cn(
          'rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold',
          sizes[size],
          className
        )}
      >
        {fallback ? fallback.charAt(0).toUpperCase() : '?'}
      </div>
    )
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size === 'lg' ? 64 : size === 'md' ? 40 : 32}
      height={size === 'lg' ? 64 : size === 'md' ? 40 : 32}
      className={cn('rounded-full', sizes[size], className)}
      priority={size === 'lg'} // Load large avatars eagerly
    />
  )
}

/**
 * Responsive Image component with multiple breakpoints
 * 
 * @example
 * <ResponsiveImage
 *   src="/hero.jpg"
 *   alt="Hero"
 *   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
 *   breakpoints={[640, 768, 1024, 1280]}
 * />
 */
interface ResponsiveImageProps extends Omit<ImageProps, 'sizes'> {
  sizes: string
  breakpoints?: number[]
}

export function ResponsiveImage({
  sizes,
  breakpoints = [640, 768, 1024, 1280],
  className,
  ...props
}: ResponsiveImageProps) {
  return (
    <Image
      {...props}
      sizes={sizes}
      className={cn('object-cover w-full h-auto', className)}
      quality={75}
    />
  )
}
