import React, { useState } from 'react';
import { styles } from '../styles';
import useClasses from '../useClasses';
import { Backdrop, CircularProgress, Input } from '@mui/material';
import axios from 'axios';

const QuotationCompare = () => {
    const classes = useClasses(styles)
    const [loading, setLoading] = useState(false)
    const [newF, setNew] = useState(null)
    const [old, setOld] = useState(null)

    const uploadOld = (event) => {
        setOld(event.target.files[0])
    }

    const uploadNew = (event) => {
        setNew(event.target.files[0])
    }

    const ping = () => {
        axios.get('https://157.245.198.24/health')
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const postRequest = async () => {
        setLoading(true)

        if (old == null || newF == null) {
            alert('ensure all files have ben uploaded before proceeding')
            setLoading(false)
            return
        }

        const formData = new FormData();
        formData.append("file1", old);
        formData.append("file2", newF);

        try {
            const response = await fetch("https://api.wiselinkapp.com/upload", {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                // Get the filename from the Content-Disposition header
                const contentDisposition = response.headers.get('Content-Disposition');
                let filename = 'output.xlsx'; // Default filename
                
                if (contentDisposition) {
                    const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                    if (filenameMatch) {
                        filename = filenameMatch[1];
                    }
                }

                // Create a blob from the response
                const blob = await response.blob();
                
                // Create a download link
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
            } else {
                const error = await response.json();
                alert(`Error: ${error.error}`)
            }
        } catch (error) {
            alert(`Error: ${error.message}`)
        } finally {
            setLoading(false)
        }

    }

    return (
        <div className={classes.root}>
            <span style={{ fontSize: '30px', textAlign: 'center', fontWeight: 'bold' }}>
                Update new Quotation file
            </span>
            <span style={{ fontSize: '1em', margin: '30px 0px 30px 0px', textAlign: 'left', fontFamily: "AirbnbCereal-Book" }}>
                Quotation File Type = Export quotation from system <br/>
                Output file will follow the template of New Quotation. <br/>
                It will add in details from the old file if the CPN & MPN matches. <br/>
            </span>
            <div className={classes.fileUploadContainer} style={{ flexDirection: 'row', width: '70%' }}>
                <div className={classes.fileUploadWrapper} style={{ width: '50%' }}>
                    <span className={classes.label}>Old File</span>
                    <Input onChange={(event) => uploadOld(event)} type="file" className={classes.fileUpload} />
                </div>
                <div className={classes.fileUploadWrapper} style={{ width: '50%' }}>
                    <span className={classes.label}>New File</span>
                    <Input onChange={(event) => uploadNew(event)} type="file" className={classes.fileUpload} />
                </div>
            </div>
            <div style={{ marginTop: '50px' }}>
                <button onClick={() => postRequest()} className={classes.download}>
                    Compile
                </button>
            </div>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
                style={{ position: 'absolute', zIndex: 10 }}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}

export default QuotationCompare;