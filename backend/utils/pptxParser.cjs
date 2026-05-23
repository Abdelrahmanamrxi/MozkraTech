const officeParser = require('officeparser');
const { writeFileSync, unlinkSync } = require('fs');
const { tmpdir } = require('os');
const { join } = require('path');
const { promisify } = require('util');

module.exports = async function parsePptx(buffer) {
    const tempPath = join(tmpdir(), `pptx_${Date.now()}.pptx`);
    writeFileSync(tempPath, buffer);
    try {
        const text = await new Promise((resolve, reject) => {
            officeParser.parseOffice(tempPath, (data, err) => {
                if (err) return reject(new Error(err));
                resolve(data);
            });
        });
        return text;
    } finally {
        unlinkSync(tempPath);
    }
};