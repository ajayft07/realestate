param([ValidateRange(1, 65535)][int]$Port = 3000)

$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$env:PORT = "$Port"

$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCommand) {
    $nodePath = $nodeCommand.Source
} else {
    $bundledNode = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
    if (Test-Path -LiteralPath $bundledNode) {
        $nodePath = $bundledNode
    } else {
        throw 'Node.js was not found. Install Node.js 22.13 or newer, then reopen PowerShell.'
    }
}

if (Test-Path -LiteralPath '.env') {
    & $nodePath --env-file=.env .\server.mjs
} else {
    & $nodePath .\server.mjs
}
