import React from "react";

const Card = ({
  title,
  actions,
  children,
  className = ""
}) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-md border border-gray-200 ${className}`}
    >
      {/* Header */}
      {(title || actions) && (
        <div className="flex items-center justify-between px-5 py-4 border-b bg-gray-50 rounded-t-xl">
          {title && (
            <h3 className="text-base font-semibold text-gray-800">
              {title}
            </h3>
          )}

          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {children}
      </div>
    </div>
  );
};

export default Card;
