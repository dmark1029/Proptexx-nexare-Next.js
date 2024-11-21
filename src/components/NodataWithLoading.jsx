import CircularWithValueLabel from "./CircularWithValueLabel";

export default function TableNoDataAvailable({ loading, colSpan = 11 }) {
  return (
    <tr className="bg-white border-b  h-[200px]">
      <td colSpan={colSpan} className="px-6 py-4 text-center text-gray-900">
        {loading === true ? (
          <div>
            <CircularWithValueLabel />
          </div>
        ) : (
          "No data available"
        )}
      </td>
    </tr>
  );
}
