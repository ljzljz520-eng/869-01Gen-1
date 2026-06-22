import { forwardRef, type SelectHTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, placeholder, children, ...props }, ref) => {
    const [focused, setFocused] = useState(false);

    return (
      <div className="w-full">
        {label && (
          <label className="block mb-2 text-sm font-medium text-slate-300">{label}</label>
        )}
        <div className="relative">
          <select
            ref={ref}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={cn(
              'w-full px-4 py-3 text-base text-white rounded-xl',
              'bg-slate-800/60 backdrop-blur-sm border border-slate-600/50',
              'appearance-none cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50',
              'transition-all duration-200',
              focused && 'border-cyan-500/50',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {children}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';

interface MultiSelectOption {
  id: string;
  name: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  label?: string;
  placeholder?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  label,
  placeholder = '请选择',
}: MultiSelectProps) {
  const toggleOption = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter(s => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-3 text-sm font-medium text-slate-300">{label}</label>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map(option => {
          const isSelected = selected.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => toggleOption(option.id)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                'border backdrop-blur-sm',
                isSelected
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-800/40 text-slate-400 border-slate-600/50 hover:border-slate-500 hover:text-slate-300'
              )}
            >
              {option.name}
            </button>
          );
        })}
      </div>
      {selected.length === 0 && (
        <p className="mt-2 text-sm text-slate-500">{placeholder}</p>
      )}
    </div>
  );
}
