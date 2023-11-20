import { useMemo } from 'react';
import { HStack, IconButton } from '@chakra-ui/react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import { useSearchParams } from 'react-router-dom';

export interface Pagination {
  limit: number;
  offset: number;
}

export const usePagination = ({ pageSize }: { pageSize: number }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = useMemo(() => {
    const parsed = Number.parseInt(searchParams.get('page') ?? '0');
    if (Number.isNaN(parsed)) {
      return 0;
    }
    return parsed;
  }, [searchParams]);

  return {
    pagination: {
      limit: pageSize,
      offset: pageSize * page,
    },
    Paginator: ({ total }: { total?: number }) => {
      const prevDisabled = useMemo(
        () => !total || page === 0,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [total, page],
      );
      const nextDisabled = useMemo(
        () => !total || page === Math.ceil(total / pageSize) - 1,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [total, page],
      );

      const onPrevClick = () =>
        setSearchParams({
          ...searchParams,
          page: Math.max(page - 1, 0).toString(),
        });
      const onNextClick = () =>
        setSearchParams({
          ...searchParams,
          page: (page + 1).toString(),
        });

      return (
        <HStack width="100%" justifyContent="flex-end">
          <IconButton
            aria-label="Previous page"
            onClick={onPrevClick}
            isDisabled={prevDisabled}
            icon={<HiChevronLeft />}
            size="sm"
            variant="outline"
          />
          <p>Page {page.toFixed(0)}</p>
          <IconButton
            aria-label={'Next page'}
            onClick={onNextClick}
            isDisabled={nextDisabled}
            icon={<HiChevronRight />}
            size="sm"
            variant="outline"
          />
        </HStack>
      );
    },
  };
};
