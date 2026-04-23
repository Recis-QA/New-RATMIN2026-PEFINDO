const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

async function generatePDF() {
    const args = process.argv.slice(2);
    let specName = 'full-report';

    const specIndex = args.indexOf('--spec');
    if (specIndex !== -1 && args[specIndex + 1]) {
        specName = path.basename(args[specIndex + 1]).replace('.cy.js', '');
    }

    const reportBaseDir = path.join(__dirname, 'cypress', 'reports');
    if (!fs.existsSync(reportBaseDir)) {
        console.error('Folder cypress/reports tidak ditemukan!');
        return;
    }

    const folders = fs.readdirSync(reportBaseDir)
        .filter(f => f.startsWith('run-'))
        .map(f => ({ name: f, time: fs.statSync(path.join(reportBaseDir, f)).mtime }))
        .sort((a, b) => b.time - a.time);

    if (folders.length === 0) {
        console.error('Tidak ditemukan folder laporan run-xxx!');
        return;
    }

    const latestFolder = folders[0].name;
    const htmlPath = path.resolve(reportBaseDir, latestFolder, 'index.html');
    const pdfPath = path.resolve(reportBaseDir, latestFolder, `report-${specName}.pdf`);

    console.log(`Mengonversi ${specName} ke PDF...`);

    const browser = await puppeteer.launch({
    headless: 'new',
    protocolTimeout: 120000
    });

    const page = await browser.newPage();

    // disable internal timeouts
    page.setDefaultTimeout(0);
    page.setDefaultNavigationTimeout(0);

    const url = `file://${htmlPath}`;

    await page.goto(url, { waitUntil: 'load' });

    // tunggu grafik & screenshot render
    await new Promise(r => setTimeout(r, 5000));

    await page.emulateMediaType('screen');

    await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    timeout: 0,
    margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
    });

    await browser.close();
    console.log(`Berhasil! PDF tersimpan: ${pdfPath}`);

    console.log(`Membuka PDF otomatis...`);
    const start = process.platform === 'darwin'
        ? 'open'
        : process.platform === 'win32'
            ? 'start ""'
            : 'xdg-open';

    exec(`${start} "${pdfPath}"`);
}

generatePDF();
