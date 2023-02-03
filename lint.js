const puppeteer = require('puppeteer');
const html5Lint = require('html5-lint');

function typeOfColor(type)
{
    switch (type) {
        case 'error':
            return '\x1b[31m';
        case 'warn':
            return '\x1b[33m';
    }
    return '';
}

try {
    if (typeof process.argv[2] !== 'string') {
        throw new Error('The URL to evaluate must be given as an argument.');
    }
    new URL(process.argv[2]);

    (async () => {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        const response = await page.goto(process.argv[2]);
        const html = await response.text();
        await browser.close();

        html5Lint(html, function (err, results) {
            results.messages.forEach(function (msg) {
                let type = msg.type;
                if (typeof console[type] !== 'function') {
                    type = 'log';
                }
                console[type]('%sLine:%d [%s]: %s\x1b[39m', typeOfColor(type), msg.lastLine, msg.type, msg.message);
            });
        });
    })();
} catch (err) {
    console.error(err);
}
