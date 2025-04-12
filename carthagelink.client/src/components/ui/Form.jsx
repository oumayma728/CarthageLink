import PropTypes from 'prop-types';
import { useState } from 'react';

export default function Form({
  fields = [],
  values = {},
  onChange,
  onSubmit,
  buttonText = "Submit"
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-6"
    >
      {fields.map((field) => {
        const fieldValue = values?.[field.name] ?? "";

        return (
          <div key={field.name}>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              value={
                Array.isArray(fieldValue)
                  ? fieldValue.join(",") // Handle AssignedDevices
                  : fieldValue
              }
              onChange={onChange}
              required={field.required}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder={field.placeholder || `Enter ${field.label}`}
            />
            {field.helperText && (
              <p className="mt-1 text-xs text-gray-500">{field.helperText}</p>
            )}
          </div>
        );
      })}

      <div className="mt-8 flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => (window.location = "/")}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          {buttonText}
        </button>
      </div>
    </form>
  );
}


Form.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['text', 'email', 'number', 'password', 'checkbox', 'textarea']),
  })).isRequired,
  initialValues: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  validationSchema: PropTypes.object,
  buttonText: PropTypes.string,
};
