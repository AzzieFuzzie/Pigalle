# PowerShell build script for Eleventy project
# This script avoids the Windows permission issues with the Eleventy Vite plugin

Write-Host "Starting build process..." -ForegroundColor Green

# Clean up previous build
Write-Host "Cleaning previous build..." -ForegroundColor Yellow
if (Test-Path ".11ty-vite") {
    Remove-Item ".11ty-vite" -Recurse -Force
}
if (Test-Path "_site") {
    Remove-Item "_site" -Recurse -Force
}

# Create directories
Write-Host "Creating build directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path ".11ty-vite" -Force | Out-Null
New-Item -ItemType Directory -Path "_site" -Force | Out-Null

# Run Eleventy build without Vite plugin
Write-Host "Building with Eleventy..." -ForegroundColor Yellow
try {
    & npx eleventy --config=.eleventy-build.js
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Eleventy build completed successfully!" -ForegroundColor Green
    } else {
        Write-Host "Eleventy build failed with exit code $LASTEXITCODE" -ForegroundColor Red
        exit $LASTEXITCODE
    }
} catch {
    Write-Host "Error running Eleventy: $_" -ForegroundColor Red
    exit 1
}

# Copy built assets to .11ty-vite directory if needed
Write-Host "Copying assets to Vite directory..." -ForegroundColor Yellow
if (Test-Path "_site") {
    Copy-Item "_site/*" ".11ty-vite/" -Recurse -Force
    Write-Host "Build completed successfully!" -ForegroundColor Green
} else {
    Write-Host "Build directory not found!" -ForegroundColor Red
    exit 1
}
