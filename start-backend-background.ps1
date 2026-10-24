$ErrorActionPreference = 'Stop'
$projectRoot = $PSScriptRoot
$port = 3000
$healthUrl = "http://127.0.0.1:$port/api/health"

function Test-BackendHealth {
  try {
    $result = Invoke-RestMethod -Uri $healthUrl -TimeoutSec 2
    return $result.status -eq 'ok'
  } catch {
    return $false
  }
}

if (Test-BackendHealth) {
  Write-Host "Elite Estates backend is already running at http://127.0.0.1:$port"
  exit 0
}

$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCommand) {
  $nodePath = $nodeCommand.Source
} else {
  $bundledNode = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
  if (-not (Test-Path -LiteralPath $bundledNode)) {
    throw 'Node.js was not found. Install Node.js 22.13 or newer, then reopen VS Code.'
  }
  $nodePath = $bundledNode
}

$dataPath = Join-Path $projectRoot 'data'
New-Item -ItemType Directory -Path $dataPath -Force | Out-Null
$stdoutPath = Join-Path $dataPath 'backend.log'
$stderrPath = Join-Path $dataPath 'backend-error.log'
$arguments = @()
if (Test-Path -LiteralPath (Join-Path $projectRoot '.env')) {
  $arguments += '--env-file=.env'
}
$arguments += '.\server.mjs'

Start-Process -FilePath $nodePath -ArgumentList $arguments -WorkingDirectory $projectRoot -WindowStyle Hidden -RedirectStandardOutput $stdoutPath -RedirectStandardError $stderrPath | Out-Null

for ($attempt = 0; $attempt -lt 16; $attempt++) {
  Start-Sleep -Milliseconds 500
  if (Test-BackendHealth) {
    Write-Host "Elite Estates backend is running at http://127.0.0.1:$port"
    Write-Host 'It will stay running after this window closes. Keep Live Server running for the website pages.'
    exit 0
  }
}

Write-Error "The backend did not start. Check $stderrPath for details."
exit 1
