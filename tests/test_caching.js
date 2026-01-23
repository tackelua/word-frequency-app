const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

const PORT = 3006; // Use a different port
const HOST = `http://localhost:${PORT}`;
const STARTUP_TIMEOUT = 10000; // 10s

// Sample file
const TEST_FILE = path.join(__dirname, 'cache_test_file.txt');
const CACHE_DIR = path.join(__dirname, '..', 'uploads', 'cache');

async function runTest() {
    console.log('🚀 Starting Verification Test for Text Caching');

    // Setup
    fs.writeFileSync(TEST_FILE, "This is a unique text content for caching validation. ID: " + Date.now());

    // Clear previous cache to ensure MISS on first try
    if (fs.existsSync(CACHE_DIR)) {
        console.log('🧹 Clearing cache directory...');
        fs.rmSync(CACHE_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(CACHE_DIR, { recursive: true });

    // Start Server
    console.log('Starting server...');
    const serverProcess = spawn('node', ['server.js'], {
        cwd: path.resolve(__dirname, '..'),
        env: { ...process.env, PORT },
        stdio: 'pipe'
    });

    let serverReady = false;
    let serverLogs = [];

    serverProcess.stdout.on('data', (data) => {
        const msg = data.toString();
        serverLogs.push(msg);
        console.log(`[Server]: ${msg.trim()}`);
        if (msg.includes(`Server running at http://localhost:${PORT}`)) {
            serverReady = true;
        }
    });

    serverProcess.stderr.on('data', (data) => console.error(`[Server Err]: ${data}`));

    await waitForCondition(() => serverReady, STARTUP_TIMEOUT, 'Server failed to start');

    try {
        // 1. First Upload (Expect MISS)
        console.log('\n📤 Uploading file (1st time)...');
        serverLogs.length = 0; // Clear logs
        await uploadFile();

        await waitForCondition(() =>
            serverLogs.some(l => l.includes('Saved parsed text to cache')),
            2000,
            '❌ Did not see "Saved parsed text to cache" log'
        );
        console.log('✅ Cache MISS confirmed (Saved to cache).');

        // 2. Second Upload (Expect HIT)
        console.log('\n📤 Uploading file (2nd time)...');
        serverLogs.length = 0; // Clear logs
        await uploadFile();

        await waitForCondition(() =>
            serverLogs.some(l => l.toLowerCase().includes('cache hit')),
            2000,
            '❌ Did not see "Cache hit" log'
        );
        console.log('✅ Cache HIT confirmed.');

    } catch (error) {
        console.error('❌ Test Failed:', error.message);
        process.exit(1);
    } finally {
        serverProcess.kill();
        if (fs.existsSync(TEST_FILE)) fs.unlinkSync(TEST_FILE);
        process.exit(0);
    }
}

async function uploadFile() {
    const formData = await createFormData(TEST_FILE);
    return new Promise((resolve, reject) => {
        const req = http.request(`${HOST}/api/upload`, {
            method: 'POST',
            headers: formData.headers
        }, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => resolve(JSON.parse(data)));
        });
        req.on('error', reject);
        req.write(formData.body);
        req.end();
    });
}

function waitForCondition(predicate, timeout, errorMsg) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        const interval = setInterval(() => {
            if (predicate()) {
                clearInterval(interval);
                resolve();
            } else if (Date.now() - start > timeout) {
                clearInterval(interval);
                reject(new Error(errorMsg));
            }
        }, 100);
    });
}

async function createFormData(filePath) {
    const boundary = '----WebKitFormBoundaryCacheTest';
    const fileContent = fs.readFileSync(filePath);
    const filename = path.basename(filePath);

    const body = Buffer.concat([
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: text/plain\r\n\r\n`),
        fileContent,
        Buffer.from(`\r\n--${boundary}--\r\n`)
    ]);

    return {
        body,
        headers: {
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
            'Content-Length': body.length
        }
    };
}

runTest();
