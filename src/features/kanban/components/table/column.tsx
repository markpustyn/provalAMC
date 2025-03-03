"use client"

import { ColumnDef } from "@tanstack/react-table"
import { OpenOrder } from "types";

export const columns: ColumnDef<OpenOrder>[] = [
  {
    accessorKey: "id",
    header: "Order Number",
  },
  {
    accessorKey: "PropAddress",
    header: "PropAddress",
  },
  {
    accessorKey: "PropCity",
    header: "PropCity",
  },
  {
    accessorKey: "PropZip",
    header: "PropZip",
  },
  {
    accessorKey: "PropState",
    header: "PropState",
  },
  {
    accessorKey: "Status",
    header: "Status",
  },

]
