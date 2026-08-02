import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { reverseGeocode, type Coordinates } from '../../api/geocoding';
import { useGetApiV1Nutritionists } from '../../api/generated/nutritionists/nutritionists';
import type {
  GetApiV1Nutritionists200ItemsItem,
  GetApiV1Nutritionists200ItemsItemServicesItem,
} from '../../api/generated/models';
import { Button } from '../../shared/ui/Button/Button';
import { Text } from '../../shared/ui/Text/Text';
import { AppointmentRequestModal } from '../../features/nutritionist-search/AppointmentRequestModal/AppointmentRequestModal';
import { NutritionistCard } from '../../features/nutritionist-search/NutritionistCard/NutritionistCard';
import { SearchField } from '../../features/nutritionist-search/SearchField/SearchField';
import { locationOptions, searchOptions } from '../../features/nutritionist-search/search-options';
import { Icon } from '../../shared/ui/Icon/Icon';

type Selection = {
  nutritionist: GetApiV1Nutritionists200ItemsItem;
  service: GetApiV1Nutritionists200ItemsItemServicesItem;
};
type SubmittedSearch = {
  query: string;
  location: string;
  coordinates?: Coordinates;
};

export function NutritionistSearchPage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('Braga');
  const [page, setPage] = useState(1);
  const [selection, setSelection] = useState<Selection>();
  const [coordinates, setCoordinates] = useState<Coordinates>();
  const [submitted, setSubmitted] = useState<SubmittedSearch>({
    query: '',
    location: 'Braga',
  });
  const [locationStatus, setLocationStatus] = useState('');
  const results = useGetApiV1Nutritionists({
    q: submitted.query || undefined,
    location: submitted.location || undefined,
    latitude: submitted.coordinates?.latitude,
    longitude: submitted.coordinates?.longitude,
    page,
    per_page: 1,
  });
  const catalog = useGetApiV1Nutritionists({ page: 1, per_page: 50 });
  const response = results.data?.data;
  const options = searchOptions(catalog.data?.data.items);
  const locations = locationOptions(catalog.data?.data.items);

  function search() {
    setPage(1);
    setSubmitted({
      query: query.trim(),
      location: location.trim(),
      coordinates,
    });
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationStatus(t('search.locationUnavailable'));
      return;
    }
    setLocationStatus(t('search.findingLocation'));
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const currentCoordinates = {
          latitude: coords.latitude,
          longitude: coords.longitude,
        };
        setCoordinates(currentCoordinates);
        try {
          const currentLocation = (await reverseGeocode(currentCoordinates)) ?? 'Braga';
          setLocation(currentLocation);
          setLocationStatus(t('search.locationSet', { location: currentLocation }));
        } catch {
          setLocation(t('search.currentLocation'));
          setLocationStatus(t('search.locationCoordinatesReady'));
        }
      },
      () => setLocationStatus(t('search.locationDenied')),
    );
  }

  return (
    <div className="bg-page">
      <section className="bg-brand-500 pb-7 pt-2">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
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
                placeholder={t('search.nameOrServicePlaceholder')}
                options={options}
              />
              <SearchField
                id="nutritionist-location"
                value={location}
                onChange={(value) => {
                  setLocation(value);
                  setCoordinates(undefined);
                  setLocationStatus('');
                }}
                onEnter={search}
                placeholder={t('search.locationPlaceholder')}
                options={locations}
                onUseCurrentLocation={useCurrentLocation}
                locationStatus={locationStatus}
              />
              <div className="flex gap-2">
                <Button type="submit" variant="search" className="flex-1 sm:flex-none px-10">
                  {t('common.search')}
                </Button>
              </div>
            </form>
          </section>
        </div>
      </section>
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
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
            <div className="mt-2 flex items-center justify-between gap-4">
              <h2 className="text-base font-medium text-text-strong">
                {response.meta.location_mode === 'nearest'
                  ? t('search.nearestResults', {
                      location: response.meta.location ?? t('search.currentLocation'),
                    })
                  : response.meta.location_mode === 'all'
                    ? t('search.availableAll')
                    : t('search.availableNear', {
                        location: response.meta.location,
                      })}
              </h2>
              <Text tone="muted" size="sm">
                {t('search.found', { count: response.meta.total_count })}
              </Text>
            </div>
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
                    onSchedule={(service) => {
                      setSelection({
                        nutritionist,
                        service,
                      });
                    }}
                  />
                ))}
              </div>
            )}
            <nav
              aria-label={t('search.resultsPages')}
              className="mt-6 flex items-start justify-start"
            >
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 border-none rounded-none rounded-l-sm shadow-none"
                aria-label={t('common.previous')}
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
              >
                <Icon name="chevron-left" width={13} height={13} strokeWidth={1.75} />
              </Button>
              {Array.from(
                { length: Math.max(response.meta.total_pages, 1) },
                (_, index) => index + 1,
              ).map((pageNumber) => (
                <Button
                  key={pageNumber}
                  size="sm"
                  variant={pageNumber === page ? 'soft' : 'secondary'}
                  className="h-8 w-8 p-0 text-xs border-none rounded-none shadow-none"
                  aria-label={`${t('search.resultsPages')} ${pageNumber}`}
                  aria-current={pageNumber === page ? 'page' : undefined}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </Button>
              ))}
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 border-none rounded-none rounded-r-sm shadow-none"
                aria-label={t('common.next')}
                onClick={() => setPage(page + 1)}
                disabled={page >= response.meta.total_pages}
              >
                <Icon name="chevron-right" width={13} height={13} strokeWidth={1.75} />
              </Button>
            </nav>
          </>
        )}
        {selection && (
          <AppointmentRequestModal
            nutritionistName={selection.nutritionist.name}
            service={selection.service}
            onClose={() => setSelection(undefined)}
            onSuccess={() => toast.success(t('appointment.success'))}
          />
        )}
      </div>
    </div>
  );
}
