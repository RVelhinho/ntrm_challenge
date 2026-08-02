import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../../shared/ui/Input/Input';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverEmpty,
} from '../../../shared/ui/Popover/Popover';
import { cn } from '../../../shared/utils/utils';
import { createSearchIndex, fuzzyOptions } from '../search-index';

type SearchFieldProps = {
  id: string;
  label?: string;
  value: string;
  placeholder: string;
  options: string[];
  onChange: (value: string) => void;
  onEnter?: () => void;
  selectionOnly?: boolean;
  onUseCurrentLocation?: () => void;
  locationStatus?: string;
};

export function SearchField({
  id,
  label,
  value,
  placeholder,
  options,
  onChange,
  onEnter,
  selectionOnly = false,
  onUseCurrentLocation,
  locationStatus,
}: SearchFieldProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [draftValue, setDraftValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchIndex = createSearchIndex(options);
  const inputValue = selectionOnly ? draftValue : value;
  const filteredOptions = fuzzyOptions(searchIndex, inputValue);

  useEffect(() => {
    setDraftValue(value);
  }, [value]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (selectionOnly) {
      setDraftValue(event.target.value);
    } else {
      onChange(event.target.value);
    }
    setActiveIndex(-1);
    setOpen(true);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen && inputRef.current === document.activeElement) return;
    setOpen(nextOpen);
  }

  function selectOption(option: string) {
    setDraftValue(option);
    onChange(option);
    setActiveIndex(-1);
    setOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => Math.min(index + 1, filteredOptions.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter' && activeIndex >= 0) {
      event.preventDefault();
      selectOption(filteredOptions[activeIndex].value);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (selectionOnly && !options.includes(inputValue)) {
        setDraftValue(value);
        setOpen(false);
        return;
      }
      setOpen(false);
      onEnter?.();
    } else if (event.key === 'Escape') {
      if (selectionOnly) setDraftValue(value);
      setOpen(false);
    }
  }

  return (
    <div className="min-w-0">
      <Popover open={open} onOpenChange={handleOpenChange}>
        <label className="mb-1.5 block text-xs font-medium text-white" htmlFor={id}>
          {label}
        </label>
        <PopoverAnchor asChild>
          <div className="relative">
            <Input
              id={id}
              value={inputValue}
              ref={inputRef}
              onFocus={() => setOpen(true)}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                if (selectionOnly && !options.includes(inputValue)) setDraftValue(value);
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
              className={onUseCurrentLocation ? 'pr-12' : undefined}
            />
            {onUseCurrentLocation && (
              <button
                type="button"
                aria-label={t('search.useCurrentLocation')}
                title={t('search.useCurrentLocation')}
                className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-control text-brand-600 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
                onClick={onUseCurrentLocation}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="size-5 fill-none stroke-current"
                  strokeWidth="1.8"
                >
                  <path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z" />
                  <circle cx="12" cy="9" r="2.2" />
                </svg>
              </button>
            )}
          </div>
        </PopoverAnchor>
        {locationStatus && (
          <p className="mt-1 text-xs text-brand-100" role="status">
            {locationStatus}
          </p>
        )}
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
                  'w-full rounded-control px-3 py-2 text-left text-sm text-text outline-none hover:bg-brand-50',
                  index === activeIndex && 'bg-brand-50 font-medium',
                )}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => {
                  selectOption(option.value);
                }}
              >
                {option.value}
              </button>
            ))
          ) : (
            <PopoverEmpty>{t('search.noSuggestions')}</PopoverEmpty>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
