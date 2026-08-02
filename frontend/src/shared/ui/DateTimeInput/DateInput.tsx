import { forwardRef } from 'react';
import type { InputProps } from '../Input/Input';
import { Input } from '../Input/Input';

export const DateInput = forwardRef<HTMLInputElement, Omit<InputProps, 'type'>>(
  function DateInput(props, ref) {
    return <Input ref={ref} type="date" {...props} />;
  },
);
