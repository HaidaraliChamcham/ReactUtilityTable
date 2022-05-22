import React, { useEffect, useState } from "react";
import './UtilityTable.css';
import {Crud_Loader, CrudField, IconCrudButton,
    Close, Delete, Done, Download, Edit, FirstPage, LastPage, LeftArrow, Plus, RightArrow } from "./CurdComponents";
import downloadExcel from "./ExcelDowload";
import { UtilityTableProps } from "./UtilityTable.types";
//import { Close, Delete, Done, Download, Edit, FirstPage, LastPage, LeftArrow, Plus, RightArrow } from "./Icons";


function ReactUtilityTable(props: UtilityTableProps) {
    const { columns = [], data = [], title = "Table Title", onRowClick, onSelectionChange, editable, tableId } = props;
    const { selection, filtering, action = "Action", showTotal, pageSize = 5, maxBodyHeight,
        minBodyHeight, paging = true, selectAll = true, selectionTitle = "Select All", exportButton = false,
        headerStyle, toolbar = true, totalTitle = "Total", totalRowClassName } = { ...props.options };

    const [edit] = useState(selection ? false : editable && true)
    const [userData, setUserData] = useState<any>([]);
    const [showData, setShowData] = useState<any>([]);
    const [checked, setChecked] = useState<any>([]);
    const [newData, setNewData] = useState<any>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [filters, setFilters] = useState<any>("");
    const [add, setAdd] = useState(false);
    const [transclass, setTransClass] = useState("crud-trans");
    const [chkEdit, setChkEdit] = useState({ chk: false, ind: -1 });
    const [selectedRow, setSelectedRow] = useState<any>([]);
    const [showLoader, setShowLoader] = useState<boolean>(false);
    // const [dataLength, setDataLength] = useState<number>(0);
    const [deletingRow, setDeletingRow] = useState(false);
    const [pagination, setPagination] = useState({
        start: 0,
        end: paging ? pageSize >= data.length ? data.length : pageSize : data.length,
    });

    const [disableNext, setDisableNext] = useState({
        next: pageSize >= data.length ? true : false,
        prev: true,
    });

    const [disableLastEnd, setDisableLastEnd] = useState({
        next: pageSize >= data.length ? true : false,
        prev: true,
    });
    // const hanldeFiltering = useRef([]);


    useEffect(() => {
        if (globalFilter || filters)
            searchHandle()
    }, [globalFilter, filters])

    useEffect(() => {
        settingColumn();
        if (showTotal) {
            setPagination({
                start: 0,
                end: data.length
            })
        }
        //for bulk edit
        // setNewData([...copyData]);

    }, []);

    useEffect(() => {
        if (data) {
            // tableData.id is added to uniquely identify userData becuase of slice and filter method
            const copyData = data.map((item: any, index: number) => { return { ...item, tableData: { id: index } } });
            setUserData([...copyData]);
            setShowData([...copyData]);
            // setDataLength(data.length);
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
    const searchHandle = () => {
        var filterValue = globalFilter.toLowerCase(), keyValue = "";
        const handleFiltering = userData.filter((item: any, i: number) => {
            var chk = false;
            for (var _i of columns) {
                keyValue = item[_i['field']].toString().toLowerCase();
                if (keyValue.includes(filterValue)) {
                    chk = true;
                }

            }
            if (filtering) {
                for (var _i of columns) {
                    keyValue = item[_i['field']].toString().toLowerCase();
                    if (!keyValue.includes(filters[_i['field']].toLowerCase())) {
                        chk = false;
                    }
                }
            }
            if (chk) {
                return item;
            }
        })

        setShowData(handleFiltering);
        if (pagination.start !== 0) {
            setPagination({ start: 0, end: pageSize });
        }

        if (handleFiltering.length <= pagination.end) {
            setDisableNext({ next: true, prev: true });
        } else {
            if (disableNext.next && disableNext.prev) {
                setDisableNext({ next: false, prev: false });
            }
        }

    }
    const handleSelectChange = (value: any) => () => {

        // const currentIndex = selectedRow.indexOf(value);

        const currentIndex = selectedRow.findIndex((ind: any) => ind.tableData["id"] === value.tableData["id"]);
        const newChecked = [...selectedRow];
        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        if (onSelectionChange) {
            onSelectionChange(newChecked);
        }
        setSelectedRow(newChecked);
    };

    const handleSelectedAll = (e: any) => {
        if (e.target.checked === true) {
            const allData = userData && userData.map((item: any, index: number) => item.tableData.id);
            if (onSelectionChange) {
                onSelectionChange(userData);
            }
            setSelectedRow(userData);
        } else {
            setSelectedRow([])
        }
    };

    const handleChange = (value: any, key: any) => {
        setNewData({ ...newData, [key]: value });
    }



    const enableEdit = (item: any, index: number) => {
        if (!add) {
            setChkEdit({ chk: true, ind: index });
            setNewData({ ...item, index: index });

            setChecked([item.tableData["id"]]);
        }
    }

    const handleChangeSave = (index: number) => {

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
                setTransClass("crud-trans-opacity");
                setChkEdit({ chk: false, ind: -1 });
                editable && editable.onRowUpdate(newData, userData[identity]).then((resp: any) => {

                    setChecked([]);
                    setTransClass("crud-trans");
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
                    setPagination({ start: 0, end: pageSize });
                    setTransClass("crud-trans");
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
        var len = userData.length;
        var obj = { tableData: { id: len }, index: len };
        // setUserData([...userData, obj]);
        if (!add) {
            setNewData({ ...filters, ...obj })
            setAdd(true);
            setTransClass("crud-trans-opacity")
            setChecked([]);
        }
    }

    const handleCancelAdd = () => {
        setNewData({});
        setAdd(false);
        setTransClass("crud-trans");
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
        if (end + 1 >= showData.length) {
            end = showData.length;
            start = start;
            setDisableNext({ next: true, prev: false });
        }
        if (disableNext.next || disableNext.prev) {
            setDisableNext({ next: false, prev: false });
        }
        if (!disableNext.next) {
            if (disableLastEnd.prev) {
                setDisableLastEnd({ next: false, prev: false });
            }
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

            end = start + pageSize;
        }
        if (disableNext.prev || disableNext.next) {
            setDisableNext({ next: false, prev: false });
        }
        setPagination({ start: start, end: end });
    }

    const handleGlobalFilter = (e: any) => {
        setGlobalFilter(e.target.value);

    }
    const handleFilter = (e: any) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    }
    const goToLast = () => {
        if (showData.length > 0) {
            var start = showData.length / pageSize,
                // starting = parseInt(start.toString());
                starting = start.toString().split("."),
                startIndex = starting[1] ? starting[0] : +starting[0] - 1;
            setPagination({ start: +startIndex * pageSize, end: showData.length });
            setDisableLastEnd({ next: true, prev: false });
            setDisableNext({ next: true, prev: false });
        } else {
            setDisableNext({ next: true, prev: false });
        }
    }

    const goToFirst = () => {
        setPagination({ start: 0, end: pageSize });
        setDisableLastEnd({ next: false, prev: true });
        setDisableNext({ next: false, prev: true });
    }



    return (

        <div className="hb_component">
            <div style={{ overflow: "auto", maxWidth: "100%" }}>
                <div>
                    {toolbar && <div className="crud-table-heading">
                        <div style={{ overflow: "hidden" }}>
                            <h6 className="crud-component-h6">{selectedRow.length > 0 ? selectedRow.length + " rows selected" : title}</h6>
                        </div>
                        <span className="crud-toolbar-action">
                            <CrudField type={'search'} placeholder={"SEARCH"} value={globalFilter}
                                onChange={(e: any) => handleGlobalFilter(e)} />

                            {exportButton && <IconCrudButton iconName={<Download />}
                                className="crud-toolbar-icon" onClick={excelDownload} data-title="Excel" />
                            }

                            {edit && editable && editable.onRowAdd && <IconCrudButton iconName={<Plus />}
                                className="crud-toolbar-icon" data-title="Add Row" onClick={addItem}
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
                                        {selectAll && <input type="checkbox" onChange={(e: any) => handleSelectedAll(e)} checked={data.length > 0 ? selectedRow.length === data.length ? true : false : false} />} {selectionTitle}
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

                                {data && showData.length > 0 && columns.length > 0 ? showData.slice(pagination.start, pagination.end).map((item: any, index: number, userArray: any) => (
                                    <tr key={index} onClick={(e) => rowClick(e, item)}
                                        className={chkEdit.chk ? chkEdit.ind === item.tableData["id"] ?
                                            "crud-row crud-trans" : "crud-row crud-trans-opacity" : "crud-row " + transclass}>

                                        {selection ? <td className="crud-action-column">
                                            <input type="checkbox" checked={selectedRow.findIndex((ind: any) => ind.tableData["id"] === item.tableData["id"]) === -1 ? false : true}
                                                onChange={handleSelectChange(item)} />
                                        </td> : null}

                                        {edit ? <td className="crud-action-column">

                                            <div className="crud-action-column-div">
                                                {(editable && editable.onRowUpdate && checked.indexOf(item.tableData["id"]) === -1) &&
                                                    <IconCrudButton iconName={<Edit />}
                                                        onClick={() => enableEdit(item, item.tableData["id"])}
                                                        data-title="Edit Row" />
                                                }

                                                {(editable && editable.onRowDelete && checked.indexOf(item.tableData["id"]) === -1) &&
                                                    <IconCrudButton iconName={<Delete />}
                                                        onClick={() => deleteRow(item, item.tableData["id"])}
                                                        data-title="Delete Row"
                                                    />}

                                                {(editable && editable.onRowUpdate && checked.indexOf(item.tableData["id"]) !== -1) &&
                                                    <IconCrudButton iconName={<Done />} disabled={showLoader}
                                                        data-title="Save"
                                                        onClick={() => handleChangeSave(item.tableData["id"])} />
                                                }


                                                {(editable && editable.onRowUpdate && checked.indexOf(item.tableData["id"]) !== -1) &&
                                                    <IconCrudButton iconName={<Close />} disabled={showLoader}
                                                        data-title="Cancel"
                                                        onClick={handleCancel} />
                                                }

                                            </div>
                                        </td>
                                            : null}


                                        {edit ? deletingRow && checked.indexOf(item.tableData["id"]) !== -1 ?
                                            <td colSpan={columns.length} className="crud-trans">
                                                <span className="crud-warning">Are you sure you want to delete this row </span></td> :
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

                                    <td className="crud-action-column">
                                        {columns && <div className="crud-action-column-div">
                                            <IconCrudButton iconName={<Done />}
                                                onClick={handleAddData} disabled={showLoader} data-title="Save" />


                                            <IconCrudButton iconName={<Close />}
                                                data-title="Cancel"
                                                onClick={handleCancelAdd} disabled={showLoader} />

                                        </div>
                                        }
                                    </td>

                                    {columns && columns.map((columnItem: any, columnIndex: number) => (
                                        <td key={columnIndex} className="crud-trans">
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
                            {showTotal && <tfoot>
                                <tr className={totalRowClassName && totalRowClassName}>{editable || selection ?
                                    <>
                                        <td>
                                            {totalTitle}
                                        </td>
                                        {[0].map((it: number) => (
                                            columns.map((item: any, index: number) => (
                                                <td key={index}>
                                                    {item.total ? item.total : ""}
                                                </td>
                                            ))
                                        ))}
                                    </>
                                    :
                                    [0].map((it: number) => (
                                        columns.map((item: any, index: number) => (
                                            <td key={index}>
                                                {index === 0 ? totalTitle : item.total ? item.total : ""}
                                            </td>
                                        ))
                                    ))
                                }

                                </tr>

                            </tfoot>
                            }
                        </table>

                    </div>
                </div>
                {paging && !showTotal && <table style={{ display: "flex", justifyContent: "end" }}>
                    <tfoot className="crud-table-footer">
                        <tr>
                            <td className="crud-pagination">
                                <div className="crud-footer-content" >
                                    <div className="footer-caption">
                                        {pageSize + " rows"}
                                    </div>
                                    <div>

                                        <IconCrudButton iconName={<FirstPage />}
                                            disabled={disableLastEnd.prev} onClick={goToFirst} />

                                    </div>
                                    <div>
                                        <IconCrudButton iconName={<LeftArrow />}
                                            disabled={disableNext.prev} onClick={onPaginationDecre} />

                                    </div>
                                    <div className="footer-caption">
                                        {showData.length > 0 ? showData.length > pagination.end ? pagination.start + 1 + " - " + pagination.end + " of " + showData.length :
                                            pagination.start + 1 + " - " + showData.length + " of " + showData.length : pagination.start + " - " + showData.length + " of " + showData.length}
                                    </div>
                                    <div>
                                        <IconCrudButton iconName={<RightArrow />}
                                            disabled={disableNext.next} onClick={onPaginationInc} />

                                    </div>
                                    <div>
                                        <IconCrudButton iconName={<LastPage />}

                                            disabled={disableLastEnd.next} onClick={goToLast} />

                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
                }
            </div>
        </div>
    )
}

export default ReactUtilityTable;
