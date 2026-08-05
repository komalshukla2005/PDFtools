import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import JSZip from 'jszip';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { createRequire } from 'module';
import { Document, Paragraph, TextRun, Packer } from 'docx';
import mammoth from 'mammoth';
import PptxGenJS from 'pptxgenjs';
import { encryptPDF } from '@pdfsmaller/pdf-encrypt';
import { decryptPDF } from '@pdfsmaller/pdf-decrypt';
import LockedPdf from '../models/LockedPdf.js';

const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');

export const editPdf = async (fileBuffer, options = {}) => {
  const pdfDoc = await PDFDocument.load(fileBuffer);
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const {
    headerText = '',
    footerText = '',
    overlayText = '',
    rotation = 0,
    fontSize = 16,
    textColor = '#ff0000'
  } = options;

  const hexToRgb = (hex) => {
    const cleanHex = hex.replace('#', '');
    const num = parseInt(cleanHex, 16);
    return rgb(
      ((num >> 16) & 255) / 255,
      ((num >> 8) & 255) / 255,
      (num & 255) / 255
    );
  };

  const color = hexToRgb(textColor || '#ff0000');
  const size = parseInt(fontSize) || 16;
  const rotAngle = parseInt(rotation) || 0;

  pages.forEach((page) => {
    const { width, height } = page.getSize();

    if (rotAngle !== 0) {
      const currentRot = page.getRotation().angle;
      page.setRotation(degrees((currentRot + rotAngle) % 360));
    }

    if (headerText) {
      const textWidth = font.widthOfTextAtSize(headerText, size);
      page.drawText(headerText, {
        x: (width - textWidth) / 2,
        y: height - 40,
        size,
        font,
        color
      });
    }

    if (footerText) {
      const textWidth = font.widthOfTextAtSize(footerText, size);
      page.drawText(footerText, {
        x: (width - textWidth) / 2,
        y: 25,
        size,
        font,
        color
      });
    }

    if (overlayText) {
      const textWidth = font.widthOfTextAtSize(overlayText, size + 10);
      page.drawText(overlayText, {
        x: (width - textWidth) / 2,
        y: height / 2,
        size: size + 10,
        font,
        color,
        opacity: 0.8
      });
    }
  });

  const pdfBytes = await pdfDoc.save();
  return `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`;
};

