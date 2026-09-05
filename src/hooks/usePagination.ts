import { useState, useMemo, useCallback } from 'react';

interface UsePaginationOptions<T> {
  items: T[];
  pageSize?: number;
  initialPage?: number;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  currentItems: T[];
  hasPrevious: boolean;
  hasNext: boolean;
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  setPageSize: (size: number) => void;
  pageNumbers: number[];
}

export function usePagination<T>({
  items,
  pageSize: initialPageSize = 10,
  initialPage = 1,
}: UsePaginationOptions<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  // Ensure current page is within bounds
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const currentItems = useMemo(() => {
    return items.slice(startIndex, endIndex);
  }, [items, startIndex, endIndex]);

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const showPages = 5; // Pages to show around current
    const start = Math.max(1, safePage - Math.floor(showPages / 2));
    const end = Math.min(totalPages, start + showPages - 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }, [safePage, totalPages]);

  const goToPage = useCallback((page: number) => {
    const pageNumber = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(pageNumber);
  }, [totalPages]);

  const goToNextPage = useCallback(() => {
    if (safePage < totalPages) {
      setCurrentPage((p) => p + 1);
    }
  }, [safePage, totalPages]);

  const goToPreviousPage = useCallback(() => {
    if (safePage > 1) {
      setCurrentPage((p) => p - 1);
    }
  }, [safePage]);

  const handleSetPageSize = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  return {
    currentPage: safePage,
    totalPages,
    pageSize,
    totalItems,
    startIndex,
    endIndex,
    currentItems,
    hasPrevious: safePage > 1,
    hasNext: safePage < totalPages,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    setPageSize: handleSetPageSize,
    pageNumbers,
  };
}
