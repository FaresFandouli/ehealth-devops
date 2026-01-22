# Script pour compiler tous les services
# Nom: compile-all-services.ps1

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Compilation de Tous les Services" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$services = @(
    "config-service",
    "discovery-service",
    "gateway-service",
    "auth-service",
    "clinic-service",
    "medical-service",
    "consultation-service"
)

$successCount = 0
$failCount = 0

foreach ($service in $services) {
    Write-Host ""
    Write-Host "Compilation de $service..." -ForegroundColor Yellow
    Write-Host "----------------------------------------" -ForegroundColor Gray
    
    $servicePath = Join-Path $PSScriptRoot $service
    
    if (Test-Path $servicePath) {
        Push-Location $servicePath
        
        # Compiler le service
        mvn clean install -DskipTests
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "OK $service compile avec succes" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "ERREUR lors de la compilation de $service" -ForegroundColor Red
            $failCount++
        }
        
        Pop-Location
    } else {
        Write-Host "ERREUR Dossier non trouve: $servicePath" -ForegroundColor Red
        $failCount++
    }
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Resume de la Compilation" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Reussis: $successCount" -ForegroundColor Green
Write-Host "Echoues: $failCount" -ForegroundColor Red
Write-Host ""

if ($failCount -eq 0) {
    Write-Host "Tous les services sont compiles!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Prochaine etape: Demarrez les services avec:" -ForegroundColor Yellow
    Write-Host "  .\start-all-microservices.ps1" -ForegroundColor White
} else {
    Write-Host "Certains services n'ont pas pu etre compiles." -ForegroundColor Red
    Write-Host "Verifiez les erreurs ci-dessus." -ForegroundColor Red
}
