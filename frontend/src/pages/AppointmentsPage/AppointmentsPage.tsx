import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Fuse from 'fuse.js';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '../../api/client';
import {
  getGetApiV1NutritionistsNutritionistIdAppointmentRequestsQueryKey,
  useGetApiV1NutritionistsNutritionistIdAppointmentRequests,
  usePatchApiV1AppointmentRequestsIdAccept,
  usePatchApiV1AppointmentRequestsIdReject,
} from '../../api/generated/appointment-requests/appointment-requests';
import { AppointmentCard } from '../../features/appointment-requests/AppointmentCard/AppointmentCard';
import { SearchField } from '../../features/nutritionist-search/SearchField/SearchField';
import { Button } from '../../shared/ui/Button/Button';
import { Icon } from '../../shared/ui/Icon/Icon';
import { Text } from '../../shared/ui/Text/Text';

const nutritionistId = 1;

export function AppointmentsPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const client = useQueryClient();
  const requests = useGetApiV1NutritionistsNutritionistIdAppointmentRequests(nutritionistId, {
    page,
    per_page: 50,
  });
  const accept = usePatchApiV1AppointmentRequestsIdAccept<ApiError>();
  const reject = usePatchApiV1AppointmentRequestsIdReject<ApiError>();
  const response = requests.data?.data;
  const filteredRequests = response
    ? new Fuse(response.items, {
        keys: ['guest.name', 'guest.email', 'service.name'],
        threshold: 0.35,
      })
        .search(search)
        .map(({ item }) => item)
    : [];
  const searchOptions = response
    ? Array.from(
        new Set(
          response.items.flatMap((request) => [
            request.guest.name,
            request.guest.email,
            request.service.name,
          ]),
        ),
      )
    : [];

  function refresh(nextMessage: string) {
    toast.success(nextMessage);
    void client.invalidateQueries({
      queryKey: getGetApiV1NutritionistsNutritionistIdAppointmentRequestsQueryKey(nutritionistId),
    });
  }

  function fail() {
    toast.error(t('requests.updateError'));
  }

  return (
    <div className="bg-page">
      <section className="bg-primary">
        <div className="mx-auto w-full max-w-6xl px-4 pb-6 pt-5 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <SearchField
              id="request-search"
              value={search}
              placeholder={t('requests.searchPlaceholder')}
              options={searchOptions}
              onChange={setSearch}
            />
          </div>
        </div>
      </section>
      <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
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
            {response && !search && (
              <nav aria-label={t('requests.pages')} className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0"
                  aria-label={t('common.previous')}
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                >
                  <Icon name="chevron-left" width={14} height={14} strokeWidth={1.75} />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0"
                  aria-label={t('common.next')}
                  onClick={() => setPage(page + 1)}
                  disabled={page >= response.meta.total_pages}
                >
                  <Icon name="chevron-right" width={14} height={14} strokeWidth={1.75} />
                </Button>
              </nav>
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
              <Button className="mt-3" variant="secondary" onClick={() => requests.refetch()}>
                {t('common.tryAgain')}
              </Button>
            </div>
          )}
          {response && (
            <>
              {filteredRequests.length === 0 ? (
                <Text
                  tone="muted"
                  size="sm"
                  role="status"
                  className="mt-6 rounded-card border-border bg-surface-subtle p-5"
                >
                  {search ? t('requests.noMatches') : t('requests.empty')}
                </Text>
              ) : (
                <div className="mt-6 grid items-stretch gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {filteredRequests.map((request) => (
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
      </section>
    </div>
  );
}

function RequestCardSkeleton() {
  return (
    <div className="flex min-h-[148px] flex-col animate-pulse rounded-card border border-border bg-surface">
      <div className="flex flex-1 items-start gap-3.5 px-4 py-4.5">
        <div className="h-11 w-11 shrink-0 rounded-full bg-surface-subtle" />
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
