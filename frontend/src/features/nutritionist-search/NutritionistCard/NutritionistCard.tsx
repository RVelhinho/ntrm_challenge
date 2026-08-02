import type {
  GetApiV1Nutritionists200ItemsItem,
  GetApiV1Nutritionists200ItemsItemServicesItem,
} from '../../../api/generated/models';
import { Button } from '../../../shared/ui/Button/Button';
import { Text } from '../../../shared/ui/Text/Text';
import { useTranslation } from 'react-i18next';
import { Icon } from '../../../shared/ui/Icon/Icon';
import { useState } from 'react';
import portrait from '../../../shared/assets/portrait.svg';

type NutritionistCardProps = {
  nutritionist: GetApiV1Nutritionists200ItemsItem;
  onSchedule: (service: GetApiV1Nutritionists200ItemsItemServicesItem) => void;
};

export function NutritionistCard({ nutritionist, onSchedule }: NutritionistCardProps) {
  const { t, i18n } = useTranslation();
  const [selectedServiceId, setSelectedServiceId] = useState(nutritionist.services[0]?.id);
  const selectedService =
    nutritionist.services.find((service) => service.id === selectedServiceId) ??
    nutritionist.services[0];
  const currency = new Intl.NumberFormat(i18n.language, {
    style: 'currency',
    currency: 'EUR',
  });
  return (
    <article className="grid min-h-60 content-start grid-cols-1 gap-y-8 rounded-card bg-white px-5 py-5 shadow-card sm:px-7 sm:py-6 lg:grid-cols-[auto_minmax(11rem,1.1fr)_minmax(15rem,1.4fr)_minmax(8.5rem,0.65fr)] lg:items-start lg:gap-x-10">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 lg:contents">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-600">
          <img src={portrait} alt="" className="size-12 rounded-full object-cover" />
        </div>
        <div className="min-w-0 lg:col-start-2">
          <Text as="h2" size="lg" weight="medium" className="truncate leading-5 text-brand-600">
            {nutritionist.name}
          </Text>
          {nutritionist.distance_km != null && (
            <Text tone="muted" size="sm" className="leading-4">
              {t('search.distance', {
                distance: nutritionist.distance_km.toFixed(1),
              })}
            </Text>
          )}
          {nutritionist.biography && (
            <Text tone="muted" size="sm" className="line-clamp-1 leading-4">
              {nutritionist.biography}
            </Text>
          )}
          {selectedService && (
            <>
              <Text size="sm" className="mt-3 truncate leading-4">
                {selectedService.name}
              </Text>
              <Text
                as="span"
                tone="muted"
                size="sm"
                className="flex items-center gap-1.5 leading-4"
              >
                <Icon name="map-pin" width={20} height={20} className="shrink-0 text-brand-300" />
                {selectedService.location}
              </Text>
              {nutritionist.services.length > 1 && (
                <label className="mt-3 flex items-center gap-1 text-text-muted">
                  <span className="sr-only">{t('search.service')}</span>
                  <select
                    aria-label={t('search.service')}
                    className="max-w-full truncate rounded-control border-0 bg-transparent p-0 text-text-muted outline-none focus:ring-2 focus:ring-brand-100"
                    value={selectedService.id}
                    onChange={(event) => setSelectedServiceId(Number(event.target.value))}
                  >
                    {nutritionist.services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                  <Icon name="chevron-down" width={14} height={14} strokeWidth={1.75} />
                </label>
              )}
            </>
          )}
        </div>
      </div>
      <ul className="grid min-w-0 gap-5 lg:col-start-3 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-5">
        {selectedService && (
          <li className="contents">
            <Metadata
              icon="clock"
              label={t('search.duration')}
              value={`${selectedService.duration_minutes} min`}
            />
            <Metadata
              icon="banknote"
              label={t('search.price')}
              value={currency.format(selectedService.price_cents / 100)}
              numeric
            />
            <span className="sr-only">
              {selectedService.location} {selectedService.duration_minutes} min
            </span>
          </li>
        )}
      </ul>
      <div className="flex min-w-0 flex-col gap-3 lg:col-start-4">
        <Button
          variant="accent"
          size="md"
          className="h-11 w-full whitespace-nowrap px-4"
          onClick={() => selectedService && onSchedule(selectedService)}
          disabled={!selectedService}
        >
          {t('nutritionist.schedule')}
        </Button>
        <Button variant="soft" size="md" disabled className="h-11 w-full whitespace-nowrap px-4">
          {t('nutritionist.personalPage')}
        </Button>
      </div>
    </article>
  );
}

function Metadata({
  icon,
  label,
  value,
  numeric = false,
}: {
  icon: 'clock' | 'banknote';
  label: string;
  value: string;
  numeric?: boolean;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <Icon name={icon} width={20} height={20} className="mt-0.5 shrink-0 text-brand-300" />
      <div className="min-w-0">
        <Text tone="muted" size="sm">
          {label}
        </Text>
        <Text size="sm" weight="medium" className={`truncate ${numeric ? 'tabular-nums' : ''}`}>
          {value}
        </Text>
      </div>
    </div>
  );
}
