@echo off
echo 🔍 Verificando configuração do projeto...

echo.
echo 📋 Verificando arquivos de configuração:
if exist ".env.local" (
    echo ✅ Arquivo .env.local encontrado
) else (
    echo ❌ Arquivo .env.local não encontrado
    echo 💡 Execute: .\setup-env.ps1
)

echo.
echo 🔍 Verificando funções do Supabase:
if exist "supabase\functions\submit-form\index.ts" echo ✅ submit-form
if exist "supabase\functions\check-payment-status\index.ts" echo ✅ check-payment-status
if exist "supabase\functions\recover-payment\index.ts" echo ✅ recover-payment
if exist "supabase\functions\mp-webhook\index.ts" echo ✅ mp-webhook

echo.
echo 📦 Verificando dependências:
if exist "package.json" echo ✅ package.json encontrado
if exist "node_modules" echo ✅ node_modules encontrado

echo.
echo 📝 Próximos passos:
echo    1. Configure as variáveis no Supabase Dashboard
echo    2. Deploy das funções: supabase functions deploy
echo    3. Configure o webhook do Mercado Pago
echo    4. Teste o formulário: npm run dev

pause
