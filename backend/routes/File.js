const express = require('express');
const multer = require('multer');
const path = require('path');
const verifyToken = require("../middleware/jwt");
const fs = require('fs');
const sharp = require('sharp');

const router = express.Router();

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/user'));
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext).replace(/\s+/g, '-');
        cb(null, Date.now() + '-' + baseName + ext);
    }
});

const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Type de fichier non autorisé'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {fileSize: 5 * 1024 * 1024} // Limite à 5 Mo
});

router.post('/upload', verifyToken, upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({error: 'Aucun fichier envoyé ou type de fichier invalide.'});
    }

    const inputPath = req.file.path;
    const outputFilename = `${req.user.id}.jpeg`;
    const outputPath = path.join(__dirname, '../public/user', outputFilename);

    try {
        await sharp(inputPath)
            .jpeg({quality: 90})
            .toFile(outputPath);

        fs.unlinkSync(inputPath);

        return res.status(200).json({
            message: 'Fichier uploadé et converti en JPEG avec succès',
            filename: outputFilename,
            path: `/public/user/${outputFilename}`
        });
    } catch (err) {
        return res.status(500).json({error: 'Erreur lors de la conversion.'});
    }
});

module.exports = router;
