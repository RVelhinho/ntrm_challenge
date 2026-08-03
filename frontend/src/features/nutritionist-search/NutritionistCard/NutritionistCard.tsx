import type {
  GetApiV1Nutritionists200ItemsItem,
  GetApiV1Nutritionists200ItemsItemServicesItem,
} from '../../../api/generated/models';
import { Button } from '../../../shared/ui/Button/Button';
import { Image } from '../../../shared/ui/Image/Image';
import { Label } from '../../../shared/ui/Label/Label';
import { Text } from '../../../shared/ui/Text/Text';
import { useTranslation } from 'react-i18next';
import { Icon } from '../../../shared/ui/Icon/Icon';
import { useState } from 'react';
import femaleNutritionist from '../../../shared/assets/female_nutr_real.png';
import maleNutritionist from '../../../shared/assets/nutr_male_real.png';

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
  const portrait = nutritionist.gender === 'female' ? femaleNutritionist : maleNutritionist;
  const currency = new Intl.NumberFormat(i18n.language, {
    style: 'currency',
    currency: 'EUR',
  });
  return (
    <article className="grid min-h-60 content-start grid-cols-1 gap-y-8 rounded-card bg-surface px-5 py-5 shadow-card sm:px-7 sm:py-6 lg:grid-cols-[auto_minmax(11rem,1.1fr)_minmax(15rem,1.4fr)_minmax(15rem,0.65fr)] lg:items-start lg:gap-x-10">
      <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-x-4 lg:contents">
        <div className="grid h-25 w-25 shrink-0 place-items-center rounded-full">
          <div
            className={`grid place-items-center rounded-full ${nutritionist.gender === 'female' ? 'size-25' : 'size-22'}`}
          >
            <Image src={portrait} alt="" className="size-full rounded-full object-cover" />
          </div>
        </div>
        <div className="min-w-0 lg:col-span-2 lg:col-start-2">
          <Label className="mb-2">
            <Icon name="star" width={14} height={14} />
            {t('search.followUp')}
          </Label>
          <Text
            as="h1"
            size="xl"
            weight="medium"
            className="truncate leading-5 text-primary-text mb-2"
          >
            {nutritionist.name}
          </Text>
          {nutritionist.biography && (
            <Text tone="default" size="sm" className="line-clamp-1 leading-4 mb-10">
              {nutritionist.biography}
            </Text>
          )}
          {selectedService && (
            <div className="w-full flex justify-between">
              <div className="flex items-start">
                <Icon
                  name="map-pin"
                  width={24}
                  height={24}
                  className="shrink-0 text-primary me-2"
                />
                <div className="flex flex-col">
                  <Text size="sm" weight="semibold" className="truncate text-primary mt-1.5 mb-3">
                    {selectedService.name}
                  </Text>
                  <Text as="span" size="sm" className="flex items-center gap-1.5 leading-4">
                    {selectedService.location}
                  </Text>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center mb-2">
                  <Icon
                    name="suitcase"
                    width={24}
                    height={24}
                    className="shrink-0 text-primary me-2"
                  />
                  <select
                    aria-label={t('search.service')}
                    className="max-w-full truncate rounded-control border-0 bg-transparent p-0 outline-none focus:ring-2 focus:ring-primary-soft text-sm"
                    value={selectedService.id}
                    onChange={(event) => setSelectedServiceId(Number(event.target.value))}
                  >
                    {nutritionist.services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center">
                  <Icon
                    name="banknote"
                    width={24}
                    height={24}
                    className="shrink-0 text-primary me-2"
                  />
                  <Text size="sm" className="truncate content-center">
                    {currency.format(selectedService.price_cents / 100)}
                  </Text>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex min-w-0 flex-col gap-3 lg:col-start-4">
        <Button
          variant="accent"
          size="md"
          className="h-11 w-full whitespace-nowrap px-20"
          onClick={() => selectedService && onSchedule(selectedService)}
          disabled={!selectedService}
        >
          {t('nutritionist.schedule')}
        </Button>
        <Button variant="soft" size="md" disabled className="h-11 w-full whitespace-nowrap px-20">
          {t('nutritionist.personalPage')}
        </Button>
      </div>
    </article>
  );
}
