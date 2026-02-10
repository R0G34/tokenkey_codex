#!/bin/bash

# Find all directories in the project (excluding specified directories)
folders=$(find . -type d -not -path "./.vscode/*" -not -path "./.next/*" -not -path "./node_modules/*" -not -path "./.git/*" -not -path "./.claude/*")

# Find all files in the project (excluding specified directories)
files=$(find . -type f -not -path "./.vscode/*" -not -path "./.next/*" -not -path "./node_modules/*" -not -path "./.git/*" -not -path "./public/external/*" -not -path "./.claude/*")

# Flag to track if any invalid names are found
has_error=0

# Check each folder name
for folder in $folders; do
  # Extract the basename of the folder
  folder_name=$(basename "$folder")
  
  # Check if the folder name contains any uppercase letters
  if [[ "$folder_name" =~ [A-Z] ]]; then
    echo "Error: Folder '$folder' contains capital letters. Folder names must be all lowercase."
    has_error=1
  fi
done

# Check each file name
for file in $files; do
  # Skip ./README.md and ./CLAUDE.md
  if [[ "$file" == "./README.md" || "$file" == "./CLAUDE.md" ]]; then
    continue
  fi

  # Extract the basename of the file
  file_name=$(basename "$file")

  # Check if the file name contains any uppercase letters
  if [[ "$file_name" =~ [A-Z] ]]; then
    echo "Error: File '$file' contains capital letters. File names must be all lowercase."
    has_error=1
  fi
done

# Exit with an error code if any invalid names were found
if [ $has_error -eq 1 ]; then
  echo ""  # Add an empty line before the exit
  exit 1
fi

exit 0