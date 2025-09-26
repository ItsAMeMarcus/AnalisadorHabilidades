
import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
}

const TextArea: React.FC<TextAreaProps> = ({ id, label, ...props }) => {
  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-gray-300">
        {label}
      </label>
      <textarea
        id={id}
        rows={8}
        className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-y disabled:opacity-50"
        {...props}
      ></textarea>
    </div>
  );
};

export default TextArea;
