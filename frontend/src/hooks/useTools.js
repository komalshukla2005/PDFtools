import { useState } from 'react';
import {
  mergePdfsApi,
  splitPdfApi,
  zipArchiveApi,
  addWatermarkApi,
  deletePagesApi,
  imagesToPdfApi,
  pdfToImagesApi,
  lockPdfApi,
  unlockPdfApi,
  editPdfApi,
  pdfToWordApi,
  wordToPdfApi,
  pdfToPptApi
} from '../services/toolService';

export const useTools = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const editPdf = async (file, options) => {
    setLoading(true);
    setError(null);
    try {
      const data = await editPdfApi(file, options);
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      throw err;
    }
  };

  const pdfToWord = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const data = await pdfToWordApi(file);
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      throw err;
    }
  };

  const wordToPdf = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const data = await wordToPdfApi(file);
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      throw err;
    }
  };

  const pdfToPpt = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const data = await pdfToPptApi(file);
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      throw err;
    }
  };

  const lockPdf = async (file, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await lockPdfApi(file, password);
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      throw err;
    }
  };

  const unlockPdf = async (file, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await unlockPdfApi(file, password);
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      throw err;
    }
  };

  const mergePdfs = async (files) => {
    setLoading(true);
    setError(null);
    try {
      const data = await mergePdfsApi(files);
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      throw err;
    }
  };

  const splitPdf = async (file, options) => {
    setLoading(true);
    setError(null);
    try {
      const data = await splitPdfApi(file, options);
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      throw err;
    }
  };

  const createZip = async (files) => {
    setLoading(true);
    setError(null);
    try {
      const data = await zipArchiveApi(files);
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      throw err;
    }
  };

  const addWatermark = async (pdfFile, options, watermarkImageFile) => {
    setLoading(true);
    setError(null);
    try {
      const data = await addWatermarkApi(pdfFile, options, watermarkImageFile);
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      throw err;
    }
  };

  const deletePdfPages = async (file, pagesToDelete) => {
    setLoading(true);
    setError(null);
    try {
      const data = await deletePagesApi(file, pagesToDelete);
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      throw err;
    }
  };

  const convertImagesToPdf = async (files) => {
    setLoading(true);
    setError(null);
    try {
      const data = await imagesToPdfApi(files);
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      throw err;
    }
  };

  const convertPdfToImages = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const data = await pdfToImagesApi(file);
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      setError(err.message);
      throw err;
    }
  };

  return {
    editPdf,
    pdfToWord,
    wordToPdf,
    pdfToPpt,
    lockPdf,
    unlockPdf,
    mergePdfs,
    splitPdf,
    createZip,
    addWatermark,
    deletePdfPages,
    convertImagesToPdf,
    convertPdfToImages,
    loading,
    error,
    setError
  };
};
