import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SearchField } from './SearchField';

describe('SearchField', () => {
  afterEach(() => cleanup());

  it('opens suggestions on focus and selects with keyboard navigation', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <SearchField
        id="search"
        label="Name or service"
        value=""
        placeholder="Search"
        options={['Nutrition consultation', 'Sports nutrition']}
        onChange={onChange}
      />,
    );

    const input = screen.getByRole('combobox');
    await user.click(input);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenCalledWith('Nutrition consultation');
  });

  it('submits on Enter after selecting a suggestion', async () => {
    const user = userEvent.setup();
    const onEnter = vi.fn();
    render(
      <SearchField
        id="search"
        label="Name or service"
        value="Nutrition"
        placeholder="Search"
        options={['Nutrition consultation']}
        onChange={vi.fn()}
        onEnter={onEnter}
      />,
    );

    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.keyboard('{ArrowDown}{Enter}{Enter}');

    expect(onEnter).toHaveBeenCalledOnce();
  });

  it('submits when Enter is pressed after the dropdown is closed', async () => {
    const user = userEvent.setup();
    const onEnter = vi.fn();
    render(
      <SearchField
        id="search"
        label="Name or service"
        value="Nutrition"
        placeholder="Search"
        options={['Nutrition consultation']}
        onChange={vi.fn()}
        onEnter={onEnter}
      />,
    );

    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.keyboard('{Escape}{Enter}');

    expect(onEnter).toHaveBeenCalledOnce();
  });

  it('submits when Enter is pressed with the suggestions open', async () => {
    const user = userEvent.setup();
    const onEnter = vi.fn();
    render(
      <SearchField
        id="search"
        label="Name or service"
        value="Nutrition"
        placeholder="Search"
        options={['Nutrition consultation']}
        onChange={vi.fn()}
        onEnter={onEnter}
      />,
    );

    await user.click(screen.getByRole('combobox'));
    await user.keyboard('{Enter}');

    expect(onEnter).toHaveBeenCalledOnce();
  });
});
