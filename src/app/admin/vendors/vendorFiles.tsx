// app/features/vendors/components/vendor-files.tsx
import { db } from "@/db/drizzle";
import { vendorFiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AuthCredentials } from "types";

interface VendorDetailsProps {
  vendorDetails: AuthCredentials;
}

const VendorFiles = async ({ vendorDetails }: VendorDetailsProps) => {
  if (!vendorDetails?.id) {
    return (
      <div className="text-center text-gray-500 text-sm">
        No vendor selected.
      </div>
    );
  }

  const files = await db
    .select()
    .from(vendorFiles)
    .where(eq(vendorFiles.userId, vendorDetails.id));

  if (!files.length) {
    return (
      <div className="text-center text-gray-500 text-sm mt-6">
        No files uploaded yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-blue-900 mb-2">
        Vendor Files
      </h2>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {files.map((file) => (
          <li
            key={file.uploadId}
            className="border border-gray-200 p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-800 font-medium truncate">
                  {file.fileTag ?? "Unnamed file"}
                </span>
                {file.fileUrl && (
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View
                  </a>
                )}
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  {file.uploadTimestamp
                    ? new Date(file.uploadTimestamp).toLocaleDateString()
                    : "No date"}
                </span>
                {file.expiration && (
                  <span className="text-gray-500">
                    Exp:{" "}
                    {new Date(file.expiration).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VendorFiles;
