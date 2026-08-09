const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://pd-ftools-ecru.vercel.app/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};


export const pdfToWordApi = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/tools/pdf-to-word`, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to convert PDF to Word document');
  }

  return { downloadUrl: data.docx, fileName: data.fileName, message: data.message };
};

export const wordToPdfApi = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/tools/word-to-pdf`, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to convert Word to PDF document');
  }

  return { downloadUrl: data.pdf, fileName: data.fileName, message: data.message };
};

export const pdfToPptApi = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/tools/pdf-to-ppt`, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to convert PDF to PowerPoint presentation');
  }

  return { downloadUrl: data.ppt, fileName: data.fileName, message: data.message };
};

export const lockPdfApi = async (file, password) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('password', password);

  const response = await fetch(`${API_BASE_URL}/tools/lock`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to lock PDF document');
  }

  return { downloadUrl: data.pdf, fileName: data.fileName, message: data.message };
};

export const unlockPdfApi = async (file, password) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('password', password);

  const response = await fetch(`${API_BASE_URL}/tools/unlock`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to unlock PDF document');
  }

  return { downloadUrl: data.pdf, fileName: data.fileName, message: data.message };
};

export const mergePdfsApi = async (files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await fetch(`${API_BASE_URL}/tools/merge`, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to merge PDFs on backend server');
  }

  return { downloadUrl: data.pdf, message: data.message };
};

export const splitPdfApi = async (file, options = {}) => {
  const formData = new FormData();
  formData.append('file', file);

  if (options.mode) formData.append('mode', options.mode);
  if (options.startPage) formData.append('startPage', options.startPage);
  if (options.endPage) formData.append('endPage', options.endPage);

  const response = await fetch(`${API_BASE_URL}/tools/split`, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to split PDF on backend server');
  }

  return { downloadUrl: data.pdf, pages: data.pages, message: data.message };
};

export const zipArchiveApi = async (files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await fetch(`${API_BASE_URL}/tools/zip`, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to create Zip archive on backend server');
  }

  return { downloadUrl: data.zip, message: data.message };
};

export const addWatermarkApi = async (pdfFile, options = {}, watermarkImageFile = null) => {
  const formData = new FormData();
  formData.append('pdfFile', pdfFile);
  formData.append('watermarkType', options.watermarkType || 'text');
  if (options.text) formData.append('text', options.text);
  if (options.fontSize) formData.append('fontSize', options.fontSize);
  if (options.opacity) formData.append('opacity', options.opacity);
  if (options.imageScale) formData.append('imageScale', options.imageScale);
  if (options.fitMode) formData.append('fitMode', options.fitMode);
  if (watermarkImageFile) formData.append('watermarkImage', watermarkImageFile);

  const response = await fetch(`${API_BASE_URL}/tools/watermark`, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to add watermark on backend server');
  }

  return { downloadUrl: data.pdf, message: data.message };
};

export const deletePagesApi = async (file, pagesToDelete) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('pagesToDelete', pagesToDelete);

  const response = await fetch(`${API_BASE_URL}/tools/delete-pages`, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to delete pages on backend server');
  }

  return { downloadUrl: data.pdf, message: data.message };
};

export const imagesToPdfApi = async (files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await fetch(`${API_BASE_URL}/tools/images-to-pdf`, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to convert images to PDF on backend server');
  }

  return { downloadUrl: data.pdf, message: data.message };
};

export const pdfToImagesApi = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/tools/pdf-to-images`, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to convert PDF to images on backend server');
  }

  return { downloadUrl: data.pdf, images: data.images, message: data.message };
};
