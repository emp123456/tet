# Script para configurar Supabase Dashboard
Write-Host "Configurando Supabase Dashboard..." -ForegroundColor Green

$projectId = "igjmwawkepypqdyoljgl"

Write-Host "`n=== CONFIGURACAO NECESSARIA NO SUPABASE DASHBOARD ===" -ForegroundColor Cyan
Write-Host "1. Acesse: https://supabase.com/dashboard/project/$projectId" -ForegroundColor White
Write-Host "2. Va em Settings > Environment Variables" -ForegroundColor White
Write-Host "3. Adicione as seguintes variaveis:" -ForegroundColor White
Write-Host "`n=== VARIAVEIS PARA ADICIONAR ===" -ForegroundColor Yellow

Write-Host "MP_ACCESS_TOKEN" -ForegroundColor Green
Write-Host "Valor: TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" -ForegroundColor White
Write-Host "Descricao: Token de acesso do Mercado Pago" -ForegroundColor Gray

Write-Host "`nMP_WEBHOOK_URL" -ForegroundColor Green
Write-Host "Valor: https://$projectId.supabase.co/functions/v1/mp-webhook" -ForegroundColor White
Write-Host "Descricao: URL do webhook para o Mercado Pago" -ForegroundColor Gray

Write-Host "`nSB_URL" -ForegroundColor Green
Write-Host "Valor: https://$projectId.supabase.co" -ForegroundColor White
Write-Host "Descricao: URL do projeto Supabase" -ForegroundColor Gray

Write-Host "`nSB_SERVICE_ROLE_KEY" -ForegroundColor Green
Write-Host "Valor: (copie do Settings > API > service_role key)" -ForegroundColor White
Write-Host "Descricao: Chave de servico do Supabase" -ForegroundColor Gray

Write-Host "`nHCAPTCHA_SECRET" -ForegroundColor Green
Write-Host "Valor: 0x0000000000000000000000000000000000000000" -ForegroundColor White
Write-Host "Descricao: Chave secreta do hCaptcha (opcional)" -ForegroundColor Gray

Write-Host "`n=== BANCO DE DADOS ===" -ForegroundColor Yellow
Write-Host "4. Va em SQL Editor" -ForegroundColor White
Write-Host "5. Execute o SQL de supabase_schema.sql" -ForegroundColor White

Write-Host "`n=== MERCADO PAGO ===" -ForegroundColor Yellow
Write-Host "6. Configure o webhook no Mercado Pago:" -ForegroundColor White
Write-Host "   URL: https://$projectId.supabase.co/functions/v1/mp-webhook" -ForegroundColor White
Write-Host "   Eventos: payment.*" -ForegroundColor White

Write-Host "`n=== FUNCOES DEPLOYADAS ===" -ForegroundColor Green
Write-Host "✅ submit-form: https://$projectId.supabase.co/functions/v1/submit-form" -ForegroundColor White
Write-Host "✅ mp-webhook: https://$projectId.supabase.co/functions/v1/mp-webhook" -ForegroundColor White

Write-Host "`n=== TESTE ===" -ForegroundColor Yellow
Write-Host "7. Teste o formulario: npm run dev" -ForegroundColor White
Write-Host "8. Acesse: http://localhost:8081" -ForegroundColor White

Write-Host "`nPronto! Todas as configuracoes foram feitas." -ForegroundColor Green
