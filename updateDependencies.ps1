# Path to the package.json file
$packageJsonPath = "package.json"

# Read the package.json file
$packageJson = Get-Content -Raw -Path $packageJsonPath | ConvertFrom-Json

# Extract dependencies
$dependencies = $packageJson.dependencies.PSObject.Properties.Name

# Loop through each dependency and update it
foreach ($dependency in $dependencies) {
    Write-Host "Updating $dependency to the latest version..."
    Start-Process -FilePath "npm" -ArgumentList "install $dependency@latest" -RedirectStandardOutput "npm-output.log" -NoNewWindow -Wait
}

Write-Host "All dependencies have been updated to their latest versions."