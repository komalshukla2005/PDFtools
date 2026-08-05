import {
  mergePdfs,
  splitPdf,
  createZipArchive,
  addWatermark,
  deletePages,
  imagesToPdf,
  pdfToImages,
  lockPdf,
  unlockPdf,
  editPdf,
  pdfToWord,
  wordToPdf,
  pdfToPpt
} from './toolService.js';

export const editPdfController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF file to edit.' });
    }

    const base64Pdf = await editPdf(req.file.buffer, req.body);

    res.status(200).json({
      success: true,
      message: 'PDF edited successfully!',
      pdf: base64Pdf
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error editing PDF', error: error.message });
  }
};

export const pdfToWordController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF file.' });
    }

    const result = await pdfToWord(req.file.buffer, req.file.originalname);

    res.status(200).json({
      success: true,
      message: 'PDF converted to Word successfully!',
      docx: result.docx,
      fileName: result.fileName
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error converting PDF to Word', error: error.message });
  }
};

export const wordToPdfController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a Word document (.docx).' });
    }

    const result = await wordToPdf(req.file.buffer, req.file.originalname);

    res.status(200).json({
      success: true,
      message: 'Word document converted to PDF successfully!',
      pdf: result.pdf,
      fileName: result.fileName
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error converting Word to PDF', error: error.message });
  }
};

export const pdfToPptController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF file.' });
    }

    const result = await pdfToPpt(req.file.buffer, req.file.originalname);

    res.status(200).json({
      success: true,
      message: 'PDF converted to PowerPoint presentation successfully!',
      ppt: result.ppt,
      fileName: result.fileName
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error converting PDF to PowerPoint', error: error.message });
  }
};

export const lockPdfController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF file to lock.' });
    }

    const { password } = req.body;
    const user = req.user || { id: 'anonymous', email: 'guest@pdfforge.com' };

    const result = await lockPdf(req.file.buffer, req.file.originalname, password, user);

    res.status(200).json({
      success: true,
      message: 'PDF locked and user record saved successfully!',
      pdf: result.pdf,
      fileName: result.fileName,
      recordId: result.recordId
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const unlockPdfController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF file to unlock.' });
    }

    const { password } = req.body;
    const user = req.user || { id: 'anonymous', email: 'guest@pdfforge.com' };

    const result = await unlockPdf(req.file.buffer, req.file.originalname, password, user);

    res.status(200).json({
      success: true,
      message: 'PDF unlocked successfully!',
      pdf: result.pdf,
      fileName: result.fileName
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const mergePdfController = async (req, res) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ success: false, message: 'Please upload at least 2 PDF files to merge.' });
    }

    const fileBuffers = req.files.map(file => file.buffer);
    const mergedBuffer = await mergePdfs(fileBuffers);
    const base64Pdf = `data:application/pdf;base64,${mergedBuffer.toString('base64')}`;

    res.status(200).json({
      success: true,
      message: 'PDF merged successfully!',
      pdf: base64Pdf
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error merging PDFs', error: error.message });
  }
};

export const splitPdfController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF file to split.' });
    }

    const { mode, startPage, endPage } = req.body;
    const result = await splitPdf(req.file.buffer, { mode, startPage, endPage });

    res.status(200).json({
      success: true,
      message: 'PDF split successfully!',
      pdf: result.pdf,
      totalPages: result.totalPages,
      pages: result.pages
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error splitting PDF', error: error.message });
  }
};

export const zipArchiveController = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please upload at least 1 file to create a Zip archive.' });
    }

    const zipBuffer = await createZipArchive(req.files);
    const base64Zip = `data:application/zip;base64,${zipBuffer.toString('base64')}`;

    res.status(200).json({
      success: true,
      message: 'Zip archive created successfully!',
      zip: base64Zip
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating Zip archive', error: error.message });
  }
};

export const addWatermarkController = async (req, res) => {
  try {
    let pdfFile = null;
    let watermarkImgFile = null;

    if (Array.isArray(req.files)) {
      pdfFile = req.files.find(f => f.fieldname === 'pdfFile' || f.mimetype === 'application/pdf') || req.files[0];
      watermarkImgFile = req.files.find(f => f.fieldname === 'watermarkImage' || f.mimetype.startsWith('image/'));
    } else if (req.files) {
      pdfFile = req.files.pdfFile ? req.files.pdfFile[0] : (req.files.file ? req.files.file[0] : null);
      watermarkImgFile = req.files.watermarkImage ? req.files.watermarkImage[0] : null;
    } else if (req.file) {
      pdfFile = req.file;
    }

    if (!pdfFile) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF file.' });
    }

    const base64Pdf = await addWatermark(
      pdfFile.buffer,
      req.body,
      watermarkImgFile ? watermarkImgFile.buffer : null,
      watermarkImgFile ? watermarkImgFile.mimetype : ''
    );

    res.status(200).json({
      success: true,
      message: 'Watermark added successfully!',
      pdf: base64Pdf
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding watermark', error: error.message });
  }
};

export const deletePagesController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF file.' });
    }

    const pagesToDelete = req.body.pagesToDelete || req.body.pages;
    const base64Pdf = await deletePages(req.file.buffer, pagesToDelete);

    res.status(200).json({
      success: true,
      message: 'Pages deleted successfully!',
      pdf: base64Pdf
    });
  } catch (error) {
    const statusCode = error.message === 'Page not existing' ? 400 : 500;
    res.status(statusCode).json({ success: false, message: error.message });
  }
};

export const imagesToPdfController = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please upload at least 1 image file.' });
    }

    const base64Pdf = await imagesToPdf(req.files);

    res.status(200).json({
      success: true,
      message: 'Images converted to PDF successfully!',
      pdf: base64Pdf
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error converting images to PDF', error: error.message });
  }
};

export const pdfToImagesController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF file.' });
    }

    const result = await pdfToImages(req.file.buffer);

    res.status(200).json({
      success: true,
      message: 'PDF converted to images successfully!',
      totalPages: result.totalPages,
      pdf: result.mainImage,
      images: result.images
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error converting PDF to images', error: error.message });
  }
};
