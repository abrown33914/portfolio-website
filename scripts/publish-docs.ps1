# Build and publish the production build into docs/ and push to origin/main
# Usage: In PowerShell run: .\scripts\publish-docs.ps1

Write-Host "Building production (npm run build)..."
$build = npm run build
if ($LASTEXITCODE -ne 0) {
  Write-Error "npm run build failed with exit code $LASTEXITCODE"
  exit $LASTEXITCODE
}

if (-not (Test-Path -Path "./dist")) {
  Write-Error "dist/ not found after build"
  exit 1
}

Write-Host "Replacing docs/ with dist/..."
# Preserve CNAME if present
$cnamePath = Join-Path -Path ".\docs" -ChildPath "CNAME"
$hasCname = Test-Path $cnamePath

# Remove existing docs files (keep docs directory)
Get-ChildItem -Path .\docs -Force -Recurse | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue

Copy-Item -Path .\dist\* -Destination .\docs -Recurse -Force

if ($hasCname) { Copy-Item -Path $cnamePath -Destination .\docs -Force }

Write-Host "Staging docs/ changes"
git add docs -A

# Try to commit; if there are no changes the commit will fail silently
try {
  git commit -m "chore(publish): update docs from dist [automated]" | Out-Null
} catch {
  Write-Host "No changes to commit or commit failed: $($_.Exception.Message)"
}

Write-Host "Pulling remote and pushing..."
git pull --rebase origin main
git push origin main

Write-Host "Publish script finished. Verify GitHub Pages after a minute or two."