import { AuthCredentials } from "types";

interface VendorDetailsProps {
  vendorDetails: AuthCredentials;
}

const VendorDetails: React.FC<VendorDetailsProps> = ({ vendorDetails }) => {

  if (!vendorDetails) return <div className="text-center text-gray-500 text-sm">Loading...</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-1">Client Details</h2>

      {/* Personal Information */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-gray-500">First Name</p>
          <p className="font-medium">{vendorDetails.fname || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-500">Last Name</p>
          <p className="font-medium">{vendorDetails.lname || "N/A"}</p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-gray-500">Email</p>
          <p className="font-medium">{vendorDetails.email || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-500">Phone</p>
          <p className="font-medium">{vendorDetails.phone || "N/A"}</p>
        </div>
      </div>

      {/* Company Information */}
      <div>
        <h3 className="text-md font-medium text-gray-700 border-b pb-1">Company</h3>
        <div className="grid grid-cols-2 gap-2 text-xs mt-1">
          <div>
            <p className="text-gray-500">Company Name</p>
            <p className="font-medium">{vendorDetails.companyName || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500">License Number</p>
            <p className="font-medium">{vendorDetails.licenseNum || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div>
        <h3 className="text-md font-medium text-gray-700 border-b pb-1">Address</h3>
        <div className="grid grid-cols-3 gap-2 text-xs mt-1">
          <div>
            <p className="text-gray-500">Street</p>
            <p className="font-medium">{vendorDetails.street || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500">City</p>
            <p className="font-medium">{vendorDetails.city || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500">State</p>
            <p className="font-medium">{vendorDetails.state || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Role & Status */}
      <div>
        <h3 className="text-md font-medium text-gray-700 border-b pb-1">Other Details</h3>
        <div className="grid grid-cols-2 gap-2 text-xs mt-1">
          <div>
            <p className="text-gray-500">Role</p>
            <p className="font-medium">{vendorDetails.role || "N/A"}</p>
          </div>
          <div>
            <p className="text-gray-500">Status</p>
            <p className="font-medium">{vendorDetails.statued || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;
