import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { cn } from '../../utils/cn';

interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  title: string;
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  title,
  loading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "flex-row items-center justify-center rounded-2xl shadow-soft";
  
  const variants = {
    primary: "bg-primary active:bg-primary/80",
    secondary: "bg-secondary active:bg-secondary/80",
    outline: "border-2 border-primary bg-surface/80 active:bg-surface",
    ghost: "bg-transparent active:bg-white/5",
  };

  const sizes = {
    sm: "px-4 py-2",
    md: "px-6 py-3",
    lg: "px-7 py-4",
  };

  const textStyles = {
    primary: "text-white font-semibold",
    secondary: "text-white font-semibold",
    outline: "text-primary font-semibold",
    ghost: "text-primary font-semibold",
  };

  return (
    <TouchableOpacity
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        (disabled || loading) && "opacity-50",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#3B82F6' : '#FFFFFF'} />
      ) : (
        <Text className={cn(textStyles[variant], size === 'lg' ? 'text-lg' : 'text-base')}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
