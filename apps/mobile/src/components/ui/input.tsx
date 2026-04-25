import { cn } from '@/lib/utils';
import * as React from 'react';
import { Platform, TextInput } from 'react-native';
import { useTheme } from '@/hooks/use-theme';

type InputProps = React.ComponentProps<typeof TextInput> & {
  invalid?: boolean;
};

const Input = React.forwardRef<TextInput, InputProps>(
  ({ className, invalid = false, style, ...props }, ref) => {
    const theme = useTheme();
    
    return (
      <TextInput
        ref={ref}
        aria-invalid={invalid}
        className={cn(
          'flex h-10 w-full min-w-0 flex-row items-center rounded-md border px-3 py-1 text-base leading-5 shadow-sm shadow-black/5 sm:h-9',
          invalid && 'border-red-500',
          props.editable === false &&
            cn(
              'opacity-50',
              Platform.select({ web: 'disabled:pointer-events-none disabled:cursor-not-allowed' })
            ),
          Platform.select({
            web: cn(
              'outline-none transition-[color,box-shadow] md:text-sm',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            ),
          }),
          className
        )}
        style={[
          { 
            backgroundColor: theme.background, 
            borderColor: invalid ? '#ef4444' : theme.border,
            color: theme.text,
          },
          style,
        ]}
        placeholderTextColor={theme.textSecondary}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
export type { InputProps };