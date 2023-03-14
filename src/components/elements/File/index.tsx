import React, { useEffect } from 'react';
import { FieldProps, getIn } from 'formik';
import { useDropzone } from 'react-dropzone';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';


const fileFormatToString = (fileFormat: string) => {
  switch (fileFormat) {
    case 'application/pdf':
      return 'PDF';
    case 'image/jpeg':
      return 'JPG';
    case 'image/png':
      return 'PNG';
    default:
      return 'UNKNOWN';
  }
};

const getFileSize = (size: any) => {
  if (!size) return '';
  if (size < 1000) {
    return `${size} bytes`;
  }
  if (size < 1000000) {
    return `${(size / 1000).toFixed(2).replace(/\.00$/, '')} KB`;
  }
  return `${(size / 1000000).toFixed(2).replace(/\.00$/, '')} MB`;
};

const getErrorMessage = (errors: any[], minSize: any, maxSize: any) => {
  for (let i = 0; i < errors.length; i += 1) {
    if (errors[i].code === 'file-invalid-type') {
      return 'Invalid file type';
    }
    if (errors[i].code === 'file-too-large') {
      return `File too large. The file size must be less than ${getFileSize(maxSize)}`;
    }
    if (errors[i].code === 'file-too-small') {
      return `File too small. The file size must be more than ${getFileSize(minSize)}`;
    }
  }

  return '';
};
export interface FileProps extends FieldProps {
  label: string;
  minSize: number;
  maxSize: number;
  supportTypes: string[] | string;
  isMandatory?: boolean;
  onChange: (file: any) => void;
}

const getConcatinatedSupportFiles = (supportFiles: any) => {
  if (supportFiles.length > 0) {
    const concatinatedSupportFiles: any = [];
    supportFiles.forEach((supportFile: any) => {
      concatinatedSupportFiles.push(fileFormatToString(supportFile));
    });
    return concatinatedSupportFiles.join(', ');
  }
  return '';
};

const File = (props: FileProps) => {
  const {
    form, field, label, maxSize = 1024 * 1024, minSize = 500 * 1024,
    supportTypes = '*',
    isMandatory,
    onChange,
  } = props;

  const error = getIn(form.errors, field.name);
  const touch = getIn(form.touched, field.name);

  const {
    fileRejections, acceptedFiles, getRootProps, getInputProps, inputRef,
  } = useDropzone({
    multiple: false,
    minSize,
    maxSize,
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (field.name && acceptedFiles.length > 0) {
        if (onChange) {
          onChange(acceptedFiles[0]);
        }
        form.setFieldValue(field.name, acceptedFiles[0]);
      }
    },
    onFileDialogCancel: () => {
      form.setFieldValue(field.name, null);
    },
    onDropRejected: () => {
      form.setFieldValue(field.name, '');
    },
  });

  useEffect(() => {
    if (!field.value) {
    if(inputRef.current)
      inputRef.current.value = '';
    }
  }, [field.value]);

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: '0.7vw' }}>Current file size: {getFileSize(file.size)}</span>
      <div>
        <div style={{ fontSize: '0.9vw', color: 'red' }}>{getErrorMessage(errors, minSize, maxSize)}</div>
      </div>
    </div>
  ));

  const handleClear = async () => {
      form.setFieldValue(field.name, '');
  };

//   const handlePreview = async () => {
//     if (field.value && field.value.blobData) {
//       if (typeof field.value.blobData === 'string') {
//         const fileName = field.value.name;
//         const last = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length);
//         showDocumentPreview({ uri: field.value.blobData, fileType: last });
//       } else {
//         const fileBlobUrl = await fileToBase64(blobToFile(field.value.blobData, field.value.name));
//         showDocumentPreview({ uri: fileBlobUrl });
//       }
//     } else {
//       const fileBlobUrl = await fileToBase64(field.value);
//       showDocumentPreview({ uri: fileBlobUrl });
//     }
//   };

  return (
    <div className="flex" style={{ position: 'relative' }}>
      <div style={{ width: '20%' }}>
        {label && (
          <div style={{ display: 'flex' }}>
            {label}
            {isMandatory && <span style={{ color: '#B60303' }}>*</span>}
          </div>
        )}
      </div>
      {!field.value && (
        <div>
          <section
            className={error && touch ? 'errorSpan' : ''}
            style={{
              border: `1px dotted ${error && touch ? 'red' : 'white'} `,
              textAlign: 'center',
              padding: '6px',
            }}
          >
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} style={{ display: 'block', color: `${error && touch ? 'red' : 'white'} ` }} />
            </div>
          </section>
          <em style={{ fontSize: '0.7vw' }}>
            ( Only <b>{getConcatinatedSupportFiles(supportTypes)}</b> file
            {supportTypes.length > 0 && 's '} will be accepted )
            file size limit: {`${getFileSize(minSize)}`} - {`${getFileSize(maxSize)}`}
          </em>
        </div>
      )}
      <span style={{ overflowWrap: 'break-word', maxWidth: '14vw' }}>{fileRejectionItems}</span>
      {field.value && (
        <aside
          style={{
            display: 'flex',
            border: '0.01vw solid white',
            justifyContent: 'space-between',
            padding: '0.5vw',
            minWidth: '200px',
            maxWidth: '300px',
          }}
        >
          <div
            style={{
              width: '80%',
              overflowWrap: 'break-word',
            }}
          >
            <div
              style={{
                fontWeight: 'bold',
                fontSize: '0.8vw',
              }}
              key={field.value.path || field.value.name}
            >
              {field.value.path || field.value.name}
            </div>
            <div style={{ fontSize: '0.7vw' }}>
              {getFileSize(field.value.size)}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton  onClick={handleClear}>
                <DeleteIcon />
            </IconButton>
          </div>
        </aside>
      )}
    </div>
  );
};

File.defaultProps = {

};

File.propTypes = {

};
export default File;