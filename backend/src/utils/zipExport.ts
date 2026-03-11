import archiver from 'archiver';
import QRCode from 'qrcode';
import { Response } from 'express';
import { IQRCode } from '../models/QRCode.model';

export const streamQrZip = async (res: Response, codes: IQRCode[], batchId: string) => {
    const archive = archiver('zip', {
        zlib: { level: 9 }
    });

    const fileName = `malinkiddy-print-${batchId || 'export'}.zip`;
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    archive.pipe(res);

    // CSV Content strings
    let csvContent = 'Code,URL,ImageFile\n';

    for (const qr of codes) {
        // Generate PNG Buffer
        const buffer = await QRCode.toBuffer(qr.publicUrl, {
            width: 600,
            margin: 2,
            color: {
                dark: '#1b4332', // Brand primary color
                light: '#ffffff'
            }
        });

        const imgFileName = `${qr.code}.png`;

        // Add image to zip
        archive.append(buffer, { name: `images/${imgFileName}` });

        // Add row to CSV
        csvContent += `"${qr.code}","${qr.publicUrl}","images/${imgFileName}"\n`;
    }

    // Add CSV to zip
    archive.append(csvContent, { name: 'sticker_data.csv' });

    await archive.finalize();
};
