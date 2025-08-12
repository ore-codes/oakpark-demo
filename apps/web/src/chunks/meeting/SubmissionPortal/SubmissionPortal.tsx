import { FC } from 'react';
import { Icon } from '@iconify/react';
import Button from '@/components/Button/Button';
import useSubmissionPortal from './useSubmissionPortal';

interface SubmissionPortalProps {
  onSubmit: (files: File[]) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const SubmissionPortal: FC<SubmissionPortalProps> = ({ onSubmit, onCancel, isSubmitting = false }) => {
  const { files, removeFile, dropzoneProps } = useSubmissionPortal({ onSubmit });

  return (
    <div className="flex flex-col gap-4">
      <div className="text-lg font-semibold">Submit your work</div>
      <div
        {...dropzoneProps.getRootProps()}
        className="flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center hover:bg-gray-100"
      >
        <input {...dropzoneProps.getInputProps()} />
        <Icon icon="solar:upload-square-bold" className="size-12 text-gray-400" />
        {dropzoneProps.isDragActive ? (
          <p>Drop the file here</p>
        ) : (
          <div className="space-y-1">
            <p>Drag and drop a file here, or click to select</p>
            <p className="text-sm text-gray-500">
              Supported formats: PDF, JPEG, DOCX (max 10MB)
            </p>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Selected file:</div>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-md border bg-gray-50 p-2 text-sm"
            >
              <span className="truncate">{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className="ml-2 text-gray-500 hover:text-danger"
              >
                <Icon icon="solar:trash-bin-trash-bold" className="size-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="subtle" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={() => files.length > 0 && onSubmit(files)}
          disabled={files.length === 0 || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Icon icon="svg-spinners:270-ring" className="mr-2 size-5" />
              Submitting...
            </>
          ) : (
            'Submit'
          )}
        </Button>
      </div>
    </div>
  );
};

export default SubmissionPortal; 