export const pdfToWord = async (fileBuffer, originalName = 'document.pdf') => {
  let textContent = '';
  let pageCount = 1;

  try {
    const parser = new PDFParse({ data: fileBuffer });
    await parser.load();
    const parsedData = await parser.getText();
    textContent = parsedData.text || '';
    pageCount = parsedData.total || 1;
  } catch (err) {
    console.error(err);
  }

  if (!textContent.trim()) {
    textContent = 'PDF Document converted to Word format by PDFForge.';
  }

  const lines = textContent.split('\n').filter(line => line.trim().length > 0 && !line.includes('-- 1 of'));

  const paragraphs = lines.map(line => new Paragraph({
    children: [
      new TextRun({
        text: line,
        size: 24,
        font: 'Arial'
      })
    ]
  }));

  const doc = new Document({
    sections: [{
      properties: {},
      children: paragraphs.length > 0 ? paragraphs : [
        new Paragraph({
          children: [new TextRun({ text: 'Converted PDF Document', size: 28, bold: true })]
        })
      ]
    }]
  });

  const wordBuffer = await Packer.toBuffer(doc);
  const base64Docx = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${wordBuffer.toString('base64')}`;

  const baseName = originalName.replace(/\.[^/.]+$/, "");
  return {
    docx: base64Docx,
    fileName: `${baseName}.docx`,
    pageCount
  };
};

export const wordToPdf = async (fileBuffer, originalName = 'document.docx') => {
  const extracted = await mammoth.extractRawText({ buffer: fileBuffer });
  const textContent = extracted.value || 'Converted Word Document content.';
  const lines = textContent.split('\n').filter(l => l.trim().length > 0);

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;
  const lineHeight = 18;
  const margin = 50;

  let page = pdfDoc.addPage([595.28, 841.89]);
  let y = page.getHeight() - margin;

  for (const line of lines) {
    if (y < margin + lineHeight) {
      page = pdfDoc.addPage([595.28, 841.89]);
      y = page.getHeight() - margin;
    }

    const cleanLine = line.replace(/[\r\n\t]/g, ' ').substring(0, 80);
    page.drawText(cleanLine, {
      x: margin,
      y,
      size: fontSize,
      font,
      color: rgb(0.1, 0.1, 0.1)
    });
    y -= lineHeight;
  }

  const pdfBytes = await pdfDoc.save();
  const base64Pdf = `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`;
  const baseName = originalName.replace(/\.[^/.]+$/, "");

  return {
    pdf: base64Pdf,
    fileName: `${baseName}.pdf`
  };
};

export const pdfToPpt = async (fileBuffer, originalName = 'presentation.pdf') => {
  let textContent = '';
  try {
    const parser = new PDFParse({ data: fileBuffer });
    await parser.load();
    const parsedData = await parser.getText();
    textContent = parsedData.text || '';
  } catch (err) {
    console.error(err);
  }

  if (!textContent.trim()) {
    textContent = 'Slide Content';
  }

  const pagesText = textContent.split(/-- \d+ of \d+ --|\f/).filter(t => t.trim().length > 0);

  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';

  const slidesContent = pagesText.length > 0 ? pagesText : [textContent];

  slidesContent.forEach((slideText, index) => {
    const slide = pptx.addSlide();
    
    slide.addText(`Slide ${index + 1}`, {
      x: 0.8,
      y: 0.6,
      w: 8.4,
      h: 0.8,
      fontSize: 24,
      bold: true,
      color: 'E11D48'
    });

    const bodyText = slideText.trim().substring(0, 500);
    slide.addText(bodyText, {
      x: 0.8,
      y: 1.6,
      w: 8.4,
      h: 4.5,
      fontSize: 14,
      color: '1E293B',
      valign: 'top',
      wrap: true
    });
  });

  const pptBuffer = await pptx.write({ outputType: 'nodebuffer' });
  const base64Ppt = `data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,${pptBuffer.toString('base64')}`;
  const baseName = originalName.replace(/\.[^/.]+$/, "");

  return {
    ppt: base64Ppt,
    fileName: `${baseName}.pptx`,
    slideCount: slidesContent.length
  };
};

export const lockPdf = async (fileBuffer, fileName, password, user) => {
  if (!password || password.trim().length < 3) {
    throw new Error('Please provide a valid password of at least 3 characters.');
  }

  const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
  const passwordHash = await bcrypt.hash(password, 10);

  const encryptedPdfUint8 = await encryptPDF(fileBuffer, password);
  const encryptedBuffer = Buffer.from(encryptedPdfUint8);

  const lockedRecord = await LockedPdf.create({
    userId: user.id || user._id,
    userEmail: user.email || 'user@pdfforge.com',
    originalFileName: fileName,
    fileHash,
    encryptedContent: encryptedBuffer.toString('base64'),
    passwordHash,
    status: 'locked'
  });

  const base64Pdf = `data:application/pdf;base64,${encryptedBuffer.toString('base64')}`;

  return {
    recordId: lockedRecord._id,
    pdf: base64Pdf,
    fileName: `locked_${fileName}`
  };
};

export const unlockPdf = async (fileBuffer, fileName, password, user) => {
  if (!password) {
    throw new Error('Please enter the password to unlock this document.');
  }

  const userId = user.id || user._id;
  const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

  let record = await LockedPdf.findOne({
    userId,
    fileHash,
    status: 'locked'
  });

  if (!record) {
    record = await LockedPdf.findOne({
      userId,
      originalFileName: fileName,
      status: 'locked'
    }).sort({ createdAt: -1 });
  }

  if (!record) {
    throw new Error('Unauthorized or Not Found: Only PDFs locked on PDFForge by your account can be unlocked!');
  }

  const isPasswordValid = await bcrypt.compare(password, record.passwordHash);
  if (!isPasswordValid) {
    throw new Error('Incorrect password! Unlock failed.');
  }

  let decryptedBuffer;
  try {
    const decryptedUint8 = await decryptPDF(fileBuffer, password);
    decryptedBuffer = Buffer.from(decryptedUint8);
  } catch (err) {
    const storedBuf = Buffer.from(record.encryptedContent, 'base64');
    const decryptedUint8 = await decryptPDF(storedBuf, password);
    decryptedBuffer = Buffer.from(decryptedUint8);
  }

  record.status = 'unlocked';
  await record.save();

  const base64Pdf = `data:application/pdf;base64,${decryptedBuffer.toString('base64')}`;

  return {
    recordId: record._id,
    pdf: base64Pdf,
    fileName: `unlocked_${fileName}`
  };
};

export const mergePdfs = async (fileBuffers) => {
  const mergedPdf = await PDFDocument.create();

  for (const buffer of fileBuffers) {
    const pdfDoc = await PDFDocument.load(buffer);
    const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const mergedPdfBytes = await mergedPdf.save();
  return Buffer.from(mergedPdfBytes);
};

export const splitPdf = async (fileBuffer, options = {}) => {
  const srcPdf = await PDFDocument.load(fileBuffer);
  const totalPages = srcPdf.getPageCount();

  let { mode = 'single', startPage = 1, endPage = totalPages } = options;
  startPage = Math.max(1, parseInt(startPage) || 1);
  endPage = Math.min(totalPages, parseInt(endPage) || totalPages);

  if (mode === 'range') {
    const newPdf = await PDFDocument.create();
    const pageIndices = [];
    for (let i = startPage - 1; i <= endPage - 1; i++) {
      if (i >= 0 && i < totalPages) {
        pageIndices.push(i);
      }
    }
    const copiedPages = await newPdf.copyPages(srcPdf, pageIndices);
    copiedPages.forEach((page) => newPdf.addPage(page));
    const pdfBytes = await newPdf.save();
    const base64Pdf = `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`;

    return {
      pdf: base64Pdf,
      totalPages: pageIndices.length,
      range: `${startPage}-${endPage}`
    };
  }

  const splitResults = [];
  for (let i = 0; i < totalPages; i++) {
    const newPdf = await PDFDocument.create();
    const [copiedPage] = await newPdf.copyPages(srcPdf, [i]);
    newPdf.addPage(copiedPage);
    const pdfBytes = await newPdf.save();
    const base64Pdf = `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`;
    splitResults.push({ page: i + 1, pdf: base64Pdf });
  }

  return {
    pdf: splitResults[0]?.pdf,
    totalPages,
    pages: splitResults
  };
};

export const createZipArchive = async (files) => {
  const zip = new JSZip();

  files.forEach((file) => {
    zip.file(file.originalname, file.buffer);
  });

  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
  return zipBuffer;
};

export const addWatermark = async (fileBuffer, options = {}, watermarkImageBuffer = null, watermarkMimeType = '') => {
  const pdfDoc = await PDFDocument.load(fileBuffer);
  const pages = pdfDoc.getPages();
  const opacity = parseFloat(options.opacity) || 0.4;
  const imageScale = parseFloat(options.imageScale) || 1.0;
  const fitMode = options.fitMode || 'cover';

  if (options.watermarkType === 'image' && watermarkImageBuffer) {
    let embeddedImg;
    const isPng = watermarkMimeType.includes('png') || (watermarkImageBuffer[0] === 0x89 && watermarkImageBuffer[1] === 0x50);

    if (isPng) {
      embeddedImg = await pdfDoc.embedPng(watermarkImageBuffer);
    } else {
      embeddedImg = await pdfDoc.embedJpg(watermarkImageBuffer);
    }

    pages.forEach((page) => {
      const { width, height } = page.getSize();
      let imgWidth, imgHeight;

      if (fitMode === 'contain') {
        const aspect = embeddedImg.height / embeddedImg.width;
        imgWidth = width * imageScale;
        imgHeight = imgWidth * aspect;
      } else {
        imgWidth = width * imageScale;
        imgHeight = height * imageScale;
      }

      page.drawImage(embeddedImg, {
        x: (width - imgWidth) / 2,
        y: (height - imgHeight) / 2,
        width: imgWidth,
        height: imgHeight,
        opacity
      });
    });
  } else {
    const text = options.text || 'CONFIDENTIAL';
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontSize = parseInt(options.fontSize) || 45;

    pages.forEach((page) => {
      const { width, height } = page.getSize();
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      const textHeight = font.heightAtSize(fontSize);
      page.drawText(text, {
        x: (width - textWidth) / 2,
        y: (height - textHeight) / 2,
        size: fontSize,
        font,
        color: rgb(0.7, 0.7, 0.7),
        opacity,
        rotate: degrees(-45)
      });
    });
  }

  const pdfBytes = await pdfDoc.save();
  return `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`;
};

export const deletePages = async (fileBuffer, pagesToDeleteInput) => {
  const pdfDoc = await PDFDocument.load(fileBuffer);
  const totalPages = pdfDoc.getPageCount();

  let targetPages = [];
  if (Array.isArray(pagesToDeleteInput)) {
    targetPages = pagesToDeleteInput.map(n => parseInt(n)).filter(n => !isNaN(n));
  } else if (typeof pagesToDeleteInput === 'string') {
    targetPages = pagesToDeleteInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
  } else if (typeof pagesToDeleteInput === 'number') {
    targetPages = [pagesToDeleteInput];
  }

  if (targetPages.length === 0) {
    throw new Error('Please specify valid page numbers to delete.');
  }

  for (const pageNum of targetPages) {
    if (pageNum < 1 || pageNum > totalPages) {
      throw new Error('Page not existing');
    }
  }

  const uniqueSortedDesc = [...new Set(targetPages)].sort((a, b) => b - a);

  if (uniqueSortedDesc.length >= totalPages) {
    throw new Error('Cannot delete all pages of a PDF document.');
  }

  uniqueSortedDesc.forEach((pageNum) => {
    pdfDoc.removePage(pageNum - 1);
  });

  const pdfBytes = await pdfDoc.save();
  return `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`;
};

export const imagesToPdf = async (imageFiles) => {
  const pdfDoc = await PDFDocument.create();

  for (const file of imageFiles) {
    let embeddedImg;
    const isPng = file.mimetype.includes('png') || (file.buffer && file.buffer[0] === 0x89);
    if (isPng) {
      embeddedImg = await pdfDoc.embedPng(file.buffer);
    } else {
      embeddedImg = await pdfDoc.embedJpg(file.buffer);
    }

    const page = pdfDoc.addPage([embeddedImg.width, embeddedImg.height]);
    page.drawImage(embeddedImg, {
      x: 0,
      y: 0,
      width: embeddedImg.width,
      height: embeddedImg.height
    });
  }

  const pdfBytes = await pdfDoc.save();
  return `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`;
};

export const pdfToImages = async (fileBuffer) => {
  const pdfDoc = await PDFDocument.load(fileBuffer);
  const totalPages = pdfDoc.getPageCount();
  const images = [];

  for (let i = 0; i < totalPages; i++) {
    const singlePdf = await PDFDocument.create();
    const [copiedPage] = await singlePdf.copyPages(pdfDoc, [i]);
    singlePdf.addPage(copiedPage);
    const pdfBytes = await singlePdf.save();
    const base64Data = `data:application/pdf;base64,${Buffer.from(pdfBytes).toString('base64')}`;
    images.push({ page: i + 1, image: base64Data });
  }

  return { totalPages, images, mainImage: images[0]?.image };
};
