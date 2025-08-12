import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

interface UseSubmissionPortalProps {
  onSubmit: (files: File[]) => void;
}

interface UseSubmissionPortalReturn {
  files: File[];
  removeFile: (indexToRemove: number) => void;
  dropzoneProps: {
    getRootProps: () => any;
    getInputProps: () => any;
    isDragActive: boolean;
  };
}

export const useSubmissionPortal = ({ onSubmit }: UseSubmissionPortalProps): UseSubmissionPortalReturn => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Only keep the latest file
    const validFiles = acceptedFiles.slice(-1).filter(file => {
      const isValidType = ['application/pdf', 'image/jpeg', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        .includes(file.type);
      const isValidSize = file.size <= MAX_FILE_SIZE;
      return isValidType && isValidSize;
    });
    setFiles(validFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false
  });

  const removeFile = useCallback((indexToRemove: number) => {
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  }, []);

  return {
    files,
    removeFile,
    dropzoneProps: {
      getRootProps,
      getInputProps,
      isDragActive
    }
  };
};

export default useSubmissionPortal; 