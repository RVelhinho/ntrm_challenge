import { useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../../components/shared/ui/Input/Input';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverEmpty,
} from '../../../components/shared/ui/Popover/Popover';
import { cn } from '../../../shared/utils/class-names';

type SearchFieldProps = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  options?: string[];
  onChange: (value: string) => void;
  onEnter?: () => void;
};

export function SearchField({
  id,
  label,
  value,
  placeholder,
  options,
  onChange,
  onEnter,
}: SearchFieldProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const filteredOptions = (options ?? [])
    .filter((option) => option.toLocaleLowerCase().includes(value.toLocaleLowerCase()))
    .map((option) => ({ value: option }));

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value);
    setActiveIndex(-1);
    setOpen(true);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && inputRef.current === document.activeElement) return;
    setOpen(nextOpen);
  }

  function selectOption(option: string) {
    onChange(option);
    setActiveIndex(-1);
    setOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const activeOption = filteredOptions[activeIndex];

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) =>
        filteredOptions.length === 0 ? -1 : Math.min(index + 1, filteredOptions.length - 1),
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => (filteredOptions.length === 0 ? -1 : Math.max(index - 1, 0)));
    } else if (event.key === 'Enter' && activeOption) {
      event.preventDefault();
      selectOption(activeOption.value);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      setOpen(false);
      onEnter?.();
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div className="min-w-0">
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      {options === undefined ? (
        <Input
          id={id}
          value={value}
          ref={inputRef}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
        />
      ) : (
        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverAnchor asChild>
            <div className="relative">
              <Input
                id={id}
                value={value}
                ref={inputRef}
                onFocus={() => setOpen(true)}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                  if (inputRef.current !== document.activeElement) setOpen(false);
                }}
                placeholder={placeholder}
                autoComplete="off"
                role="combobox"
                aria-expanded={open}
                aria-controls={`${id}-suggestions`}
                aria-activedescendant={
                  activeIndex >= 0 ? `${id}-suggestion-${activeIndex}` : undefined
                }
              />
            </div>
          </PopoverAnchor>
          <PopoverContent
            id={`${id}-suggestions`}
            role="listbox"
            aria-label={t('search.suggestions', { label })}
            sideOffset={8}
            onOpenAutoFocus={(event) => event.preventDefault()}
          >
            {filteredOptions.length ? (
              filteredOptions.map((option, index) => (
                <button
                  id={`${id}-suggestion-${index}`}
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  className={cn(
                    'w-full rounded-control px-3 py-2 text-left text-sm text-text outline-none hover:bg-primary-soft',
                    index === activeIndex && 'bg-primary-soft font-medium',
                  )}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectOption(option.value)}
                >
                  {option.value}
                </button>
              ))
            ) : (
              <PopoverEmpty>{t('search.noSuggestions')}</PopoverEmpty>
            )}
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
