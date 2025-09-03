'use client';

import { cva, VariantProps } from 'class-variance-authority';
import { ReactNode } from 'react';

const cardVariants = cva(
  'rounded-lg border border-[var(--surface)] bg-[var(--surface)]',
  {
    variants: {
      variant: {
        default: '',
        elevated: 'shadow-[var(--shadow-card)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface CardProps extends VariantProps<typeof cardVariants> {
  children: ReactNode;
  className?: string;
}

export function Card({ variant, className = '', children }: CardProps) {
  return <div className={cardVariants({ variant, className })}>{children}</div>;
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

export function CardContent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
}
