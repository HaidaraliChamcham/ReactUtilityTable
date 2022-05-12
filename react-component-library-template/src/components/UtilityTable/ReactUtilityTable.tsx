import React, { useEffect, useState, useRef } from "react";
import './UtilityTable.css';
import {Crud_Loader, CrudField, IconCrudButton} from "./CurdComponents";
import downloadExcel from "./ExcelDowload";
import { UtilityTableProps } from "./UtilityTable.types";


function ReactUtilityTable(props: UtilityTableProps) {
    const { columns, data, title, onRowClick, onSelectionChange, editable, tableId } = props;
    const { selection, filtering, action, showTotal, pageSize = 5, maxBodyHeight,
        minBodyHeight, paging = true, selectAll = true, selectionTitle = "Select All", exportButton = false,
        headerStyle, toolbar = true } = {...props.options};

    const [edit] = useState(selection ? false : editable && true)
    const [userData, setUserData] = useState<any>([]);
    const [checked, setChecked] = useState<any>([]);
    const [newData, setNewData] = useState<any>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [filters, setFilters] = useState<any>([]);
    const [add, setAdd] = useState(false);
    const [transclass, setTransClass] = useState("trans");
    const [chkEdit, setChkEdit] = useState({ chk: false, ind: -1 });
    const [selectedRow, setSelectedRow] = useState<any>([]);
    const [showLoader, setShowLoader] = useState<boolean>(false);
    const [dataLength, setDataLength] = useState<number>(0);
    const [deletingRow, setDeletingRow] = useState(false);
    const [pagination, setPagination] = useState({
        start: 0,
        end: paging ? pageSize >= data.length ? data.length : pageSize : data.length,
    });

    const [disableNext, setDisableNext] = useState({
        next: pageSize >= data.length ? true : false,
        prev: true,
    });


    useEffect(() => {
        settingColumn();
        //for bulk edit
        // setNewData([...copyData]);

    }, []);

    useEffect(() => {
        if (data) {
            // tableData.id is added to uniquely identify userData becuase of slice and filter method
            const copyData = data.map((item: any, index: number) => { return { ...item, tableData: { id: index } } });
            setUserData([...copyData]);
            setDataLength(data.length);
        }
    }, [data])

    const rowClick = (e: any, item: any) => {
        if (onRowClick) {
            onRowClick(e, item);
        }
        // console.log(e, "<---e", item, "<---")
    }

    const settingColumn = () => {
        var obj = {} as any;
        if (columns) {
            columns.map((item: any, index: number) => obj[item.field] = '');
            setFilters(obj);
        }
    }

    const handleSelectChange = (value: any) => () => {
        debugger;
        // const currentIndex = selectedRow.indexOf(value);

        const currentIndex = selectedRow.findIndex((ind: any) => ind.tableData["id"] === value.tableData["id"]);
        const newChecked = [...selectedRow];
        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        onSelectionChange(newChecked)
        setSelectedRow(newChecked);
    };

    const handleSelectedAll = (e: any) => {
        if (e.target.checked === true) {
            const allData = userData && userData.map((item: any, index: number) => item.tableData.id);
            onSelectionChange(userData);
            setSelectedRow(userData);
        } else {
            setSelectedRow([])
        }
    };

    const handleChange = (value: any, key: any) => {
        setNewData({ ...newData, [key]: value });
    }

    const handleFilter = (e: any) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    }

    const enableEdit = (item: any, index: number) => {
        if (!add) {
            setChkEdit({ chk: true, ind: index });
            setNewData({ ...item, index: index });
            debugger;
            setChecked([item.tableData["id"]]);
        }
    }

    const handleChangeSave = (index: number) => {
        debugger;
        setShowLoader(true);
        if (deletingRow) {

            if (editable && editable.onRowDelete) {
                editable && editable.onRowDelete(userData[index]).then((resp: any) => {
                    setChecked([]);
                    setDeletingRow(false);
                    setShowLoader(false);
                    setChkEdit({ chk: false, ind: -1 });

                })
            }
        } else {

            var identity = newData["index"];
            delete newData["index"];
            if (editable && editable.onRowUpdate) {
                setTransClass("trans-opacity");
                setChkEdit({ chk: false, ind: -1 });
                editable && editable.onRowUpdate(newData, userData[identity]).then((resp: any) => {
                    debugger;
                    setChecked([]);
                    setTransClass("trans");
                    setShowLoader(false);
                })
            }
        }
    }

    const handleAddData = () => {
        setShowLoader(true);
        // var identity = newData["index"];
        delete newData["index"];
        if (editable && editable.onRowAdd) {
            editable && editable.onRowAdd(newData).then((resp: any) => {
                if (add) {
                    setTransClass("trans");
                    setAdd(false);
                    setShowLoader(false);
                }
            })
        }
    }

    const deleteRow = (item: any, index: number) => {
        if (!add) {
            setChecked([index]);
            setChkEdit({ chk: true, ind: index });
            setDeletingRow(true);

        }

    }

    const addItem = () => {
        var len = dataLength;
        var obj = { tableData: { id: len }, index: len };
        // setUserData([...userData, obj]);
        if (!add) {
            setNewData({ ...filters, ...obj })
            setAdd(true);
            setTransClass("trans-opacity")
            setChecked([]);
        }
    }

    const handleCancelAdd = () => {
        setNewData({});
        setAdd(false);
        setTransClass("trans");
        setChkEdit({ chk: false, ind: -1 });
    }

    const handleCancel = () => {
        setNewData({});
        setChecked([]);
        setChkEdit({ chk: false, ind: -1 });
        if (deletingRow) {
            setDeletingRow(false);
        }
    }

    const excelDownload = () => {
        debugger;
        const excelData = userData.map((item: any) => {
            var ar = {} as any;
            for (var fieldName of columns) {
                ar[fieldName["title"]] = item[fieldName['field']];
            }
            return ar;
        })

        downloadExcel(excelData, title)
    }

    const onPaginationInc = () => {
        var start = pagination.start + pageSize;
        var end = pagination.end + pageSize;
        debugger;
        if (end + 1 >= dataLength) {
            end = dataLength;
            start = start;
            setDisableNext({ next: true, prev: false });
        }
        if (disableNext.next && disableNext.prev) {
            setDisableNext({ next: true, prev: false });
        }
        setPagination({ start: start, end: end });
    }

    const onPaginationDecre = () => {
        var start = pagination.start - pageSize;
        var end = pagination.end - pageSize;
        if (start <= 0) {
            start = 0;
            end = pageSize;
            setDisableNext({ next: false, prev: true });
        }
        if (end - start !== pageSize) {
            debugger;
            end = start + pageSize;
        }
        if (disableNext.prev || disableNext.next) {
            setDisableNext({ next: false, prev: false });
        }
        setPagination({ start: start, end: end });
    }

   
    return (

        <div className="hb_component">
            <div style={{ overflow: "auto", maxWidth: "100%" }}>
                <div>
                    {toolbar && <div className="crud-table-heading">
                        <div style={{ overflow: "hidden" }}>
                            <h6 className="h6-typo">{selectedRow.length > 0 ? selectedRow.length + " rows selected" : title}</h6>
                        </div>
                        <span className="crud-toolbar-action">
                            <CrudField type={'search'} placeholder={"SEARCH"} value={globalFilter}
                                onChange={(e: any) => setGlobalFilter(e.target.value)} />

                            {exportButton && <IconCrudButton iconName="icon-download"
                                className="toolbar-icon" onClick={excelDownload} data-title="Excel" />
                            }

                            {edit && editable && editable.onRowAdd && <IconCrudButton iconName="icon-plus"
                                className="toolbar-icon" data-title="Add Row" onClick={addItem}
                            />}

                        </span>
                    </div>
                    }
                    {showLoader ?
                        <Crud_Loader></Crud_Loader>
                        : null
                    }
                    <div className="tableParent" style={{ maxHeight: maxBodyHeight, minHeight: minBodyHeight }}>
                       
                        <table id={tableId} className="crud-table">
                            <thead>
                                <tr>
                                    {selection ? <th className="crud-table-head" style={headerStyle}>
                                        {selectAll && <input type="checkbox" onChange={(e: any) => handleSelectedAll(e)} checked={selectedRow.length === data.length ? true : false} />} {selectionTitle}
                                    </th> : null}

                                    {edit ? <th className="crud-table-head" style={headerStyle}>
                                        {action}
                                    </th> : null}

                                    {columns && [0].map((it: number) => (
                                        columns.map((item: any, index: number) => (
                                            <th key={index} className="crud-table-head" style={headerStyle}>{item.title}</th>
                                        ))
                                    ))}
                                </tr>
                            </thead>


                            <tbody className="curd-body">

                                {filtering && <tr>{selection && <td></td> || edit && <td></td>}
                                    {columns && [0].map((it: number) => (
                                        columns.map((item: any, index: number) => (
                                            <td key={index} style={{ padding: "4px" }}>
                                                {item.filtering === false ? "" : <CrudField type="text" name={item["field"]}
                                                    value={filters[item["field"]] || ""} onChange={(e: any) => handleFilter(e)} />}
                                            </td>
                                        ))
                                    ))}
                                </tr>
                                }

                                {data.length > 0 ? userData.filter((ite: any, i: number) => {
                                    var chk = false;
                                    for (var _i of columns) {
                                        if (ite[_i['field']].toString().toLowerCase().includes(globalFilter.toLowerCase())) {
                                            chk = true;
                                        }
                                        // if (filtering) {
                                        //     if (!ite[_i['field']].toString().toLowerCase().includes(filters[_i['field']])) {
                                        //         chk = false;
                                        //     }                                
                                        // }
                                    }

                                    if (filtering) {
                                        for (var _i of columns) {
                                            if (!ite[_i['field']].toString().toLowerCase().includes(filters[_i['field']].toLowerCase())) {
                                                chk = false;
                                            }
                                        }
                                    }
                                    if (chk) {
                                        return ite;
                                    }
                                 }).slice(pagination.start, pagination.end).map((item: any, index: number, userArray: any) => (
                                    <tr key={index} onClick={(e) => rowClick(e, item)}
                                        className={chkEdit.chk ? chkEdit.ind === item.tableData["id"] ?
                                            "crud-row trans" : "crud-row trans-opacity" : "crud-row " + transclass}>

                                        {selection ? <td>
                                            <input type="checkbox" checked={selectedRow.findIndex((ind: any) => ind.tableData["id"] === item.tableData["id"]) === -1 ? false : true}
                                                onChange={handleSelectChange(item)} />
                                        </td> : null}

                                        {edit ? <td className="action-column">

                                            <div className="action-column-div">
                                                {(editable && editable.onRowUpdate && checked.indexOf(item.tableData["id"]) === -1) &&
                                                    <IconCrudButton iconName="icon-pencil"
                                                        onClick={() => enableEdit(item, item.tableData["id"])}
                                                        data-title="Edit Row" />
                                                }

                                                {(editable && editable.onRowDelete && checked.indexOf(item.tableData["id"]) === -1) &&
                                                    <IconCrudButton iconName="icon-trash-solid"
                                                        onClick={() => deleteRow(item, item.tableData["id"])}
                                                        data-title="Delete Row"
                                                    />}

                                                {(editable && editable.onRowUpdate && checked.indexOf(item.tableData["id"]) !== -1) &&
                                                    <IconCrudButton iconName="icon-check-icon" disabled={showLoader}
                                                        onClick={() => handleChangeSave(item.tableData["id"])} />
                                                }


                                                {(editable && editable.onRowUpdate && checked.indexOf(item.tableData["id"]) !== -1) &&
                                                    <IconCrudButton iconName="icon-clear" disabled={showLoader}
                                                        onClick={handleCancel} />
                                                }

                                            </div>
                                        </td>
                                            : null}


                                        {edit ? deletingRow && checked.indexOf(item.tableData["id"]) !== -1 ?
                                            <td colSpan={columns.length} className="trans">
                                                <span className="warning">Are you sure you want to delete this row </span></td> :
                                            columns.map((columnItem: any, columnIndex: number) => (
                                                <td key={columnIndex} style={columnItem.cellStyle}>
                                                    {checked.indexOf(item.tableData["id"]) !== -1 ? columnItem["editable"] === false ?
                                                        typeof (columnItem.render) === 'function' ? columnItem.render(item) : item[columnItem["field"]]
                                                        : !columnItem.editComponent ? <CrudField
                                                            onChange={(e: any) => handleChange(e.target.value, columnItem.field,)}
                                                            type={!columnItem.type ? 'text' : columnItem.type}
                                                            placeholder={columnItem["title"]}
                                                            value={newData[columnItem["field"]]} />
                                                            : columnItem.editComponent({
                                                                rowData: item,
                                                                value: newData[columnItem["field"]], onChange: (value: any) => handleChange(value, columnItem.field,)
                                                            })
                                                        : typeof (columnItem.render) === 'function' ? columnItem.render(item) : item[columnItem["field"]]}
                                                </td>
                                            )) : columns.map((columnItem: any, columnIndex: number) => (
                                                <td key={columnIndex}>
                                                    {typeof (columnItem.render) === 'function' ? columnItem.render(item) : item[columnItem["field"]]}
                                                </td>
                                            ))}

                                    </tr>
                                 )) : <tr  >
                                    <td colSpan={columns && columns.length + 1} style={{ height: "11rem", textAlign: "center" }}>
                                        No records to display
                                    </td>
                                </tr>}

                                {add && <tr className="crud-row">

                                    <td className="action-column">
                                        {columns && <div className="action-column-div">
                                            <IconCrudButton iconName="icon-check-icon"
                                                onClick={handleAddData} disabled={showLoader} />


                                            <IconCrudButton iconName="icon-clear"
                                                onClick={handleCancelAdd} disabled={showLoader} />

                                        </div>
                                        }
                                    </td>

                                    {columns && columns.map((columnItem: any, columnIndex: number) => (
                                        <td key={columnIndex} className="trans">
                                            {!columnItem.editComponent ? <CrudField
                                                onChange={(e: any) => handleChange(e.target.value, columnItem.field)}
                                                type={!columnItem.type ? 'text' : columnItem.type}
                                                placeholder={columnItem["title"]}
                                                value={newData[columnItem["field"]]} />
                                                : columnItem.editComponent({

                                                    value: newData[columnItem["field"]], onChange: (value: any) => handleChange(value, columnItem.field,)
                                                })}
                                        </td>
                                    ))}

                                </tr>
                                }

                            </tbody>
                        </table>
                       
                    </div>
                </div>
                {paging && <table style={{ display: "flex", justifyContent: "end" }}>
                    <tfoot className="crud-table-footer">
                        {showTotal ? <tr>{selection && <td>Total</td> || edit && <td>Total</td>}
                            {[0].map((it: number) => (
                                columns.map((item: any, index: number) => (
                                    <td key={index}>
                                        {item.type === "number" ? "sum total" : ""}
                                    </td>
                                ))
                            ))}
                        </tr>
                            : <tr>
                                <td className="pagination">
                                    <div className="crud-footer-content" >
                                        <div className="footer-caption">
                                            {pageSize + " rows"}
                                        </div>
                                        <div>
                                            <IconCrudButton iconName="icon-left-arrow"
                                                disabled={disableNext.prev} onClick={onPaginationDecre} />

                                        </div>
                                        <div className="footer-caption">
                                            {pagination.start + 1 + " - " + pagination.end + " of " + userData.length}
                                        </div>
                                        <div>
                                            <IconCrudButton iconName="icon-right-arrow"
                                                disabled={disableNext.next} onClick={onPaginationInc} />

                                        </div>
                                    </div>
                                </td>
                            </tr>}
                    </tfoot>
                </table>
                }
            </div>
        </div>
    )
}

export default ReactUtilityTable;
