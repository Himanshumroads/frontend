/* eslint-disable jsx-a11y/img-redundant-alt */
import React, {
    forwardRef, useEffect, useImperativeHandle, useState,
  } from 'react';
  import Webcam from 'react-webcam';

  import { Button, Select, MenuItem, Card, Grid } from '@mui/material';

  const Camera = forwardRef((props: any, ref) => {
    const { onCancel } = props;
    const [selectedDevice, setDeviceId] = React.useState<any>({});
    const [devices, setDevices] = React.useState<any>([]);
    const [mirrored, setMirrored] = React.useState<any>(true);
  
    const handleDevices = React.useCallback(
      (mediaDevices: any) => {
        const devicesList = mediaDevices.filter(({ kind }: any) => kind === 'videoinput').map(({ deviceId: device, label }: any) => ({
          label,
          value: device,
        }));
        setDevices(devicesList);
        if (devicesList.length > 0) {
          setDeviceId(devicesList[0].value);
        }
      },
      [setDevices],
    );
  
    React.useEffect(
      () => {
        navigator.mediaDevices.enumerateDevices().then(handleDevices);
      },
      [handleDevices],
    );
  
    const webcamRef = React.useRef<any>(null);
    const [image, setImage] = useState(null);
    const capture = React.useCallback(
      () => {
        if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc);
        }
      },
      [webcamRef],
    );
  
    const convertToFile = () => {
      const url: string | null = image;
      if (url)
      fetch(url)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], `image-${new Date().getTime()}`, {
            type: 'image/png',
          });
  
          console.log('file', file);
        });
    };
  
    useEffect(() => {
      convertToFile();
    }, [image]);
  
    useImperativeHandle(ref, () => {
      console.log('ref', ref);
      return {
        capture,
      };
    });
  
    const handleChange = (event: any) => {
      if (event && event.target.value) {
        setDeviceId(event.target.value);
      } else {
        setDeviceId(null);
      }
    };
  
    const rotate = () => {
      setMirrored(!mirrored);
    };
  
    const streamDeviceLabelAndId = (stream: any) => {
      const videoTrack = stream.getVideoTracks()[0];
      const { label, deviceId: value } = videoTrack;
      return { label, value };
    };
  
    const onUserMedia = (stream: any) => {
      console.log('onUserMedia', stream);
      const { label, value } = streamDeviceLabelAndId(stream);
  
      setDeviceId({ label, value });
    };
  
    const recapture = () => {
      setImage(null);
    };
  
    const onConfirmImage = () => {
      props.onConfirmImage(image);
      setImage(null);
    };
  
    return (
      <Card>
        {!image && (
          <>
            <div className="col-12">
              <Select value={selectedDevice} label="Select Device" onChange={handleChange}>
                {devices.map((_v: any) => <MenuItem value={_v.value}>{_v.label}</MenuItem>)}
              </Select>
            </div>
            <br />
            <Webcam
              onUserMedia={onUserMedia}
              className="webcam"
              videoConstraints={{
                deviceId: selectedDevice.deviceId,
                facingMode: 'environment',
              }}
              audio={false}
              height={280}
              width={440}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              mirrored={mirrored}
              screenshotQuality={1}
            />
            <br />
            <br />
            <Grid container gap={5} justifyContent="center">
              <Button onClick={onCancel} size="small" variant="outlined">Go Back</Button>
              <Button onClick={rotate} size="small">Mirror</Button>
              <Button onClick={capture} size="small" variant="contained">Capture</Button>
            </Grid>
            <br />
          </>
        )}
        {image && (
          <>
            Image Preview
            <br />
            <img src={image} alt="image" />
            <br />
            <br />
            <Grid container gap={5} justifyContent="center">
              <Button onClick={recapture} size="small"  variant="outlined">Recapture</Button>
              <Button onClick={onConfirmImage}  variant="contained">Ok</Button>
            </Grid>
            <br />
          </>
        )}
      </Card>
    );
  });
  
  export default Camera;