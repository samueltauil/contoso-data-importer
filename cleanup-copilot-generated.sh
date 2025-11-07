#!/bin/bash

# Cleanup Script - Reset Repository to Original State (Bash Version)
# This script removes everything and restores original files from git
# Much simpler and more reliable than trying to preserve specific items

echo "Starting repository reset to original state..."
echo ""

# Check if we're in a git repository
if [[ ! -d ".git" ]]; then
    echo "[ERROR] Not in a git repository! Please run this script from the repository root."
    exit 1
fi

# Check git status
if ! git status &>/dev/null; then
    echo "[ERROR] Git command failed. Please ensure git is installed and this is a valid repository."
    exit 1
fi

# Get git status
git_status=$(git status --porcelain 2>/dev/null)

echo "Current repository will be reset to match the original git state."
echo ""
echo "This will:"
echo "  1. Remove ALL untracked files and directories"
echo "  2. Reset ALL modified files to their git state"
echo "  3. Preserve ONLY the cleanup scripts"
echo ""

# Show what will be affected
if [[ -n "$git_status" ]]; then
    echo "Files that will be affected:"
    while IFS= read -r line; do
        status="${line:0:2}"
        file="${line:3}"
        case "$status" in
            "??")
                echo "  [REMOVE UNTRACKED] $file"
                ;;
            *"M")
                echo "  [RESET MODIFIED] $file"
                ;;
            "M"*)
                echo "  [RESET STAGED] $file"
                ;;
            *)
                echo "  [RESET] $file"
                ;;
        esac
    done <<< "$git_status"
else
    echo "Repository is already clean - no changes detected."
fi

echo ""
read -p "Do you want to proceed with repository reset? (y/N): " confirmation

if [[ "$confirmation" == "y" || "$confirmation" == "Y" ]]; then
    echo ""
    echo "Starting repository reset..."
    
    # Create temporary backup of cleanup scripts
    temp_dir=$(mktemp -d)
    
    if [[ -f "cleanup-copilot-generated.ps1" ]]; then
        cp "cleanup-copilot-generated.ps1" "$temp_dir/"
        echo "  Backed up PowerShell cleanup script"
    fi
    
    if [[ -f "cleanup-copilot-generated.sh" ]]; then
        cp "cleanup-copilot-generated.sh" "$temp_dir/"
        echo "  Backed up Bash cleanup script"
    fi
    
    if [[ -f "cleanup-copilot-generated-simple.ps1" ]]; then
        cp "cleanup-copilot-generated-simple.ps1" "$temp_dir/"
        echo "  Backed up Simple PowerShell cleanup script"
    fi
    
    if [[ -f "cleanup-copilot-generated-simple.sh" ]]; then
        cp "cleanup-copilot-generated-simple.sh" "$temp_dir/"
        echo "  Backed up Simple Bash cleanup script"
    fi
    
    # Reset repository
    if git reset HEAD . &>/dev/null && \
       git checkout -- . &>/dev/null && \
       git clean -fd &>/dev/null; then
        
        echo "  Resetting staged changes..."
        echo "  Resetting modified files..."
        echo "  Removing untracked files..."
        
        # Restore cleanup scripts
        if [[ -f "$temp_dir/cleanup-copilot-generated.ps1" ]]; then
            cp "$temp_dir/cleanup-copilot-generated.ps1" .
            echo "  Restored PowerShell cleanup script"
        fi
        
        if [[ -f "$temp_dir/cleanup-copilot-generated.sh" ]]; then
            cp "$temp_dir/cleanup-copilot-generated.sh" .
            echo "  Restored Bash cleanup script"
        fi
        
        if [[ -f "$temp_dir/cleanup-copilot-generated-simple.ps1" ]]; then
            cp "$temp_dir/cleanup-copilot-generated-simple.ps1" .
            echo "  Restored Simple PowerShell cleanup script"
        fi
        
        if [[ -f "$temp_dir/cleanup-copilot-generated-simple.sh" ]]; then
            cp "$temp_dir/cleanup-copilot-generated-simple.sh" .
            echo "  Restored Simple Bash cleanup script"
        fi
        
        # Clean up temp directory
        rm -rf "$temp_dir"
        
        echo ""
        echo "Repository reset completed!"
        echo ""
        echo "Repository status after reset:"
        
        # Show final status
        remaining_count=0
        for item in .*/ */ .* *; do
            # Skip special directories
            if [[ "$item" == "./" || "$item" == "../" || "$item" == ".git/" || "$item" == ".git" ]]; then
                continue
            fi
            
            item_clean=$(echo "$item" | sed 's:/*$::')
            if [[ -e "$item_clean" ]]; then
                if [[ -d "$item_clean" ]]; then
                    echo "  [DIR] $item_clean/"
                else
                    echo "  [FILE] $item_clean"
                fi
                ((remaining_count++))
            fi
        done
        
        echo ""
        echo "Next steps:"
        echo "  1. Review the repository state above"
        echo "  2. The repository is now in its original clean state"
        echo "  3. You can run demos again from this clean baseline"
        
    else
        echo ""
        echo "[ERROR] Repository reset failed"
        
        # Try to restore cleanup scripts anyway
        if [[ -f "$temp_dir/cleanup-copilot-generated.ps1" ]]; then
            cp "$temp_dir/cleanup-copilot-generated.ps1" . 2>/dev/null
        fi
        if [[ -f "$temp_dir/cleanup-copilot-generated.sh" ]]; then
            cp "$temp_dir/cleanup-copilot-generated.sh" . 2>/dev/null
        fi
        if [[ -f "$temp_dir/cleanup-copilot-generated-simple.ps1" ]]; then
            cp "$temp_dir/cleanup-copilot-generated-simple.ps1" . 2>/dev/null
        fi
        if [[ -f "$temp_dir/cleanup-copilot-generated-simple.sh" ]]; then
            cp "$temp_dir/cleanup-copilot-generated-simple.sh" . 2>/dev/null
        fi
        
        rm -rf "$temp_dir"
        exit 1
    fi
    
else
    echo ""
    echo "Repository reset cancelled by user"
    echo "No changes were made."
fi

echo ""
echo "Script completed."