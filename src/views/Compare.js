import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { Input } from '@mui/material';
import { styles } from '../styles';
import useClasses from "../useClasses";

const Compare = () => {

    const classes = useClasses(styles)

    const [dd, setDD] = useState({})

    const [arr, setArr] = useState([])

    const parseCustomerPriceList = (data) => {
        let renderedData = XLSX.read(data, { type: 'binary' });
        const dataParse = XLSX.utils.sheet_to_json(renderedData.Sheets[renderedData.SheetNames[0]], { header: 1 });

        for (let i = 1; i < dataParse.length; i++) {
            let stockCode = dataParse[i][0]
            let cpoDate = dataParse[i][1]
            let moq = dataParse[i][2]
            let price = dataParse[i][3]

            if (!(stockCode in dd)) {
                dd[stockCode] = {
                    "customer_date": excelDateToJSDate(cpoDate),
                    "moq": moq,
                    "customer_price": price,
                }
            } else if (!(dd[stockCode]["customer_date"] in dd[stockCode])) {
                dd[stockCode] = {
                    ...dd[stockCode],
                    "customer_date": excelDateToJSDate(cpoDate),
                    "moq": moq,
                    "customer_price": price,
                }
            } else if (excelDateToJSDate(cpoDate) > excelDateToJSDate(dd[stockCode]["customer_date"])) {
                dd[stockCode] = {
                    ...dd[stockCode],
                    "customer_date": excelDateToJSDate(cpoDate),
                    "moq": moq,
                    "customer_price": price,
                }
            }
        }
    }

    const parseSupplierPriceList = (data) => {
        let renderedData = XLSX.read(data, { type: 'binary' });
        const dataParse = XLSX.utils.sheet_to_json(renderedData.Sheets[renderedData.SheetNames[0]], { header: 1 });

        for (let i = 1; i < dataParse.length; i++) {
            let receiveDate = dataParse[i][0]
            let stockCode = dataParse[i][1]
            let price = dataParse[i][2]

            if (receiveDate === "Forwarder :")
                continue

            if (!(stockCode in dd)) {
                dd[stockCode] = {
                    "receive_date": excelDateToJSDate(receiveDate),
                    "supply_price": price,
                }
            } else if (!(dd[stockCode]["receive_date"] in dd[stockCode])) {
                dd[stockCode] = {
                    ...dd[stockCode],
                    "receive_date": excelDateToJSDate(receiveDate),
                    "supply_price": price,
                }
            } else if (excelDateToJSDate(receiveDate) > excelDateToJSDate(dd[stockCode]["receive_date"])) {
                dd[stockCode] = {
                    ...dd[stockCode],
                    "receive_date": excelDateToJSDate(receiveDate),
                    "supply_price": price,
                }
            }
        }
    }

    const parseStockList = (data) => {
        let renderedData = XLSX.read(data, { type: 'binary' });
        const dataParse = XLSX.utils.sheet_to_json(renderedData.Sheets[renderedData.SheetNames[0]], { header: 1 });

        for (let i = 1; i < dataParse.length; i++) {
            let stockCode = dataParse[i][0]
            arr.push(stockCode)
        }
    }

    const onFileChange = (e, fileNo) => {
        e.preventDefault();
        var files = e.target.files, f = files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            if (fileNo === 1)
                parseStockList(e.target.result)
            else if (fileNo === 2)
                parseCustomerPriceList(e.target.result)
            else
                parseSupplierPriceList(e.target.result)
        };
        reader.readAsBinaryString(f)
    }

    const excelDateToJSDate = (serial) => {
        var utc_days = Math.floor(serial - 25569);
        var utc_value = utc_days * 86400;
        var date_info = new Date(utc_value * 1000);
        return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate());
    }

    const downloadFile = () => {
        /* Write and Download File */
        let workbookRows = []
        let myHeader = ['Stock Code (Max 30 Chars)', "MOQ", "Supplier Price", "Customer Price"]

        for (let i = 0; i < arr.length; i++) {
            let row = {}
            let stockCode = arr[i]
            if (stockCode in dd) {
                let moq = dd[stockCode]["moq"]
                let supplier_price = dd[stockCode]["supply_price"]
                let customer_price = dd[stockCode]["customer_price"]

                row['Stock Code (Max 30 Chars)'] = stockCode
                row['MOQ'] = moq === undefined ? "-" : moq
                row['Supplier Price'] = supplier_price === undefined ? "-" : supplier_price
                row['Customer Price'] = customer_price === undefined ? "-" : customer_price
            } else {
                row['Stock Code (Max 30 Chars)'] = stockCode
                row['MOQ'] = "-"
                row['Supplier Price'] = "-"
                row['Customer Price'] = "-"
            }
            workbookRows.push(row)
        }

        const ws = XLSX.utils.json_to_sheet(workbookRows, { header: myHeader })
        let wb = { Sheets: { 'data': ws }, SheetNames: ['data'] }
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const f = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        FileSaver.saveAs(f, 'Data.xlsx');

    }


    return (
        <div className={classes.root}>
            <span style={{ fontSize: '30px', marginBottom: '30px', textAlign: 'center'}}>
                Online Stock Pricing
            </span>
            <div className={classes.fileUploadContainer} style={{ flexDirection: 'row', width: '70%' }}>
                <div className={classes.fileUploadWrapper} style={{ width: '33%' }}>
                    <span className={classes.label}>Stock List</span>
                    <Input onChange={(event) => onFileChange(event, 1)} type="file" className={classes.fileUpload} />
                </div>
                <div className={classes.fileUploadWrapper} style={{ width: '33%' }}>
                    <span className={classes.label}>Customer Price</span>
                    <Input onChange={(event) => onFileChange(event, 2)} type="file" className={classes.fileUpload} />
                </div>
                <div className={classes.fileUploadWrapper} style={{ width: '33%' }}>
                    <span className={classes.label}>Supplier Price</span>
                    <Input onChange={(event) => onFileChange(event, 3)} type="file" className={classes.fileUpload} />
                </div>
            </div>
            <div style={{ marginTop: '50px' }}>
                <button onClick={() => downloadFile()} className={classes.download}>
                    Download
                </button>
            </div>
        </div>
    );
}

export default Compare;