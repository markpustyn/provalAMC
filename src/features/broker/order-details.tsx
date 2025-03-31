import { AuthCredentials, OpenOrder } from "types";

interface VendorDetailsProps {
    OrderDetails: OpenOrder;
}

const OrderDetails: React.FC<VendorDetailsProps> = ({ OrderDetails }) => {

  if (!OrderDetails) return <div className="text-center text-gray-500 text-sm">Loading...</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-1">Order Details</h2>

      {/* Personal Information */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-gray-500">First Name</p>
          <p className="font-medium">{OrderDetails.borrowerName || "N/A"}</p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-gray-500">Email</p>
          <p className="font-medium">{OrderDetails.borrowerEmail || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-500">Phone</p>
          <p className="font-medium">{OrderDetails.borrowerPhoneNumber || "N/A"}</p>
        </div>
      </div>
      {/* Address Information */}
      <div>
        <h3 className="text-md font-medium text-gray-700 border-b pb-1">Address</h3>
        <div className="grid grid-cols-3 gap-2 text-xs mt-1">
          <div>
            <p className="text-gray-500">Street</p>
            <p className="font-medium">{OrderDetails.propertyAddress || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500">City</p>
            <p className="font-medium">{OrderDetails.propertyCity || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500">State</p>
            <p className="font-medium">{OrderDetails.propertyState || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500">Zip</p>
            <p className="font-medium">{OrderDetails.propertyZip || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Role & Status */}
      <div>
        <h3 className="text-md font-medium text-gray-700 border-b pb-1">Other Details</h3>
        <div className="grid grid-cols-2 gap-2 text-xs mt-1">
          <div>
            <p className="text-gray-500">Order Type</p>
            <p className="font-medium">{OrderDetails.mainProduct || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500">Property</p>
            <p className="font-medium">{OrderDetails.orderType || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
