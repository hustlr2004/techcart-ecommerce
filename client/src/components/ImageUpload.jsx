import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export default function ImageUpload({ value = [], onChange, maxImages = 4 }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [deletingUrl, setDeletingUrl] = useState('');
  const [error, setError] = useState('');

  const remainingSlots = Math.max(maxImages - value.length, 0);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl('');
      return undefined;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    setError('');

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please choose a valid image file.');
      setSelectedFile(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError('Image must be 5MB or smaller.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  }

  async function handleUpload() {
    if (!selectedFile || uploading || remainingSlots <= 0) return;

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      setUploading(true);
      setUploadProgress(0);
      setError('');

      const { data } = await api.post('/api/upload/single', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          if (!event.total) return;
          setUploadProgress(Math.round((event.loaded * 100) / event.total));
        },
      });

      onChange([...value, { url: data.url, public_id: data.public_id }]);
      setSelectedFile(null);
      setUploadProgress(0);
    } catch (uploadError) {
      setError(uploadError.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(image) {
    try {
      setDeletingUrl(image.url);
      setError('');

      if (image.public_id) {
        await api.delete(`/api/upload/${encodeURIComponent(image.public_id)}`);
      }

      onChange(value.filter((item) => item.url !== image.url));
    } catch (deleteError) {
      setError(deleteError.response?.data?.message || 'Failed to delete image');
    } finally {
      setDeletingUrl('');
    }
  }

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 md:col-span-2">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-500">Product Images</p>
          <p className="mt-2 text-sm text-slate-600">
            Upload up to {maxImages} images. JPG, PNG, and WebP are supported.
          </p>
        </div>
        <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-600 shadow-sm">
          {value.length}/{maxImages} uploaded
        </span>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="space-y-4">
          <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-slate-300 bg-white px-6 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={remainingSlots <= 0 || uploading}
            />
            <span className="text-sm font-semibold text-slate-700">
              {remainingSlots > 0 ? 'Choose image to preview' : 'Maximum image limit reached'}
            </span>
            <span className="mt-2 text-sm text-slate-500">
              {remainingSlots > 0 ? `You can still add ${remainingSlots} image${remainingSlots === 1 ? '' : 's'}.` : 'Delete one image before uploading another.'}
            </span>
          </label>

          {previewUrl ? (
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="overflow-hidden rounded-[1.25rem] bg-slate-100">
                <img src={previewUrl} alt="Preview" className="h-52 w-full object-cover" />
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{selectedFile?.name}</p>
                  <p className="text-sm text-slate-500">Ready to upload</p>
                </div>
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploading}
                  className="rounded-2xl bg-blue-500 px-5 py-3 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
              </div>
              {uploading ? (
                <div className="mt-4">
                  <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-sm font-medium text-slate-600">{uploadProgress}% uploaded</p>
                </div>
              ) : null}
            </div>
          ) : null}

          {error ? <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">{error}</p> : null}
        </div>

        <div className="space-y-3">
          {value.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500">
              Uploaded images will appear here.
            </div>
          ) : (
            value.map((image, index) => (
              <div key={`${image.url}-${index}`} className="rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-sm">
                <div className="overflow-hidden rounded-[1.1rem] bg-slate-100">
                  <img src={image.url} alt={`Product ${index + 1}`} className="h-28 w-full object-cover" />
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Image {index + 1}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleDelete(image)}
                    disabled={deletingUrl === image.url}
                    className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingUrl === image.url ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
