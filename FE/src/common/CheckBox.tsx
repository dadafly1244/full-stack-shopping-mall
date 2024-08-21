interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, ...props }) => {
  return (
    <label className="inline-flex items-center">
      <input
        type="checkbox"
        className="form-checkbox h-5 w-5 text-gray-600 transition duration-150 ease-in-out"
        {...props}
      />
      {label && <span className="ml-2 text-gray-700">{label}</span>}
    </label>
  );
};
