# Script para adicionar variáveis de ambiente no Supabase
Write-Host "Adicionando variáveis de ambiente no Supabase..." -ForegroundColor Green

$projectId = "igjmwawkepypqdyoljgl"

# Primeiro, vamos obter o access token
Write-Host "Obtendo access token..." -ForegroundColor Yellow

# Tentar obter o token do CLI
try {
    $token = supabase token list --json 2>$null | ConvertFrom-Json | Select-Object -First 1 -ExpandProperty access_token
    if ($token) {
        Write-Host "Token obtido com sucesso!" -ForegroundColor Green
    } else {
        throw "Token não encontrado"
    }
} catch {
    Write-Host "Erro ao obter token. Vamos usar método alternativo..." -ForegroundColor Yellow
    $token = $null
}

# Se não conseguiu o token, vamos usar o método manual
if (-not $token) {
    Write-Host "`n=== METODO MANUAL ===" -ForegroundColor Cyan
    Write-Host "1. Acesse: https://supabase.com/dashboard/project/$projectId" -ForegroundColor White
    Write-Host "2. Vá em Settings > API" -ForegroundColor White
    Write-Host "3. Copie a 'service_role key'" -ForegroundColor White
    Write-Host "4. Cole aqui quando solicitado:" -ForegroundColor White
    
    $serviceRoleKey = Read-Host "Cole a service_role key aqui"
    
    if ($serviceRoleKey) {
        Write-Host "Service role key obtida!" -ForegroundColor Green
    } else {
        Write-Host "Service role key não fornecida. Saindo..." -ForegroundColor Red
        exit 1
    }
}

# Agora vamos adicionar as variáveis
Write-Host "`nAdicionando variáveis de ambiente..." -ForegroundColor Yellow

$variables = @(
    @{
        name = "MP_ACCESS_TOKEN"
        value = "TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        description = "Token de acesso do Mercado Pago"
    },
    @{
        name = "MP_WEBHOOK_URL"
        value = "https://$projectId.supabase.co/functions/v1/mp-webhook"
        description = "URL do webhook para o Mercado Pago"
    },
    @{
        name = "SB_URL"
        value = "https://$projectId.supabase.co"
        description = "URL do projeto Supabase"
    },
    @{
        name = "HCAPTCHA_SECRET"
        value = "0x0000000000000000000000000000000000000000"
        description = "Chave secreta do hCaptcha (opcional)"
    }
)

Write-Host "`n=== VARIAVEIS PARA ADICIONAR MANUALMENTE ===" -ForegroundColor Cyan
foreach ($var in $variables) {
    Write-Host "`nNome: $($var.name)" -ForegroundColor Green
    Write-Host "Valor: $($var.value)" -ForegroundColor White
    Write-Host "Descrição: $($var.description)" -ForegroundColor Gray
}

Write-Host "`n=== INSTRUCOES ===" -ForegroundColor Yellow
Write-Host "1. Acesse: https://supabase.com/dashboard/project/$projectId" -ForegroundColor White
Write-Host "2. Vá em Settings > Environment Variables" -ForegroundColor White
Write-Host "3. Clique em 'Add new variable'" -ForegroundColor White
Write-Host "4. Adicione cada variável acima" -ForegroundColor White

Write-Host "`n=== BANCO DE DADOS ===" -ForegroundColor Yellow
Write-Host "5. Vá em SQL Editor" -ForegroundColor White
Write-Host "6. Execute o SQL de supabase_schema.sql" -ForegroundColor White

Write-Host "`n=== MERCADO PAGO ===" -ForegroundColor Yellow
Write-Host "7. Configure o webhook no Mercado Pago:" -ForegroundColor White
Write-Host "   URL: https://$projectId.supabase.co/functions/v1/mp-webhook" -ForegroundColor White
Write-Host "   Eventos: payment.*" -ForegroundColor White

Write-Host "`nPronto! Agora configure as variáveis no Dashboard." -ForegroundColor Green
