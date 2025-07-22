// scripts/copy-dist.js
const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');

// Paths
const source = path.resolve(__dirname, '../dist');
const target = path.resolve(__dirname, '../../asp-net-core-server/wwwroot');

// Copy dist to wwwroot
fse.copy(source, target, { overwrite: true }, err => {
    if (err) return console.error('❌ Copy failed:', err);
    console.log('✅ Frontend build copied to wwwroot.');
});