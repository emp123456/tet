# Script para configurar Supabase
Write-Host "Configurando Supabase..." -ForegroundColor Green

# Credenciais fornecidas
$projectId = "igjmwawkepypqdyoljgl"
$password = "Senha8080#$@"

Write-Host "Project ID: $projectId" -ForegroundColor Yellow
Write-Host "Password: $password" -ForegroundColor Yellow

Write-Host "`nConfiguracoes necessarias no Supabase Dashboard:" -ForegroundColor Cyan
Write-Host "1. Acesse: https://supabase.com/dashboard/project/$projectId" -ForegroundColor White
Write-Host "2. Va em Settings > Environment Variables" -ForegroundColor White
Write-Host "3. Adicione as seguintes variaveis:" -ForegroundColor White
Write-Host "   - MP_ACCESS_TOKEN=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" -ForegroundColor White
Write-Host "   - MP_WEBHOOK_URL=https://$projectId.supabase.co/functions/v1/mp-webhook" -ForegroundColor White
Write-Host "   - SB_URL=https://$projectId.supabase.co" -ForegroundColor White
Write-Host "   - SB_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -ForegroundColor White
Write-Host "   - HCAPTCHA_SECRET=0x0000000000000000000000000000000000000000" -ForegroundColor White

Write-Host "`n4. Execute o SQL no SQL Editor:" -ForegroundColor White
Write-Host "   - Copie o conteudo de supabase_schema.sql" -ForegroundColor White

Write-Host "`n5. Deploy das funcoes:" -ForegroundColor White
Write-Host "   cd supabase" -ForegroundColor White
Write-Host "   supabase functions deploy submit-form" -ForegroundColor White
Write-Host "   supabase functions deploy mp-webhook" -ForegroundColor White

Write-Host "`n6. Configure o webhook do Mercado Pago:" -ForegroundColor White
Write-Host "   - URL: https://$projectId.supabase.co/functions/v1/mp-webhook" -ForegroundColor White
Write-Host "   - Eventos: payment.*" -ForegroundColor White

Write-Host "`nPronto! Agora teste o formulario com: npm run dev" -ForegroundColor Green
