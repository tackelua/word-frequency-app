const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

const PORT = 3005; // Use a different port for testing
const HOST = `http://localhost:${PORT}`;

// Sample text file content
const SAMPLE_TEXT = "The quick brown fox jumps over the lazy dog. Version: " + Date.now();
const TEST_FILE = path.join(__dirname, 'temp_test_file.txt');

async function runTest() {
    console.log('🚀 Starting Verification Test for Async Context Analysis');

    // Create test file
    fs.writeFileSync(TEST_FILE, SAMPLE_TEXT);

    // Start Server
    console.log('Starting server...');
    const serverProcess = spawn('node', ['server.js'], {
        cwd: path.resolve(__dirname, '..'),
        env: { ...process.env, PORT },
        stdio: 'pipe' // Capture output to debug
    });

    let serverReady = false;
    serverProcess.stdout.on('data', (data) => {
        const msg = data.toString();
        console.log(`[Server]: ${msg}`);
        if (msg.includes(`Server running at http://localhost:${PORT}`)) {
            serverReady = true;
        }
    });

    serverProcess.stderr.on('data', (data) => {
        console.error(`[Server Error]: ${data}`);
    });

    // Wait for server to start
    await waitForCondition(() => serverReady, 5000, 'Server failed to start');
    console.log('✅ Server started');

    try {
        // 1. Upload File
        console.log('📤 Uploading file...');
        const formData = await createFormData(TEST_FILE);
        const uploadRes = await fetchRequest(`${HOST}/api/upload`, {
            method: 'POST',
            body: formData.body,
            headers: formData.headers
        });

        if (uploadRes.status !== 200) {
            throw new Error(`Upload failed with status ${uploadRes.status}: ${JSON.stringify(uploadRes.data)}`);
        }

        const { fileId, fileName, analysis } = uploadRes.data;
        console.log(`✅ Upload successful. FileID: ${fileId}`);

        // Verify immediate response
        if (!analysis || analysis.context) {
            // Note: in my implementation, context might be empty array, but usually checks for undefined or empty
            // In immediate response, context IS present but empty array [].
            // Wait, I modified logic to skipContext: true, so analyzer returns `results` where item.context is [].
        }

        const dogResult = analysis.results.find(r => r.word === 'dog');
        if (!dogResult) throw new Error('Word "dog" not found in analysis');
        if (dogResult.context && dogResult.context.length > 0) {
            throw new Error('❌ Immediate response should NOT have context yet!');
        }
        console.log('✅ Immediate response confirmed (no context)');

        // 1.5 TRIGGER BATCH PROCESSING (New Requirement)
        console.log('🚀 Triggering batch processing...');
        const triggerRes = await fetchRequest(`${HOST}/api/analysis/process-batch`, {
            method: 'POST',
            body: JSON.stringify({ fileIds: [fileId] }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (triggerRes.status !== 200) {
            throw new Error(`Trigger failed: ${JSON.stringify(triggerRes.data)}`);
        }
        console.log('✅ Batch processing triggered');

        // 2. Poll for Status
        console.log('🔄 Polling for context...');
        let complete = false;
        let attempts = 0;

        while (!complete && attempts < 20) {
            await new Promise(r => setTimeout(r, 500)); // Wait 500ms
            const statusRes = await fetchRequest(`${HOST}/api/analysis/${fileId}`);

            // Log status for visibility
            console.log(`[Status Check]: ${statusRes.data.status}`);

            if (statusRes.data.status === 'complete') {
                complete = true;
                console.log('✅ Analysis status: complete');

                // Verify context exists
                const fullAnalysis = statusRes.data.analysis;
                const dogFull = fullAnalysis.results.find(r => r.word === 'dog');

                if (dogFull.context && dogFull.context.length > 0) {
                    console.log(`✅ Context found for "dog": "${dogFull.context[0]}"`);
                } else {
                    throw new Error('❌ Context was NOT extracted even after completion!');
                }

            } else if (statusRes.data.status === 'processing') {
                // Expected state
                process.stdout.write('.');
            } else {
                console.warn(`⚠️ Unexpected status: ${statusRes.data.status}`);
            }

            attempts++;
        }

        if (!complete) throw new Error('❌ Polling timed out');

    } catch (error) {
        console.error('❌ Test Failed:', error);
        process.exit(1);
    } finally {
        // Cleanup
        console.log('🧹 Cleaning up...');
        serverProcess.kill();
        if (fs.existsSync(TEST_FILE)) fs.unlinkSync(TEST_FILE);
        process.exit(0);
    }
}

// Helpers
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

function fetchRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const req = http.request(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        status: res.statusCode,
                        data: JSON.parse(data)
                    });
                } catch (e) {
                    resolve({ status: res.statusCode, data });
                }
            });
        });

        req.on('error', reject);

        if (options.body) {
            req.write(options.body);
        }
        req.end();
    });
}

async function createFormData(filePath) {
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
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
