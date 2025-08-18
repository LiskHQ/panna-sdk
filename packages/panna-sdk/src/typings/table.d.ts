// Declaration file for @tanstack/react-table module
// This file provides type definitions for the @tanstack/react-table package
// which is used for building tables in React applications.
import '@tanstack/react-table';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface TableMeta<TData extends RowData> {
    hasNextPage: boolean;
  }
}
