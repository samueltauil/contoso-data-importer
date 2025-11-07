# Cleanup Script - Reset Repository to Original State
# This script removes everything and restores original files from git
# Much simpler and more reliable than trying to preserve specific items

Write-Host "Starting repository reset to original state..." -ForegroundColor Cyan
Write-Host ""

# Get the current directory
$repoRoot = Get-Location

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "[ERROR] Not in a git repository! Please run this script from the repository root." -ForegroundColor Red
    exit 1
}

# Check git status
$gitStatus = git status --porcelain 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Git command failed. Please ensure git is installed and this is a valid repository." -ForegroundColor Red
    exit 1
}

Write-Host "Current repository will be reset to match the original git state." -ForegroundColor Yellow
Write-Host ""
Write-Host "This will:" -ForegroundColor Yellow
Write-Host "  1. Remove ALL untracked files and directories" -ForegroundColor Red
Write-Host "  2. Reset ALL modified files to their git state" -ForegroundColor Red
Write-Host "  3. Preserve ONLY the cleanup scripts" -ForegroundColor Green
Write-Host ""

# Show what will be affected
if ($gitStatus) {
    Write-Host "Files that will be affected:" -ForegroundColor Yellow
    $gitStatus | ForEach-Object {
        $status = $_.Substring(0,2)
        $file = $_.Substring(3)
        if ($status -match "^\?\?") {
            Write-Host "  [REMOVE UNTRACKED] $file" -ForegroundColor Red
        } elseif ($status -match "^.M") {
            Write-Host "  [RESET MODIFIED] $file" -ForegroundColor Yellow
        } elseif ($status -match "^M.") {
            Write-Host "  [RESET STAGED] $file" -ForegroundColor Yellow
        } else {
            Write-Host "  [RESET] $file" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "Repository is already clean - no changes detected." -ForegroundColor Green
}

Write-Host ""
$confirmation = Read-Host "Do you want to proceed with repository reset? (y/N)"

if ($confirmation -eq 'y' -or $confirmation -eq 'Y') {
    Write-Host ""
    Write-Host "Starting repository reset..." -ForegroundColor Yellow
    
    # Create temporary backup of cleanup scripts
    $tempDir = [System.IO.Path]::GetTempPath() + [System.Guid]::NewGuid().ToString()
    New-Item -ItemType Directory -Path $tempDir | Out-Null
    
    if (Test-Path "cleanup-copilot-generated.ps1") {
        Copy-Item "cleanup-copilot-generated.ps1" "$tempDir\" -Force
        Write-Host "  Backed up PowerShell cleanup script" -ForegroundColor Green
    }
    
    if (Test-Path "cleanup-copilot-generated.sh") {
        Copy-Item "cleanup-copilot-generated.sh" "$tempDir\" -Force
        Write-Host "  Backed up Bash cleanup script" -ForegroundColor Green
    }
    
    try {
        # Reset any staged changes
        Write-Host "  Resetting staged changes..." -ForegroundColor Yellow
        git reset HEAD . 2>$null
        
        # Reset modified files to their git state
        Write-Host "  Resetting modified files..." -ForegroundColor Yellow
        git checkout -- . 2>$null
        
        # Remove all untracked files and directories (but keep .git)
        Write-Host "  Removing untracked files..." -ForegroundColor Yellow
        git clean -fd 2>$null
        
        # Restore cleanup scripts
        if (Test-Path "$tempDir\cleanup-copilot-generated.ps1") {
            Copy-Item "$tempDir\cleanup-copilot-generated.ps1" "." -Force
            Write-Host "  Restored PowerShell cleanup script" -ForegroundColor Green
        }
        
        if (Test-Path "$tempDir\cleanup-copilot-generated.sh") {
            Copy-Item "$tempDir\cleanup-copilot-generated.sh" "." -Force
            Write-Host "  Restored Bash cleanup script" -ForegroundColor Green
        }
        
        # Clean up temp directory
        Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue
        
        Write-Host ""
        Write-Host "Repository reset completed!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Repository status after reset:" -ForegroundColor Cyan
        
        # Show final status
        $finalItems = Get-ChildItem -Force | Where-Object { $_.Name -ne ".git" }
        foreach ($item in $finalItems) {
            if ($item.PSIsContainer) {
                Write-Host "  [DIR] $($item.Name)/" -ForegroundColor Blue
            } else {
                Write-Host "  [FILE] $($item.Name)" -ForegroundColor White
            }
        }
        
    } catch {
        Write-Host ""
        Write-Host "[ERROR] Repository reset failed: $($_.Exception.Message)" -ForegroundColor Red
        
        # Try to restore cleanup scripts anyway
        if (Test-Path "$tempDir\cleanup-copilot-generated.ps1") {
            Copy-Item "$tempDir\cleanup-copilot-generated.ps1" "." -Force -ErrorAction SilentlyContinue
        }
        if (Test-Path "$tempDir\cleanup-copilot-generated.sh") {
            Copy-Item "$tempDir\cleanup-copilot-generated.sh" "." -Force -ErrorAction SilentlyContinue
        }
        
        Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue
        exit 1
    }
    
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Magenta
    Write-Host "  1. Review the repository state above" -ForegroundColor White
    Write-Host "  2. The repository is now in its original clean state" -ForegroundColor White
    Write-Host "  3. You can run demos again from this clean baseline" -ForegroundColor White
    
} else {
    Write-Host ""
    Write-Host "Repository reset cancelled by user" -ForegroundColor Yellow
    Write-Host "No changes were made." -ForegroundColor White
}

Write-Host ""
Write-Host "Script completed." -ForegroundColor Cyan