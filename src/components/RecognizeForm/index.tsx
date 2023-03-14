import React, { useState } from 'react';
import { Form, Formik, Field, FormikProps, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { Button, Grid, Typography } from '@mui/material';
import FormikInput from '../elements/Input';
import File from '../elements/File';
import API from '../../network';
import Camera from '../Camera';

import { base64ToFile } from '../../utils/fileUtils';

const RecognizeForm = () => {
    const [capture, setCapture] = useState(false);

    const [loading, showLoading] = useState(false);
    const [data, setData] = useState<any>(undefined);
    const formRef = React.useRef<FormikProps<any>>(null);

    const handleSubmit = async (values: any) => {
        setData(undefined);
        showLoading(true);
        const formData = new FormData();

        formData.append('file', values.file);

        try {
            const response = await API.getInstance().recognize(formData);
            if (response.status === 200) {
                alert(JSON.stringify(response.data.message));
                setData(response.data);
            }
            if (formRef.current) formRef.current.resetForm();
        } catch(e:any) {
            if (e.response)
            alert(e.response.data.error.message);
            else alert(e)
        } finally {
            showLoading(false);
        }
    };

    const handleConfirm = (base64Image: string) => {
       const file: File = base64ToFile(base64Image, "captured_image.jpg");

       formRef.current?.setFieldValue("file", file);
       setCapture(false);
    }
    
    return (
        <>
        {data && (
            <>
                <Typography variant="h4">Recognition Result</Typography>
                <br/>
                <span>User Id : {data.user.id}</span><br/>
                <span>Matched User Name : {data.user.name}</span>
                <br/>
                <br/>
                <Button onClick={() => setData(undefined)}>Reset</Button>
            </>
        )}
        {!data && (
        <Formik
            innerRef={formRef}
            initialValues={{
            file: '',
            name: '',
            }}
            validationSchema={
            Yup.object().shape({
                file: Yup.mixed().required('File is required'),
            })
            }
            onSubmit={handleSubmit}
        >
            {({ values, errors }) => (
            <Form>
                <Grid 
                    style={{ border: `1px solid ${errors.file ? 'red': '#eee'}`, padding: '10px' }}
                    container 
                    gap={2} 
                    justifyContent="center" 
                    alignItems="center" 
                    flexDirection="column"
                    minWidth={300}
                >
                    {!capture && (<Grid item md={12}>
                    <Field
                            key="file"
                            component={File}
                            label="File"
                            name="file"
                            minSize={1000}
                            maxSize={2000000}
                            isMandatory={true}
                            supportTypes={['image/jpeg', 'image/png']}
                        />
                    </Grid>)}
                    {!capture && !values.file && <Typography textAlign="center">or</Typography>}
                    <Grid item md={12}>
                        {!capture && !values.file && (
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                                setCapture(true);
                            }}
                            color={formRef.current?.errors ? "error": "primary"}
                        >
                            Capture Photo
                        </Button>
                        )}
                        {capture && (<Camera onConfirmImage={handleConfirm} onCancel={() => setCapture(false)} />)}
                    </Grid>

                </Grid>
                <br />
                <Grid container gap={2} justifyContent="center" alignItems="center" flexDirection="column">
                    <Grid item md={12}>
                        <Button type="submit" variant="contained" disabled={loading} size="large">Recognize</Button>
                    </Grid>
                </Grid>
            </Form>
            )}
        </Formik>
        )}
        </>
    )
};

export default RecognizeForm;
