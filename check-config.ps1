# Script para verificar configuração
Write-Host "🔍 Verificando configuração do projeto..." -ForegroundColor Green

# Verificar se o arquivo .env.local existe
if (Test-Path ".env.local") {
    Write-Host "✅ Arquivo .env.local encontrado" -ForegroundColor Green
    
    # Ler e mostrar configurações
    $envContent = Get-Content ".env.local"
    Write-Host "📋 Configurações atuais:" -ForegroundColor Yellow
    foreach ($line in $envContent) {
        if ($line -match "^VITE_") {
            Write-Host "   $line" -ForegroundColor White
        }
    }
} else {
    Write-Host "❌ Arquivo .env.local não encontrado!" -ForegroundColor Red
    Write-Host "💡 Execute: .\setup-env.ps1" -ForegroundColor Yellow
}

# Verificar se as funções do Supabase existem
Write-Host "`n🔍 Verificando funções do Supabase..." -ForegroundColor Green
$functions = @("submit-form", "check-payment-status", "recover-payment", "mp-webhook")
foreach ($func in $functions) {
    $funcPath = "supabase\functions\$func\index.ts"
    if (Test-Path $funcPath) {
        Write-Host "✅ $func" -ForegroundColor Green
    } else {
        Write-Host "❌ $func" -ForegroundColor Red
    }
}

# Verificar dependências
Write-Host "`n🔍 Verificando dependências..." -ForegroundColor Green
if (Test-Path "package.json") {
    Write-Host "✅ package.json encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ package.json não encontrado" -ForegroundColor Red
}

# Verificar se node_modules existe
if (Test-Path "node_modules") {
    Write-Host "✅ node_modules encontrado" -ForegroundColor Green
} else {
    Write-Host "⚠️  node_modules não encontrado - execute: npm install" -ForegroundColor Yellow
}

Write-Host "`n📝 Checklist de configuração:" -ForegroundColor Yellow
Write-Host "   [ ] Configurar variáveis no Supabase Dashboard" -ForegroundColor White
Write-Host "   [ ] Deploy das funções: supabase functions deploy" -ForegroundColor White
Write-Host "   [ ] Configurar webhook do Mercado Pago" -ForegroundColor White
Write-Host "   [ ] Testar formulário: npm run dev" -ForegroundColor White
