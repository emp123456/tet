# Script para configurar variáveis de ambiente
Write-Host "Configurando variáveis de ambiente..." -ForegroundColor Green

# Usar o project ID fornecido
$projectId = "igjmwawkepypqdyoljgl"

Write-Host "Usando project ID: $projectId" -ForegroundColor Yellow

# Criar conteúdo do arquivo .env.local
$envContent = @"
# Configurações do Frontend
VITE_FORM_SUBMIT_URL=https://$projectId.supabase.co/functions/v1/submit-form
VITE_HCAPTCHA_SITEKEY=10000000-ffff-ffff-ffff-000000000001

# IMPORTANTE: 
# 1. Configure as variáveis no Supabase Dashboard > Settings > Environment Variables
# 2. Deploy as funções: supabase functions deploy
# 3. Configure o webhook do Mercado Pago
"@

# Salvar arquivo .env.local
$envContent | Out-File -FilePath ".env.local" -Encoding UTF8

Write-Host "Arquivo .env.local criado com sucesso!" -ForegroundColor Green
Write-Host "Próximos passos:" -ForegroundColor Yellow
Write-Host "   1. Configure as variáveis no Supabase Dashboard" -ForegroundColor White
Write-Host "   2. Deploy as funções: supabase functions deploy" -ForegroundColor White
Write-Host "   3. Configure o webhook do Mercado Pago" -ForegroundColor White
Write-Host "   4. Teste o formulário: npm run dev" -ForegroundColor White
