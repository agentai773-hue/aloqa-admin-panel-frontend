import { useState, useEffect } from 'react';

/**
 * Custom hook for debounced search functionality
 * @param initialValue - Initial search value
 * @param delay - Debounce delay in milliseconds (default: 500ms)
 * @returns object containing debouncedValue, searchValue, setSearchValue
 */
export const useDebounce = <T>(initialValue: T, delay: number = 500) => {
  const [searchValue, setSearchValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [searchValue, delay]);

  return {
    searchValue,
    debouncedValue,
    setSearchValue,
  };
};

/**
 * Custom hook specifically for search functionality with pagination reset
 * @param initialValue - Initial search value
 * @param delay - Debounce delay in milliseconds (default: 500ms)
 * @param onSearch - Callback function called when debounced search value changes
 * @returns object containing searchValue, debouncedValue, setSearchValue, isSearching
 */
export const useSearchDebounce = (
  initialValue: string = '',
  delay: number = 500,
  onSearch?: (value: string) => void
) => {
  const [searchValue, setSearchValue] = useState<string>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<string>(initialValue);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  useEffect(() => {
    setIsSearching(true);
    
    const timeoutId = setTimeout(() => {
      setDebouncedValue(searchValue);
      setIsSearching(false);
      onSearch?.(searchValue);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [searchValue, delay, onSearch]);

  return {
    searchValue,
    debouncedValue,
    setSearchValue,
    isSearching,
  };
};