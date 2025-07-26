'use client';

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Zip = { zip: string };

type County = {
  county: string | null;
};

type ServiceAreaProps = {
  counties: County[];
};

const PAGE_SIZE = 50;

export function ServiceArea({ counties }: ServiceAreaProps) {
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [zipCodes, setZipCodes] = useState<Zip[]>([]);
  const [selectedZips, setSelectedZips] = useState<string[]>([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (!selectedCounty) return;

    async function fetchZips() {
      try {
        const res = await fetch(`/api/zips?county=${encodeURIComponent(selectedCounty!)}`);
        const data = await res.json();
        setZipCodes(data);
        setPage(0); // reset page on county change
      } catch (error) {
        console.error("Failed to fetch zips:", error);
      }
    }

    fetchZips();
  }, [selectedCounty]);

  const toggleZip = (zip: string) => {
    setSelectedZips(prev =>
      prev.includes(zip)
        ? prev.filter(z => z !== zip)
        : [...prev, zip]
    );
  };

  const selectAllZips = () => {
    const currentPageZips = zipCodes.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
    setSelectedZips(prev => [
      ...prev,
      ...currentPageZips.map(z => z.zip).filter(zip => !prev.includes(zip)),
    ]);
  };

  const totalPages = Math.ceil(zipCodes.length / PAGE_SIZE);
  const currentPageZips = zipCodes.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="p-6 mx-auto w-2/3">
      <Card className="shadow-xl rounded-3xl border border-muted p-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Select Service Area
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {counties?.map((c) => (
              <button
                key={c.county}
                onClick={() => setSelectedCounty(c.county)}
                className={`text-base font-medium rounded-full px-3 py-1 border ${
                  selectedCounty === c.county
                    ? 'bg-blue-600 text-white'
                    : 'bg-muted text-muted-foreground hover:bg-blue-100'
                }`}
              >
                {c.county}
              </button>
            ))}
          </div>

          {selectedCounty && (
            <div>
              <div className="flex justify-between items-center mt-4">
                <h3 className="text-lg font-semibold">
                  {selectedCounty} County
                </h3>
                <button onClick={selectAllZips} className="text-sm underline">
                  Select All
                </button>
              </div>

              <div className="grid grid-cols-8 gap-3 mt-2">
                {currentPageZips.map(z => (
                  <label key={z.zip} className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedZips.includes(z.zip)}
                      onCheckedChange={() => toggleZip(z.zip)}
                    />
                    {z.zip}
                  </label>
                ))}
              </div>

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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
