export const formatApiFields = (apiFields) => {
    return (
      <div className="rounded-lg p-4">
        <ul className="list-none p-0">
          {Object.entries(apiFields).map(([key, value], index) => {
            return (
              <li key={index} className="mb-4 flex  items-center">
                <span className="font-bold text-gray-50 mr-2">{key}:</span>
                <span className="italic text-gray-50">
                  {Array.isArray(value) ? value.join(', ') : value}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };
  