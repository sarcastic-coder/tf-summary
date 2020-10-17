import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useLocation } from 'react-router-dom';
import { Button, FormGroup, Input, InputGroup, InputGroupAddon, Label } from 'reactstrap';
import { Terraform } from '../terraform';
import { Plan } from './Terraform/Plan';

enum FileStatus {
    None = 'none',
    Loading = 'loading',
    Processing = 'processing',
    Ready = 'ready',
    Error = 'error',
  };

  export const Main: React.FunctionComponent = () => {
    const [fileStatus, setFileStatus] = React.useState<FileStatus>(FileStatus.None);
    const [planRepresentation, setPlanRepresentation] = React.useState<Terraform.Plan>();
    const [fileUrl, setFileUrl] = React.useState<string>('');

    const location = useLocation();
    const reader = new FileReader();

    const onDrop = useCallback((acceptedFiles) => {
      try {
        const planFile = acceptedFiles.shift();
        reader.onload = (event) => {
          console.log('File Loaded');
          setFileStatus(FileStatus.Processing);
          setPlanRepresentation(JSON.parse(event.target?.result as string));
          setFileStatus(FileStatus.Ready);
        };

        reader.readAsText(planFile);
        setFileStatus(FileStatus.Loading);
      } catch (caught) {
        console.error(caught);
        setFileStatus(FileStatus.Error);
      }
    }, [reader]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      multiple: false,
      accept: ['text/json', 'application/json']
    });

    const fetchPlan = async(url: string) => {
      setFileStatus(FileStatus.Loading);

      try {
        const fileResponse = await fetch(url);

        if (fileResponse.ok) {
          setFileStatus(FileStatus.Processing);

          setPlanRepresentation(await fileResponse.json());

          setFileStatus(FileStatus.Ready);
        } else {
          setFileStatus(FileStatus.Error);
        }
      } catch (caught) {
        console.error(caught);
        setFileStatus(FileStatus.Error);
      }
    };

    const handleFileUrlGoPress = () => {
      fetchPlan(fileUrl);
    };

    const handleFileUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setFileUrl(event.target.value);
    };

    React.useEffect(
      () => {
        console.log('Location change');
        const query = new URLSearchParams(location.search);
        const planLocation = query.get('plan');

        if (planLocation !== null) {
          fetchPlan(planLocation);
        }
      },
      [location]
    );

    switch (fileStatus) {
      case FileStatus.None:
        return <>
          <FormGroup>
            <Label>Specify a URL:</Label>
            <InputGroup>
              <Input type={"url"} value={fileUrl} onChange={handleFileUrlChange} />
              <InputGroupAddon addonType={"append"}>
                <Button color={'primary'} onClick={handleFileUrlGoPress}>Go!</Button>
              </InputGroupAddon>
            </InputGroup>
          </FormGroup>

          <div className={"separator"}>Or</div>

          <FormGroup>
            <Label>Upload a file:</Label>
            <div
              {...getRootProps({
                className: 'dropzone',
              })}
            >
              <input {...getInputProps()} type={"file"} />
              {
                isDragActive ?
                  <p>Drop the files here ...</p> :
                  <p>Drag 'n' drop some files here, or click to select files</p>
              }
            </div>
          </FormGroup>
        </>;
      case FileStatus.Loading:
        return <>
          <p>Loading File...</p>
        </>;
      case FileStatus.Processing:
        return <>
          <p>Processing Plan...</p>
        </>;
      case FileStatus.Ready:
        if (planRepresentation === undefined) {
          throw new Error('Attempt to show plan which is undefined');
        }

        return <Plan representation={planRepresentation} />;
      case FileStatus.Error:
        return <>
          <p>Failed to load plan file.</p>
          <Button onClick={() => setFileStatus(FileStatus.None)}>Try Again</Button>
        </>;
    }

    throw new Error('Unknown file status');
  };
