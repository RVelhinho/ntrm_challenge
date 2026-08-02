import { Link } from '@tanstack/react-router';
import { LanguageSwitcher } from '../../shared/ui/LanguageSwitcher/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { Icon } from '../../shared/ui/Icon/Icon';
import { Text } from '../../shared/ui/Text/Text';

export function Header() {
  const { t } = useTranslation();
  return (
    <header className="bg-brand-500">
      <div className="mx-auto flex h-11 w-full max-w-7xl items-center justify-between px-4 sm:h-12 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2">
          <Icon
            name="sprout"
            width={19}
            height={19}
            strokeWidth={2}
            className="shrink-0 text-white"
          />
          <Link to="/" className="tracking-[-0.01em]">
            <Text as="span" size="lg" weight="semibold" className="text-white">
              nutrium
            </Text>
          </Link>
        </div>
        <div className="ml-auto flex min-w-0 items-center gap-3">
          <a
            href="#"
            className="group hidden items-center gap-1.5 rounded-sm text-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-500 sm:inline-flex"
            onClick={(event) => event.preventDefault()}
          >
            <Text as="span" size="sm" className="text-white/70">
              {t('common.professionalIntro')}
            </Text>
            <Text as="span" size="sm" weight="medium" className="text-white">
              {t('common.professionalCta')}
            </Text>
            <Icon
              name="arrow-right"
              width={11}
              height={11}
              strokeWidth={1.75}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </a>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
