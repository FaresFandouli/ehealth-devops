import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import Button from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  size?: 'sm' | 'md' | 'lg';
  showFirstLast?: boolean;
  showJumper?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  size = 'md',
  showFirstLast = true,
  showJumper = false,
}) => {
  const [jumpPage, setJumpPage] = React.useState('');

  if (totalPages <= 1) return null;

  const handleJump = () => {
    const page = parseInt(jumpPage, 10);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setJumpPage('');
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    const halfVisible = Math.floor(maxVisible / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    if (endPage - startPage < maxVisible - 1) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisible - 1);
      } else {
        startPage = Math.max(1, endPage - maxVisible + 1);
      }
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const buttonSize = size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md';
  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-1">
        {showFirstLast && (
          <>
            <Button
              variant="outline"
              size={buttonSize}
              disabled={currentPage === 1}
              onClick={() => onPageChange(1)}
              icon={<ChevronsLeft className="h-4 w-4" />}
              aria-label="First page"
            />
            <span className="px-1" />
          </>
        )}

        <Button
          variant="outline"
          size={buttonSize}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          icon={<ChevronLeft className="h-4 w-4" />}
          aria-label="Previous page"
        />

        <div className="flex items-center gap-1">
          {pageNumbers.map((page, idx) =>
            page === '...' ? (
              <span key={idx} className="px-2 text-gray-500">
                ...
              </span>
            ) : (
              <Button
                key={idx}
                variant={page === currentPage ? 'primary' : 'outline'}
                size={buttonSize}
                onClick={() => onPageChange(page as number)}
              >
                {page}
              </Button>
            )
          )}
        </div>

        <Button
          variant="outline"
          size={buttonSize}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          icon={<ChevronRight className="h-4 w-4" />}
          aria-label="Next page"
        />

        {showFirstLast && (
          <>
            <span className="px-1" />
            <Button
              variant="outline"
              size={buttonSize}
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(totalPages)}
              icon={<ChevronsRight className="h-4 w-4" />}
              aria-label="Last page"
            />
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        {showJumper && (
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max={totalPages}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleJump()}
              placeholder="Jump to..."
              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
            />
            <Button size="sm" onClick={handleJump}>
              Go
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pagination;
