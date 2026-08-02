import { forwardRef } from 'react';
import type { InputProps } from '../Input/Input';
import { Input } from '../Input/Input';

export const TimeInput = forwardRef<HTMLInputElement, Omit<InputProps, 'type'>>(
  function TimeInput(props, ref) {
    return <Input ref={ref} type="time" {...props} />;
  },
);
