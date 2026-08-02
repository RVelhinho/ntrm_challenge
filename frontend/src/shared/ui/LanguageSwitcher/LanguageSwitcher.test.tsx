import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { afterEach, describe, expect, it } from 'vitest';
import { LanguageProvider } from '../../../app/providers/LanguageProvider';
import { i18n } from '../../../i18n/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';

describe('LanguageSwitcher', () => {
  afterEach(() => {
    cleanup();
    localStorage.removeItem('nutrium-language');
    void i18n.changeLanguage('en');
  });

  it('changes the active language through the shared provider', async () => {
    const user = userEvent.setup();
    render(
      <I18nextProvider i18n={i18n}>
        <LanguageProvider>
          <LanguageSwitcher />
        </LanguageProvider>
      </I18nextProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Language' }));
    await user.click(screen.getByRole('menuitem', { name: 'Portuguese' }));

    expect(document.documentElement.lang).toBe('pt');
    expect(localStorage.getItem('nutrium-language')).toBe('pt');

    await user.click(screen.getByRole('button', { name: 'Idioma' }));
    expect(screen.getByRole('menuitem', { name: 'Português' })).toHaveFocus();
  });

  it('starts keyboard navigation on the selected language', async () => {
    const user = userEvent.setup();
    render(
      <I18nextProvider i18n={i18n}>
        <LanguageProvider>
          <LanguageSwitcher />
        </LanguageProvider>
      </I18nextProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Language' }));
    expect(screen.getByRole('menuitem', { name: 'English' })).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Portuguese' })).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('menuitem', { name: 'English' })).toHaveFocus();
  });
});
