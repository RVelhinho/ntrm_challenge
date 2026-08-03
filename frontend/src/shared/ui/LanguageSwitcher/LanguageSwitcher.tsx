import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../../app/providers/LanguageProvider';
import { Button } from '../Button/Button';
import { DropdownContent, DropdownItem, DropdownRoot, DropdownTrigger } from '../Dropdown/Dropdown';

export function LanguageSwitcher() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownRoot>
      <DropdownTrigger>
        <Button variant="secondary" size="sm" aria-label={t('common.language')}>
          {language.toUpperCase()}
        </Button>
      </DropdownTrigger>
      <DropdownContent align="end" aria-label={t('common.language')}>
        <DropdownItem
          onSelect={() => setLanguage('en')}
          textValue={t('common.english')}
          data-dropdown-selected={language === 'en' ? 'true' : undefined}
          className={language === 'en' ? 'bg-primary-soft font-medium' : undefined}
        >
          {t('common.english')}
        </DropdownItem>
        <DropdownItem
          onSelect={() => setLanguage('pt')}
          textValue={t('common.portuguese')}
          data-dropdown-selected={language === 'pt' ? 'true' : undefined}
          className={language === 'pt' ? 'bg-primary-soft font-medium' : undefined}
        >
          {t('common.portuguese')}
        </DropdownItem>
      </DropdownContent>
    </DropdownRoot>
  );
}
