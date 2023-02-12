const FormRow = ({
  type,
  name,
  handleChange,
  value,
  labelText,
  autoComplete,
}) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>
      <input
        type={type}
        value={value}
        name={name}
        className="form-input"
        onChange={handleChange}
        autoComplete={autoComplete}
      />
    </div>
  );
};

export default FormRow;
