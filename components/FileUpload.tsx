'use client';

import { useCallback, useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatBytes } from '@/lib/utils';

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED = ['image/jpeg', 'image/jpg', 'image/png'];

interface FileUploadProps {
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

export default function FileUpload({ value, onChange, error }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const processFile = useCallback(
    (file: File) => {
      setFileError(null);

      if (!ALLOWED.includes(file.type)) {
        setFileError('Only JPG and PNG images are accepted');
        return;
      }
      if (file.size > MAX_SIZE) {
        setFileError(`File too large — max size is 5 MB (yours is ${formatBytes(file.size)})`);
        return;
      }

      const url = URL.createObjectURL(file);
      setPreview(url);
      onChange(file);
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const handleRemove = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    onChange(null);
    setFileError(null);
  };

  const displayError = fileError || error;

  if (value && preview) {
    return (
      <div className="w-full">
        <div className="relative rounded-2xl overflow-hidden border-2 border-blue-200 bg-blue-50/30 animate-fade-in">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-56 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
            <div className="text-white">
              <p className="text-sm font-semibold truncate max-w-[200px]">{value.name}</p>
              <p className="text-xs text-white/70 mt-0.5">{formatBytes(value.size)}</p>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="w-9 h-9 bg-white/20 hover:bg-red-500 backdrop-blur-sm rounded-xl flex items-center justify-center transition-colors duration-200 group"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
          <div className="absolute top-3 right-3">
            <span className="bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-white rounded-full" />
              Ready
            </span>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">
          Click the X to remove and upload a different photo
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleChange}
        className="sr-only"
        aria-label="Upload photo"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'w-full rounded-2xl border-2 border-dashed p-8 flex flex-col items-center justify-center gap-3',
          'transition-all duration-200 cursor-pointer group',
          isDragging
            ? 'border-blue-500 bg-blue-50 scale-[1.01]'
            : displayError
            ? 'border-red-300 bg-red-50 hover:border-red-400'
            : 'border-slate-200 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/40'
        )}
      >
        <div
          className={cn(
            'w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-200',
            isDragging ? 'bg-blue-100' : 'bg-white shadow-sm group-hover:bg-blue-50'
          )}
        >
          {isDragging ? (
            <Upload className="w-7 h-7 text-blue-500 animate-bounce" />
          ) : (
            <ImageIcon className={cn('w-7 h-7', displayError ? 'text-red-400' : 'text-slate-400 group-hover:text-blue-500')} />
          )}
        </div>

        <div className="text-center">
          <p className={cn('font-semibold text-sm', displayError ? 'text-red-600' : 'text-slate-700')}>
            {isDragging ? 'Drop your photo here' : 'Upload a valid ID photo'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Drag & drop or{' '}
            <span className="text-blue-500 font-medium underline underline-offset-2">browse files</span>
          </p>
          <p className="text-xs text-slate-400 mt-0.5">JPG or PNG — max 5 MB</p>
        </div>
      </button>

      {displayError && (
        <div className="mt-2 flex items-center gap-2 text-red-500 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p className="text-sm">{displayError}</p>
        </div>
      )}
    </div>
  );
}
