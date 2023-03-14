import React, { useState } from 'react';
import { Form, Formik, Field, FormikProps } from 'formik';
import * as Yup from 'yup';
import { Button, Grid, Typography } from '@mui/material';
import FormikInput from '../elements/Input';
import File from '../elements/File';
import API from '../../network';
import { base64ToFile } from '../../utils/fileUtils';
import Camera from '../Camera';

const FileUploadForm = () => {
    const [capture, setCapture] = useState(false);

    const [loading, showLoading] = useState(false);
    const formRef = React.useRef<FormikProps<any>>(null);
    const handleSubmit = async (values: any) => {
        showLoading(true);
        const formData = new FormData();

        formData.append('name', values.name);
        formData.append('file', values.file);
        formData.append('department', values.department);
        formData.append('age', values.age);
        formData.append('designation', values.designation);

        try {
            const response = await API.getInstance().trainModel(formData);
            if (response.status === 200) {
                alert('trained');
            }
            if (formRef.current) formRef.current.resetForm();
        } catch(e) {
            alert(e);
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
        <Formik
        innerRef={formRef}
        initialValues={{
          file: '',
          name: '',
          age: '',
          department: '',
          designation: '',
        }}
        validationSchema={
          Yup.object().shape({
            file: Yup.mixed().required('File is required'),
            name: Yup.string().required('Name is required'),
            age: Yup.string().required('age is required'),
            department: Yup.string().required('Department is required'),
            designation: Yup.string().required('Designation is required')
          })
        }
        onSubmit={handleSubmit}
      >
      {({ values, errors }) => (
        <Form>
            <Grid container gap={4} maxWidth={400}>
                <Grid item md={12}>
                    {/* <Field
                        key="file"
                        component={File}
                        label="File"
                        name="file"
                        minSize={1000}
                        maxSize={2000000}
                        isMandatory={true}
                        supportTypes={['image/jpeg', 'image/png']}
                    /> */}
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
                </Grid>
                <Grid item md={12}>
                    <Field
                        key="name"
                        component={FormikInput}
                        name="name"
                        label="Name"
                        isMandatory={true}
                    />
                </Grid>
                <Grid item md={12}>
                    <Field
                        key="age"
                        component={FormikInput}
                        name="age"
                        label="Age"
                        isMandatory={true}
                    />
                </Grid>
                <Grid item md={12}>
                    <Field
                        key="department"
                        component={FormikInput}
                        name="department"
                        label="Department"
                        isMandatory={true}
                    />
                </Grid>
                <Grid item md={12}>
                    <Field
                        key="designation"
                        component={FormikInput}
                        name="designation"
                        label="Designation"
                        isMandatory={true}
                    />
                </Grid>
                <Grid item md={12}>
                    <Button type="submit" variant="contained" disabled={loading} size="large">Train Model</Button>
                </Grid>
            </Grid>
        </Form>
      )}
    </Formik>
    )
};

export default FileUploadForm;
