# 🚀 SOLUÇÃO PARA O PROBLEMA DO FORMULÁRIO

## ❌ PROBLEMA IDENTIFICADO
O formulário está dando erro de envio devido a configurações ausentes e validações muito restritivas.

## ✅ SOLUÇÕES IMPLEMENTADAS

### 1. **Validações Corrigidas**
- ✅ CNPJ: Agora aceita formatos com ou sem pontuação
- ✅ CEP: Aceita com ou sem hífen
- ✅ Código do banco: Aceita 1 a 3 dígitos
- ✅ Logs de debug adicionados

### 2. **URLs Dinâmicas**
- ✅ URLs de retorno agora usam o origin da requisição
- ✅ Funciona tanto em desenvolvimento quanto produção

### 3. **Scripts de Configuração**
- ✅ `setup-env.ps1` - Configura variáveis de ambiente
- ✅ `check-config.ps1` - Verifica se tudo está configurado

## 🛠️ COMO RESOLVER AGORA

### Passo 1: Configurar Variáveis de Ambiente
```powershell
# Execute o script de configuração
.\setup-env.ps1
```

### Passo 2: Verificar Configuração
```powershell
# Verifique se tudo está correto
.\check-config.ps1
```

### Passo 3: Configurar Supabase
1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em **Settings > Environment Variables**
3. Adicione as seguintes variáveis:

```bash
# Mercado Pago
MP_ACCESS_TOKEN=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
MP_WEBHOOK_URL=https://[SEU-PROJETO].supabase.co/functions/v1/mp-webhook

# Supabase
SB_URL=https://[SEU-PROJETO].supabase.co
SB_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# hCaptcha (opcional)
HCAPTCHA_SECRET=0x0000000000000000000000000000000000000000
```

### Passo 4: Deploy das Funções
```bash
# No diretório do projeto
cd supabase
supabase functions deploy submit-form
supabase functions deploy check-payment-status
supabase functions deploy recover-payment
supabase functions deploy mp-webhook
```

### Passo 5: Configurar Banco de Dados
1. No Supabase Dashboard, vá em **SQL Editor**
2. Execute o script `supabase_schema.sql`
3. Verifique se a tabela `igreja_cadastros` foi criada

### Passo 6: Configurar Mercado Pago
1. Acesse o [Mercado Pago Developers](https://www.mercadopago.com/developers)
2. Configure o webhook com a URL: `https://[SEU-PROJETO].supabase.co/functions/v1/mp-webhook`
3. Selecione todos os eventos de `payment.*`

### Passo 7: Testar
```bash
# Rodar o projeto
npm run dev

# Acessar http://localhost:8080
# Preencher o formulário e verificar o console (F12)
```

## 🔍 DEBUG E LOGS

### Console do Navegador
Abra o DevTools (F12) e verifique:
- **Console tab**: Logs de debug com 🔍
- **Network tab**: Requisições para o Supabase
- **Erros**: Mensagens de erro específicas

### Logs do Supabase
1. No Supabase Dashboard > **Functions > Logs**
2. Verifique se há erros nas funções
3. Teste manualmente com curl:

```bash
curl -X POST https://[SEU-PROJETO].supabase.co/functions/v1/submit-form \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 4c39d20289c028d8a119e86a1ad43e601eae5df962e57612a2f58b9ce2b5f7fb" \
  -d '{
    "nome_pastor": "João Silva",
    "telefone": "11999999999",
    "email": "teste@teste.com",
    "endereco": "Rua Teste, 123",
    "cep": "12345-678",
    "cnpj": "12.345.678/0001-90",
    "numero_fieis": "Até 50",
    "modelo_desejado": "Modelo A - (Promoção) R$169,00/mês (40 conexões simultaneas)",
    "banco": "Itaú",
    "banco_numero": "341",
    "agencia": "1234",
    "conta": "12345-6",
    "correntista_nome": "João Silva"
  }'
```

## 🆘 PROBLEMAS COMUNS

### 1. **"VITE_FORM_SUBMIT_URL não configurada"**
**Solução**: Execute `.\setup-env.ps1` e configure o arquivo `.env.local`

### 2. **Erro 403 no Supabase**
**Solução**: Verifique se as políticas de RLS estão configuradas corretamente

### 3. **Erro de CORS**
**Solução**: Verifique se o domínio está na lista de CORS do Supabase

### 4. **hCaptcha não funciona**
**Solução**: Configure as chaves do hCaptcha ou remova temporariamente

### 5. **Mercado Pago não redireciona**
**Solução**: Verifique se as URLs de retorno estão corretas

## 📞 SUPORTE

Se ainda houver problemas:
1. Verifique os logs no console do navegador
2. Verifique os logs no Supabase Dashboard
3. Teste com dados simples primeiro
4. Verifique se todas as variáveis estão configuradas

## ✅ CHECKLIST FINAL

- [ ] Arquivo `.env.local` criado
- [ ] Variáveis configuradas no Supabase
- [ ] Funções deployadas
- [ ] Banco de dados configurado
- [ ] Webhook do Mercado Pago configurado
- [ ] Formulário testado com sucesso
- [ ] Pagamento funcionando
- [ ] Redirecionamentos funcionando
