"use client"

import { ColumnDef } from "@tanstack/react-table"
import { AuthCredentials } from "types";

export const columns: ColumnDef<AuthCredentials>[] = [
  {
    accessorKey: "fname",
    header: "fname",
  },
  {
    accessorKey: "lname",
    header: "lname",
  },
  {
    accessorKey: "phone",
    header: "phone",
  },

]
