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

  it('keeps suggestions open while focused and closes on blur', async () => {
    const user = userEvent.setup();
    render(
      <>
        <SearchField
          id="search"
          label="Name or service"
          value=""
          placeholder="Search"
          options={['Nutrition consultation']}
          onChange={vi.fn()}
        />
        <button type="button">Outside</button>
      </>,
    );

    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
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

  it('only changes the value after selecting a suggestion', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onEnter = vi.fn();
    render(
      <SearchField
        id="location"
        label="Location"
        value="Braga"
        placeholder="Location"
        options={['Braga', 'Porto']}
        onChange={onChange}
        onEnter={onEnter}
        selectionOnly
      />,
    );

    const input = screen.getByRole('combobox');
    await user.clear(input);
    await user.type(input, 'Unknown');
    await user.keyboard('{Enter}');

    expect(onChange).not.toHaveBeenCalled();
    expect(onEnter).not.toHaveBeenCalled();
    expect(input).toHaveValue('Braga');
  });
});
