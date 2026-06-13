import React, { forwardRef } from 'react';
import { TextInput, TextInputProps, View, Text } from 'react-native';
import { cn } from '../../utils/cn';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, className, containerClassName, ...props }, ref) => {
    return (
      <View className={cn('w-full mb-4', containerClassName)}>
        {label && (
          <Text className="text-textMuted text-sm font-medium mb-1">
            {label}
          </Text>
        )}
        <View
          className={cn(
            'flex-row items-center border border-surface bg-surface rounded-xl px-4 py-3',
            error && 'border-error',
            className
          )}
        >
          <TextInput
            ref={ref}
            className="flex-1 text-text text-base"
            placeholderTextColor="#94A3B8"
            {...props}
          />
        </View>
        {error && (
          <Text className="text-error text-xs mt-1 ml-1">{error}</Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';
