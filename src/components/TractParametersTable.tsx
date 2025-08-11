import { useMemo, useState, useEffect } from "react";
import { Box, Autocomplete, TextField } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import useAppStore from "../useAppStore";

type AnyRow = Record<string, any>;

function TractParametersTable({ trafficState }: { trafficState: any }) {
  const theme = useAppStore((s) => s.theme);

  const headers: string[] = trafficState.trafficMFTParametersHeaders ?? [];
  const rawData = trafficState.trafficMFTParametersData ?? [];

  // Find census tract column name (fallback to first header)
  const tractKey = useMemo(() => {
    const key = headers.find((h) => /census\s*tract|tract\s*id|tract/i.test(String(h)));
    return key ?? headers[0] ?? "tract";
  }, [headers]);

  // Build columns from headers
  const columns: GridColDef[] = useMemo(
    () =>
      headers.map((h) => ({
        field: String(h),
        headerName: String(h),
        flex: 1,
        minWidth: 120,
        sortable: false,
      })),
    [headers]
  );

  // Normalize rows (AoA from Handsontable OR AoO)
  const allRows: AnyRow[] = useMemo(() => {
    if (!rawData?.length) return [];

    if (Array.isArray(rawData[0])) {
      // array-of-arrays → map by headers
      return (rawData as any[][]).map((arr, idx) => {
        const r: AnyRow = { id: idx + 1 };
        headers.forEach((h, i) => (r[String(h)] = arr[i] ?? null));
        return r;
      });
    }

    // array-of-objects → ensure id
    return (rawData as AnyRow[]).map((r, idx) => ({
      id: r.id ?? idx + 1,
      ...r,
    }));
  }, [rawData, headers]);

  // All unique tract options (strings)
  const tractOptions = useMemo(() => {
    const s = new Set<string>();
    for (const r of allRows) {
      const v = r?.[tractKey];
      if (v != null) s.add(String(v));
    }
    return Array.from(s).sort();
  }, [allRows, tractKey]);

  // Selected tract state (default to the first available)
  const [selectedTract, setSelectedTract] = useState<string | null>(null);
  useEffect(() => {
    if (!selectedTract && tractOptions.length) setSelectedTract(tractOptions[0]);
  }, [selectedTract, tractOptions]);

  // Filter to exactly one row by selected tract
  const filteredRows = useMemo(() => {
    if (!selectedTract) return [];
    // Prefer exact match; if duplicates exist, show the first
    const row = allRows.find((r) => String(r?.[tractKey]) === selectedTract);
    return row ? [row] : [];
  }, [allRows, selectedTract, tractKey]);

  return allRows.length ? (
    <Box className="min-w-[60%]">
      {/* Tract selector */}
      <Box mb={1} display="flex" gap={1} alignItems="center">
        <Autocomplete
          size="small"
          options={tractOptions}
          value={selectedTract}
          onChange={(_, v) => setSelectedTract(v)}
          renderInput={(params) => (
            <TextField {...params} label="Census Tract" placeholder="Select tract" />
          )}
          sx={{ minWidth: 280 }}
        />
      </Box>

      {/* One-row grid */}
      <div style={{ maxHeight: 300 }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          getRowId={(r) => r.id}
          hideFooter
          disableColumnMenu
          disableRowSelectionOnClick
          checkboxSelection={false}
          sx={{
            border: 0,
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: theme === "dark" ? "#0a2f5c" : "#f5f7fb",
            },
            "& .MuiDataGrid-cell": {
              color: theme === "dark" ? "#e5e7eb" : undefined,
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: theme === "dark" ? "#0f2444" : undefined,
            },
          }}
        />
      </div>
    </Box>
  ) : (
    <div className="min-w-[60%] flex items-center justify-center h-auto text-gray-500">
      No data
    </div>
  );
}

export default TractParametersTable