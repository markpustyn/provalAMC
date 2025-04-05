import { OpenOrder } from "types";

interface DetailsProps {
  orderDetails: OpenOrder;
}

const Details: React.FC<DetailsProps> = ({ orderDetails }) => {
  if (!orderDetails) return <div className="text-center text-gray-500 text-sm">Loading...</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-1">Order Details</h2>

      {/* Loan Information */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-gray-500">Loan Number</p>
          <p className="font-medium">{orderDetails.loanNumber || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-500">Loan Officer</p>
          <p className="font-medium">{orderDetails.loanOfficer || "N/A"}</p>
        </div>
      </div>

      {/* Lender Information */}
      <div>
        <h3 className="text-md font-medium text-gray-700 border-b pb-1">Lender</h3>
        <div className="grid grid-cols-2 gap-2 text-xs mt-1">
          <div>
            <p className="text-gray-500">Lender</p>
            <p className="font-medium">{orderDetails.lender || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500">City</p>
            <p className="font-medium">{orderDetails.lenderCity || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Borrower Information */}
      <div>
        <h3 className="text-md font-medium text-gray-700 border-b pb-1">Borrower</h3>
        <div className="grid grid-cols-2 gap-2 text-xs mt-1">
          <div>
            <p className="text-gray-500">Name</p>
            <p className="font-medium">{orderDetails.borrowerName || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500">Phone</p>
            <p className="font-medium">{orderDetails.borrowerPhoneNumber || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div>
        <h3 className="text-md font-medium text-gray-700 border-b pb-1">Subject Property</h3>
        <div className="grid grid-cols-3 gap-2 text-md mt-1">
          <div>
            <p className="text-gray-500">Address</p>
            <p className="font-medium">{orderDetails.propertyAddress || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500">City</p>
            <p className="font-medium">{orderDetails.propertyCity || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500">State</p>
            <p className="font-medium">{orderDetails.propertyState || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div>
        <h3 className="text-md font-medium text-gray-700 border-b pb-1">Order</h3>
        <div className="grid grid-cols-2 gap-2 text-xs mt-1">
          <div>
            <p className="text-gray-500">Type</p>
            <p className="font-medium">{orderDetails.orderType || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500">Product</p>
            <p className="font-medium">{orderDetails.mainProduct || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      {orderDetails.description && (
        <div>
          <h3 className="text-md font-medium text-gray-700 border-b pb-1">Description</h3>
          <p className="text-xs text-gray-700 mt-1">{orderDetails.description}</p>
        </div>
      )}
    </div>
  );
};

export default Details;
