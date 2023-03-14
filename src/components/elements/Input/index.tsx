import React, { ChangeEvent } from 'react';
import { FieldProps, getIn } from 'formik';
import { TextField, InputLabel } from '@mui/material';

export interface InputProps {
    onInputChange: (value: any, option: any) => void,
    value?: any,
    isMandatory?: boolean,
    error?: string,
    customCssClass?: string,
    labelStyle?: Object,
    labelStyleClassName?: string,
    label?: string;
}

export interface FormikInputProps extends FieldProps<InputProps> {
  onInputChange: (value: any, option: any) => void;
  onFormikInputChange?: (value: any, option: any) => void;
  innerRef?: any;
}

const FormikInput = (props: FormikInputProps) => {
  const {
    field, form, onInputChange, innerRef,
    onFormikInputChange,
  } = props;

  const error = getIn(form.errors, field.name);
  const touch = getIn(form.touched, field.name);

  const isError: boolean = !!(error && touch);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    // console.log(event);
    form.setFieldValue(field.name, e.target.value);
  };

  return (
    <>
    <TextField
      variant="standard"
      fullWidth
      innerRef={innerRef}
      error={isError ? error : ''}
      onChange={handleChange}
      value={field.value}
      {...props}
    />
    </>
  );
};

export default FormikInput;