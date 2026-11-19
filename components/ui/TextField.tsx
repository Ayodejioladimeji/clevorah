type Option = { value: string; label: string };

type Props = {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  defaultChecked?: boolean;
  required?: boolean;
  multiline?: boolean;
  options?: Option[];
};

const control = "w-full border border-line bg-card px-3 py-2.5 text-[16px] leading-6 outline-none focus:border-ink";

export function TextField({
  label,
  name,
  type = "text",
  defaultValue,
  defaultChecked,
  required,
  multiline,
  options,
}: Props) {
  if (type === "checkbox") {
    return (
      <label className="flex items-center gap-2">
        <input type="checkbox" name={name} defaultChecked={defaultChecked} />
        <span>{label}</span>
      </label>
    );
  }
  return (
    <label className="grid gap-2">
      <span className="text-[14px] font-medium">{label}</span>
      {options ? (
        <select className={control} name={name} defaultValue={defaultValue} required={required}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : multiline ? (
        <textarea className={control} name={name} rows={4} defaultValue={defaultValue} required={required} />
      ) : (
        <input
          className={control}
          type={type}
          name={name}
          defaultValue={defaultValue}
          required={required}
          autoComplete={type === "email" ? "email" : undefined}
        />
      )}
    </label>
  );
}
