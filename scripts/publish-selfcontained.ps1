param(
	[ValidateSet('win-x64', 'win-x86')]
	[string]$RuntimeIdentifier = 'win-x64'
)

Set-Location "$PSScriptRoot\.."

$outputFolder = "publish-selfcontained-$RuntimeIdentifier"

# Self-contained publish for shared Windows hosts without requiring installed .NET runtime.
dotnet publish .\server\SantaRoad.Api\SantaRoad.Api.csproj -c Release -r $RuntimeIdentifier --self-contained true -o (".\\artifacts\\" + $outputFolder)

$publishDir = Join-Path (Get-Location) ("artifacts\\" + $outputFolder)
$webConfig = Join-Path $publishDir "web.config"
$logsDir = Join-Path $publishDir "logs"

if (-not (Test-Path $logsDir)) {
	New-Item -ItemType Directory -Path $logsDir | Out-Null
}

if (Test-Path $webConfig) {
	$content = Get-Content -Raw -Path $webConfig
	$content = $content -replace 'stdoutLogEnabled="false"', 'stdoutLogEnabled="true"'
	Set-Content -Path $webConfig -Value $content -Encoding UTF8
}
