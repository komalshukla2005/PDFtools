import express from 'express';
import multer from 'multer';
import { register, login, getUsers } from './authController.js';
import { optionalVerifyToken } from '../middleware/authMiddleware.js';
import {
  mergePdfController,
  splitPdfController,
  zipArchiveController,
  addWatermarkController,
  deletePagesController,
  imagesToPdfController,
  pdfToImagesController,
  lockPdfController,
  unlockPdfController,
  pdfToWordController,
  wordToPdfController,
  pdfToPptController
} from '../tools/toolController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/register', register);
router.post('/login', login);
router.get('/users', getUsers);

router.post('/merge', upload.array('files'), mergePdfController);
router.post('/split', upload.single('file'), splitPdfController);
router.post('/zip', upload.array('files'), zipArchiveController);
router.post('/watermark', upload.any(), addWatermarkController);
router.post('/delete-pages', upload.single('file'), deletePagesController);
router.post('/images-to-pdf', upload.array('files'), imagesToPdfController);
router.post('/pdf-to-images', upload.single('file'), pdfToImagesController);
router.post('/lock', optionalVerifyToken, upload.single('file'), lockPdfController);
router.post('/unlock', optionalVerifyToken, upload.single('file'), unlockPdfController);

router.post('/pdf-to-word', upload.single('file'), pdfToWordController);
router.post('/word-to-pdf', upload.single('file'), wordToPdfController);
router.post('/pdf-to-ppt', upload.single('file'), pdfToPptController);

export default router;
