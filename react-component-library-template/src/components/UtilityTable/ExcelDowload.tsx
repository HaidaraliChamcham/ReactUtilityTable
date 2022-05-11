import { utils, writeFile } from 'xlsx';




function downloadExcel(userData: any, fileName: string = "example") {

    const ws = utils.json_to_sheet(userData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "SheetJS");
    /* generate file and send to client */
    writeFile(wb, fileName + ".xlsx")
}

export default downloadExcel;
