import { Link } from '@tanstack/react-router';
import { LanguageSwitcher } from '../../components/shared/ui/LanguageSwitcher/LanguageSwitcher';
import { Image } from '../../components/shared/ui/Image/Image';
import { Icon } from '../../components/shared/ui/Icon/Icon';
import logo from '../../shared/assets/logo_nutrium_white.png';
import { useTranslation } from 'react-i18next';

export function Header() {
  const { t } = useTranslation();

  return (
    <header className="bg-primary opacity-90">
      <div className="mx-auto flex h-11 w-full max-w-6xl items-center justify-between px-4 sm:h-12 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2">
          <Link to="/" className="block" aria-label="Nutrium">
            <Image src={logo} alt="Nutrium" className="h-7 w-auto" />
          </Link>
        </div>
        <div className="ml-auto flex min-w-0 items-center gap-3">
          <Link
            to="/appointments"
            className="group hidden items-center gap-1.5 rounded-sm text-on-primary/80 hover:text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-border focus-visible:ring-offset-2 focus-visible:ring-offset-primary sm:inline-flex"
          >
            <span className="text-sm text-on-primary/90">{t('common.professionalIntro')}</span>{' '}
            <span className="text-sm font-medium text-on-primary/90">
              {t('common.professionalCta')}
            </span>
            <Icon
              name="arrow-right"
              width={11}
              height={11}
              strokeWidth={1.75}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
