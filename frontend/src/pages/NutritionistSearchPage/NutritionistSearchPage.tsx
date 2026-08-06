import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type {
  GetApiV1Nutritionists200ItemsItem,
  GetApiV1Nutritionists200ItemsItemServicesItem,
} from '../../api/generated/models';
import { useGetApiV1Nutritionists } from '../../api/generated/nutritionists/nutritionists';
import { Button } from '../../components/shared/ui/Button/Button';
import { Pagination } from '../../components/shared/ui/Pagination/Pagination';
import { Text } from '../../components/shared/ui/Text/Text';
import { AppointmentRequestModal } from '../../features/nutritionist-search/AppointmentRequestModal/AppointmentRequestModal';
import {
  DEFAULT_LOCATION,
  NUTRITIONIST_PAGE_LIMIT,
} from '../../features/nutritionist-search/constants';
import { NutritionistCard } from '../../features/nutritionist-search/NutritionistCard/NutritionistCard';
import { SearchField } from '../../features/nutritionist-search/SearchField/SearchField';
import { showSuccessToast } from '../../shared/utils/toast-notifications';
import { PageContainer } from '../../app/layout/RootLayout';

type Selection = {
  nutritionist: GetApiV1Nutritionists200ItemsItem;
  service: GetApiV1Nutritionists200ItemsItemServicesItem;
};

type SubmittedSearch = {
  query: string;
  location: string;
};

export function NutritionistSearchPage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [currentPage, setCurrentPage] = useState(1);
  const [selection, setSelection] = useState<Selection>();
  const [submitted, setSubmitted] = useState<SubmittedSearch>({
    query: '',
    location: DEFAULT_LOCATION,
  });
  const results = useGetApiV1Nutritionists({
    q: submitted.query || undefined,
    location: submitted.location,
    page: currentPage,
    limit: NUTRITIONIST_PAGE_LIMIT,
  });
  const response = results.data?.status === 200 ? results.data.data : undefined;
  const displayedLocation =
    location === submitted.location && response?.location ? response.location : location;

  function search() {
    const normalizedLocation = displayedLocation.trim() || DEFAULT_LOCATION;
    setCurrentPage(1);
    setLocation(normalizedLocation);
    setSubmitted({
      query: query.trim(),
      location: normalizedLocation,
    });
  }

  return (
    <div className="bg-page">
      <section className="bg-primary pb-7 pt-2">
        <PageContainer>
          <section aria-label={t('search.searchLabel')} className="mt-5">
            <form
              className="grid gap-3 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1.2fr)_auto] sm:items-end"
              onSubmit={(event) => {
                event.preventDefault();
                search();
              }}
            >
              <SearchField
                id="nutritionist-query"
                value={query}
                onChange={setQuery}
                onEnter={search}
                label={t('search.nameOrService')}
                placeholder={t('search.nameOrServicePlaceholder')}
              />
              <SearchField
                id="nutritionist-location"
                value={displayedLocation}
                onChange={setLocation}
                onEnter={search}
                label={t('search.location')}
                placeholder={t('search.locationPlaceholder')}
                options={response?.locations ?? []}
              />
              <div className="flex gap-2">
                <Button type="submit" variant="search" className="flex-1 px-10 sm:flex-none">
                  {t('common.search')}
                </Button>
              </div>
            </form>
          </section>
        </PageContainer>
      </section>
      <PageContainer className="py-0">
        {results.isLoading && (
          <Text className="mt-2" tone="muted" role="status">
            {t('search.loading')}
          </Text>
        )}
        {results.isError && (
          <div
            className="mt-2 rounded-card border border-danger-text/20 bg-danger-soft px-4 py-3"
            role="alert"
          >
            <Text tone="danger">{t('search.error')}</Text>
            <Button className="mt-3" variant="secondary" onClick={() => results.refetch()}>
              {t('common.tryAgain')}
            </Button>
          </div>
        )}
        {response && (
          <>
            {response.items.length === 0 ? (
              <Text tone="muted" className="mt-5">
                {t('search.noResults')}
              </Text>
            ) : (
              <div className="mt-4 grid gap-4">
                {response.items.map((nutritionist) => (
                  <NutritionistCard
                    key={nutritionist.id}
                    nutritionist={nutritionist}
                    onSchedule={(service) => setSelection({ nutritionist, service })}
                  />
                ))}
              </div>
            )}
            {response.page_info.total_count > 0 && (
              <Pagination
                className="mt-6 justify-start"
                label={t('search.resultsPagination')}
                currentPage={currentPage}
                hasPreviousPage={response.page_info.has_previous_page && !results.isFetching}
                pages={Array.from(
                  { length: response.page_info.total_pages },
                  (_, index) => index + 1,
                )}
                hasNextPage={response.page_info.has_next_page && !results.isFetching}
                onPageChange={(page) => {
                  if (!results.isFetching) setCurrentPage(page);
                }}
              />
            )}
          </>
        )}
        {selection && (
          <AppointmentRequestModal
            nutritionistName={selection.nutritionist.name}
            service={selection.service}
            onClose={() => setSelection(undefined)}
            onSuccess={() => {
              setCurrentPage(1);
              showSuccessToast(t('appointment.success'));
            }}
          />
        )}
      </PageContainer>
    </div>
  );
}
