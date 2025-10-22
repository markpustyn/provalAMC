'use client';

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type SavedZip = { 
  zipCode: string,
  county: string
};

type ServiceAreaProps = {
  sessionId: string;
};

const PAGE_SIZE = 15;

export function ListedZips({ sessionId }: ServiceAreaProps) {
  const [savedZips, setSavedZips] = useState<SavedZip[]>([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    async function fetchSavedZips() {
      try {
        const res = await fetch(`/api/liszips?userId=${sessionId}`);
        const data = await res.json();
        setSavedZips(data);
      } catch (error) {
        console.error("Failed to fetch saved zips:", error);
      }
    }

    fetchSavedZips();
  }, []);
  const zipLength = savedZips.length


  const totalPages = Math.ceil(zipLength / PAGE_SIZE);
  const currentPageZips = savedZips.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="py-4 mx-auto w-full">
      <Card className="shadow-xl rounded-3xl border border-muted p-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold ">
            Currently Servicing ZIP Codes
          </CardTitle>
              {totalPages > 1 && (
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage(prev => prev - 1)}
                    className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-md">
                    Page {page + 1} of {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage(prev => prev + 1)}
                    className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
        </CardHeader>

        <CardContent className="space-y-4">
          {savedZips.length > 0 ? (
            <div>
              <table className="w-full text-sm text-left border-collapse border rounded">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="p-2 border">#</th>
                    <th className="p-2 border">ZIP Code</th>
                    <th className="p-2 border">County</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageZips.map((zip, index) => (
                    <tr key={zip.zipCode} className="even:bg-gray-50">
                      <td className="p-2 border">{page * PAGE_SIZE + index + 1}</td>
                      <td className="p-2 border">{zip.zipCode}</td>
                      <td className="p-2 border">{zip.county}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground">No Servicing Zip Codes</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
