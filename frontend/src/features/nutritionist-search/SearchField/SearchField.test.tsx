import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
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

  it('allows arbitrary text when options are omitted and does not render a popover', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onEnter = vi.fn();
    function ControlledSearchField() {
      const [value, setValue] = useState('Braga');
      return (
        <SearchField
          id="location"
          label="Location"
          value={value}
          placeholder="Location"
          onChange={(nextValue) => {
            onChange(nextValue);
            setValue(nextValue);
          }}
          onEnter={onEnter}
        />
      );
    }

    render(<ControlledSearchField />);

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'Unknown');
    await user.keyboard('{Enter}');

    expect(onChange).toHaveBeenLastCalledWith('Unknown');
    expect(onEnter).toHaveBeenCalledOnce();
    expect(input).toHaveValue('Unknown');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('always renders the controlled value', async () => {
    const user = userEvent.setup();
    const props = {
      id: 'location',
      label: 'Location',
      placeholder: 'Location',
      onChange: vi.fn(),
    };
    const { rerender } = render(<SearchField {...props} value="Braga" />);
    const input = screen.getByRole('textbox');
    await user.type(input, 'Lisbon');
    expect(props.onChange).toHaveBeenCalled();
    expect(input).toHaveValue('Braga');

    rerender(<SearchField {...props} value="Porto" />);
    expect(input).toHaveValue('Porto');
  });

  it('does not select or crash when keyboard navigation has no matching options', async () => {
    const user = userEvent.setup();
    const onEnter = vi.fn();
    render(
      <SearchField
        id="location"
        label="Location"
        value="Unknown"
        placeholder="Location"
        options={['Braga']}
        onChange={vi.fn()}
        onEnter={onEnter}
      />,
    );

    const input = screen.getByRole('combobox');
    await user.click(input);
    await user.keyboard('{ArrowUp}{Enter}');

    expect(onEnter).toHaveBeenCalledOnce();
  });
});
