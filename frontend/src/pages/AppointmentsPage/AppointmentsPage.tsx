import { useDeferredValue, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '../../api/client';
import {
  getApiV1AppointmentRequests,
  usePatchApiV1AppointmentRequestsIdAccept,
  usePatchApiV1AppointmentRequestsIdReject,
} from '../../api/generated/appointment-requests/appointment-requests';
import { AppointmentCard } from '../../features/appointment-requests/AppointmentCard/AppointmentCard';
import { SearchField } from '../../features/nutritionist-search/SearchField/SearchField';
import { Button } from '../../components/shared/ui/Button/Button';
import { Pagination } from '../../components/shared/ui/Pagination/Pagination';
import { Text } from '../../components/shared/ui/Text/Text';
import { APPOINTMENT_REQUESTS_PAGE_LIMIT } from '../../features/appointment-requests/constants';
import { showErrorToast, showSuccessToast } from '../../shared/utils/toast-notifications';
import { PageContainer } from '../../app/layout/RootLayout';

export function AppointmentsPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [cursorStack, setCursorStack] = useState<string[]>([]);
  const deferredSearch = useDeferredValue(search.trim());
  const currentCursor = cursorStack.at(-1);
  const currentPage = cursorStack.length + 1;
  const client = useQueryClient();
  const requests = useQuery({
    queryKey: [
      'appointment-requests',
      {
        search: deferredSearch,
        status: 'pending',
        cursor: currentCursor,
        pageSize: APPOINTMENT_REQUESTS_PAGE_LIMIT,
      },
    ],
    placeholderData: keepPreviousData,
    queryFn: async ({ signal }) => {
      const response = await getApiV1AppointmentRequests(
        {
          q: deferredSearch || undefined,
          status: 'pending',
          cursor: currentCursor,
          limit: APPOINTMENT_REQUESTS_PAGE_LIMIT,
        },
        { signal },
      );

      if (response.status !== 200) throw new Error('Failed to load appointment requests');
      return response.data;
    },
  });
  const accept = usePatchApiV1AppointmentRequestsIdAccept<ApiError>();
  const reject = usePatchApiV1AppointmentRequestsIdReject<ApiError>();
  const response = requests.data;

  function refresh(nextMessage: string) {
    showSuccessToast(nextMessage);
    setCursorStack([]);
    void client.invalidateQueries({
      queryKey: ['appointment-requests'],
    });
  }

  function fail() {
    showErrorToast(t('requests.updateError'));
  }

  return (
    <div className="bg-page">
      <section className="bg-primary">
        <PageContainer className="pb-6 pt-5">
          <div className="max-w-xl">
            <SearchField
              id="request-search"
              value={search}
              label={t('requests.searchLabel')}
              placeholder={t('requests.searchPlaceholder')}
              onChange={(value) => {
                setSearch(value);
                setCursorStack([]);
              }}
            />
          </div>
        </PageContainer>
      </section>
      <PageContainer className="py-6" as="section">
        <div className="rounded-panel border-border bg-surface p-4 shadow-panel sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <Text as="h1" size="lg" weight="medium" className="text-text-strong">
                {t('requests.title')}
              </Text>
              <Text as="p" size="sm" tone="muted" className="mt-1">
                {t('requests.description')}
              </Text>
            </div>
            {response && (
              <Pagination
                label={t('requests.pagination')}
                currentPage={currentPage}
                hasPreviousPage={cursorStack.length > 0 && !requests.isFetching}
                hasNextPage={response.page_info.has_next_page && !requests.isFetching}
                onPageChange={(page) => {
                  if (requests.isFetching) return;
                  if (page < currentPage) {
                    setCursorStack((stack) => stack.slice(0, -1));
                  } else if (page > currentPage && response.page_info.next_cursor) {
                    setCursorStack((stack) => [...stack, response.page_info.next_cursor as string]);
                  }
                }}
              />
            )}
          </div>
          {requests.isLoading && (
            <div
              className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3"
              role="status"
              aria-label={t('requests.loading')}
            >
              {[0, 1, 2].map((index) => (
                <RequestCardSkeleton key={index} />
              ))}
            </div>
          )}
          {requests.isError && (
            <div
              className="mt-6 rounded-card border border-danger-text/20 bg-danger-soft px-4 py-3"
              role="alert"
            >
              <Text tone="danger" size="sm">
                {t('requests.error')}
              </Text>
              <Button className="mt-3" variant="secondary" onClick={() => void requests.refetch()}>
                {t('common.tryAgain')}
              </Button>
            </div>
          )}
          {response && (
            <>
              {response.data.length === 0 ? (
                <Text
                  tone="muted"
                  size="sm"
                  role="status"
                  className="mt-6 flex min-h-[148px] items-center justify-center rounded-card border-border bg-surface-subtle p-5 text-center"
                >
                  {search ? t('requests.noMatches') : t('requests.empty')}
                </Text>
              ) : (
                <div className="mt-6 grid items-stretch gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {response.data.map((request) => (
                    <AppointmentCard
                      key={request.id}
                      request={request}
                      accepting={accept.isPending && accept.variables?.id === request.id}
                      rejecting={reject.isPending && reject.variables?.id === request.id}
                      onAccept={() =>
                        accept.mutate(
                          { id: request.id },
                          {
                            onSuccess: () => refresh(t('requests.accepted')),
                            onError: fail,
                          },
                        )
                      }
                      onReject={() =>
                        reject.mutate(
                          { id: request.id },
                          {
                            onSuccess: () => refresh(t('requests.rejected')),
                            onError: fail,
                          },
                        )
                      }
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </PageContainer>
    </div>
  );
}

function RequestCardSkeleton() {
  return (
    <div className="flex min-h-[172px] flex-col animate-pulse rounded-card border border-border bg-surface">
      <div className="flex flex-1 items-start gap-3.5 px-4 py-4.5">
        <div className="h-20 w-20 shrink-0 rounded-full bg-surface-subtle" />
        <div className="space-y-2">
          <div className="h-2.5 w-24 rounded bg-border" />
          <div className="h-2 w-20 rounded bg-surface-subtle" />
          <div className="h-2 w-28 rounded bg-surface-subtle" />
          <div className="h-2 w-16 rounded bg-surface-subtle" />
        </div>
      </div>
      <div className="border-t border-border px-4 py-3">
        <div className="h-8 w-full rounded-control bg-surface-subtle" />
      </div>
    </div>
  );
}
