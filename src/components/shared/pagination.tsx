import cn from "classnames";
import { useMemo } from "react";
import Icons from "./icons";

const range = (start: number, end: number) => {
  let length = end - start + 1;
  /*
      Create an array of certain length and set the elements within it from
    start value to end value.
  */
  return Array.from({ length }, (_, idx) => idx + start);
};

const DOTS = "...";

const Pagination = ({
  onPageChange,
  totalCount,
  totalPage,
  siblingCount = 1,
  currentPage,
  pageLimit,
  className,
}: {
  onPageChange: (value: number) => void;
  totalCount: number;
  siblingCount?: number;
  currentPage: number;
  pageLimit: number;
  className?: string;
  totalPage?: number;
}) => {
  const paginationRange: (number | string)[] = useMemo(() => {
    const totalPageCount = totalPage ?? Math.ceil(totalCount / pageLimit);

    // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
    const totalPageNumbers = siblingCount + 5;

    /*
      Case 1:
      If the number of pages is less than the page numbers we want to show in our
      paginationComponent, we return the range [1..totalPageCount]
    */
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    /*
        Calculate left and right sibling index and make sure they are within range 1 and totalPageCount
    */
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

    /*
      We do not show dots just when there is just one page number to be inserted between the extremes of sibling and the page limits i.e 1 and totalPageCount. Hence we are using leftSiblingIndex > 2 and rightSiblingIndex < totalPageCount - 2
    */
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    /*
        Case 2: No left dots to show, but rights dots to be shown
    */
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);

      return [...leftRange, DOTS, totalPageCount];
    }

    /*
        Case 3: No right dots to show, but left dots to be shown
    */
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      );
      return [firstPageIndex, DOTS, ...rightRange];
    }

    /*
        Case 4: Both left and right dots to be shown
    */
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    } else {
      return [];
    }
  }, [totalCount, pageLimit, siblingCount, currentPage]);

  // If there are less than 2 times in pagination range we shall not render the component
  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];
  return (
    <ul className={cn("flex gap-2 items-center justify-center", className)}>
      <button
        className={cn("p-1 border border-grey-300 rounded-[6px] text-black")}
        disabled={currentPage === 1}
        onClick={onPrevious}
      >
        {Icons.ic_chevron_left}
      </button>

      <div className="flex items-center gap-[2px]">
        {paginationRange.map((pageNumber: number | string, index: number) => {
          if (pageNumber === DOTS) {
            return (
              <li className="pagination-item dots" key={index}>
                ...
              </li>
            );
          }

          return (
            <button
              key={index}
              className={cn(
                "py-2 px-3 text-xs 3xl:text-sm",
                pageNumber === currentPage
                  ? "text-black border border-primary-400 rounded-[6px]"
                  : "text-grey-400"
              )}
              onClick={() => onPageChange(pageNumber as number)}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      <button
        className={cn("p-1 border border-grey-300 rounded-[6px] text-black")}
        disabled={currentPage === lastPage}
        onClick={onNext}
      >
        {Icons.ic_chevron_right}
      </button>
    </ul>
  );
};

export default Pagination;
