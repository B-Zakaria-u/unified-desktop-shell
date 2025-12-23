const { execSync } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const CLIENT_REPO_ROOT = path.resolve(ROOT_DIR, '..'); // Assuming sibling folders

// Config
const APPS = [
    {
        name: 'shell',
        path: ROOT_DIR,
        dist: path.join(ROOT_DIR, 'dist'),
        buildCommand: 'npm run build'
    },
    {
        name: 'notebook',
        path: path.join(CLIENT_REPO_ROOT, 'course-rag-client'),
        dist: path.join(CLIENT_REPO_ROOT, 'course-rag-client', 'dist'),
        dest: path.join(ROOT_DIR, 'dist', 'apps', 'notebook'),
        buildCommand: 'npm run build'
    },
    {
        name: 'translation',
        path: path.join(CLIENT_REPO_ROOT, 'react-client'),
        dist: path.join(CLIENT_REPO_ROOT, 'react-client', 'dist'),
        dest: path.join(ROOT_DIR, 'dist', 'apps', 'translation'),
        buildCommand: 'npm run build'
    }
];

async function build() {
    console.log('🚀 Starting Unified Build Process...');

    // 1. Clean Dist
    console.log('🧹 Cleaning dist folder...');
    await fs.remove(path.join(ROOT_DIR, 'dist'));

    // 2. Build Each App
    for (const app of APPS) {
        console.log(`\n📦 Building ${app.name}...`);
        try {
            // Install deps if needed (optional, assuming they are installed)
            // execSync('npm install', { cwd: app.path, stdio: 'inherit' });

            execSync(app.buildCommand, { cwd: app.path, stdio: 'inherit' });

            if (app.name !== 'shell') {
                console.log(`   Moving ${app.name} to dist/apps/${app.name}...`);
                await fs.copy(app.dist, app.dest);
            }
        } catch (err) {
            console.error(`❌ Failed to build ${app.name}:`, err);
            process.exit(1);
        }
    }

    console.log('\n✅ Build Complete! Ready for Electron Packaging.');
}

build();
