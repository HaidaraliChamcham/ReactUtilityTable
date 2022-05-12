/// <reference types="react" />
import React from 'react';

interface Options<RowData extends object> {
    selection?: boolean;
    action?: string;
    toolbar?: boolean;
    showTotal?: boolean;
    filtering?: boolean;
    pageSize?: number;
    selectAll?: boolean;
    exportButton?: boolean;
    headerStyle?: React.CSSProperties;
    selectionTitle?: string;
    paging?: boolean;
    maxBodyHeight?: string;
    minBodyHeight?: string;
}
interface EditComponentProps<RowData extends object> {
    rowData: RowData;
    value: any;
    onChange: (newValue: any) => void;
    onRowDataChange: (newValue: RowData) => void;
}
interface Column<RowData extends object> {
    cellStyle?: React.CSSProperties;
    editComponent?: (props: EditComponentProps<RowData>) => React.ReactElement<any>;
    filtering?: boolean;
    field: keyof RowData | string;
    title: keyof RowData | string;
    render?: (data: object) => any;
    editable?: boolean;
    type?: "string" | "boolean" | "numeric" | "number" | "date" | "datetime" | "time";
}
interface UtilityTableProps {
    title: string;
    columns: Column<object>[];
    data: any;
    tableId?: any;
    onSelectionChange: (data: any, rowData?: object) => void;
    onRowClick?: (event?: React.MouseEvent, rowData?: object) => void;
    options?: Options<object>;
    editable?: {
        onRowAdd?: (newData: object) => Promise<any>;
        onRowUpdate?: (newData: object, oldData?: object) => Promise<any>;
        onRowDelete?: (oldData: object) => Promise<any>;
    };
}

declare function ReactUtilityTable(props: UtilityTableProps): JSX.Element;

export { ReactUtilityTable };
