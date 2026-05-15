param(
  [Parameter(Mandatory = $true)]
  [string]$RemoteUrl,
  [string]$Branch = "main"
)

$ErrorActionPreference = "Stop"

Write-Host "Checking git repository..."
git rev-parse --is-inside-work-tree | Out-Null

$currentBranch = (git branch --show-current).Trim()
if ([string]::IsNullOrWhiteSpace($currentBranch)) {
  throw "Could not determine current branch."
}

if ($currentBranch -ne $Branch) {
  Write-Host "Switching to branch '$Branch'..."
  git checkout -B $Branch | Out-Null
}

$originExists = git remote | Select-String -Pattern "^origin$" -Quiet
if ($originExists) {
  Write-Host "Updating existing 'origin' remote..."
  git remote set-url origin $RemoteUrl
} else {
  Write-Host "Adding 'origin' remote..."
  git remote add origin $RemoteUrl
}

Write-Host "Pushing '$Branch' to origin..."
git push -u origin $Branch

Write-Host "Done. Repository connected to GitHub."
