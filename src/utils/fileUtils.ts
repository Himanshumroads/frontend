/* eslint-disable import/prefer-default-export */
/* eslint-disable no-param-reassign */
function blobToFile(theBlob: any, fileName: any) {
    // A Blob() is almost a File() -
    // it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
  }
  
  // eslint-disable-next-line no-unused-vars
  function getImageUrlFromBlob(file: any) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line no-var
      var reader = new FileReader();
      reader.onload = (e: any) => {
        resolve(e.target.result);
      };
      reader.onerror = (error) => {
        console.log(`Error: ${error}`);
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  }
  
  function blobToBase64(blob: any, withoutRemoveDataUrl = false) {
    return new Promise((resolve) => {
      const reader: any = new FileReader();
      reader.onloadend = () => {
        // use a regex to remove data url part
        if (!withoutRemoveDataUrl) {
          const base64String = reader.result
            .replace('data:', '')
            .replace(/^.+,/, '');
          resolve(base64String);
        }
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  }
  
  const b64toBlob = (b64Data: any, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i += 1) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };
  
  const base64ToFile = (base64: any, fileName: any) => {
    const contentType = base64.split(';')[0].split(':')[1];
    const sliceSize = 512;
    const byteCharacters = atob(base64.split(',')[1]);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i += 1) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, { type: contentType });
    return blobToFile(blob, fileName);
  };
  
  const dataURLtoFile = (dataurl: string, filename: string) => base64ToFile(dataurl, filename);
  
  const saveFile = (blobData: any, fileName: any) => {
    const a: any = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    // eslint-disable-next-line func-names
  
    const blob = new Blob([blobData], { type: 'octet/stream' });
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };
  
  const getMimeType = (format: any) => {
    switch (format) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'pdf':
        return 'application/pdf';
      default:
        return 'text/plain';
    }
  };
  
  const fileToBase64 = (file: any) => new Promise((resolve, reject) => {
    const fileName = file.name;
    const fileType = fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length);
    // const fileType = fileName.split('.').pop();
  
    const reader: any = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result
        .replace('data:', '')
        .replace(/^.+,/, '');
  
      switch (fileType) {
        case 'png':
        case 'jpeg':
        case 'jpg':
          resolve(`data:${getMimeType(fileType)};base64,${base64String}`);
          break;
  
        case 'pdf':
          resolve(`data:${getMimeType(fileType)};base64,${base64String}`);
          break;
  
        default:
          resolve(reader.result);
          break;
      }
    };
    reader.onerror = (error: any) => reject(error);
  });
  
  function isFile(input: any) {
    if (input instanceof File) {
      return true;
    }
    return false;
  }
  
  function isBlob(input: any) {
    if (input instanceof Blob) {
      return true;
    }
    return false;
  }
  
  export {
    base64ToFile,
    getImageUrlFromBlob,
    blobToFile,
    saveFile,
    blobToBase64,
    fileToBase64,
    b64toBlob,
    dataURLtoFile,
    getMimeType,
    isFile,
    isBlob,
  };