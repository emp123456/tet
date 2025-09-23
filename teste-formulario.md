# 🧪 TESTE DO FORMULÁRIO - PORTA 8080

## 🔍 **DIAGNÓSTICO DE PROBLEMAS:**

### 1. **Verificar se o projeto está rodando:**
- ✅ Projeto rodando em: http://localhost:8080
- ✅ Vite iniciado com sucesso

### 2. **Testar o formulário:**
1. **Acesse:** http://localhost:8080
2. **Abra o console (F12)**
3. **Preencha o formulário com dados de teste:**
   - Nome: Teste Pastor
   - Telefone: 11999999999
   - Email: teste@igreja.com
   - Endereço: Rua Teste, 123
   - CEP: 01234-567
   - CNPJ: 12.345.678/0001-90
   - Número de fiéis: 100-500
   - Modelo: Modelo A
   - Banco: Banco Teste
   - Código: 001
   - Agência: 1234
   - Conta: 12345-6
   - Correntista: Teste Pastor

### 3. **Verificar logs no console:**
- 🔍 DEBUG - URL de envio: https://igjmwawkepypqdyoljgl.supabase.co/functions/v1/submit-form
- 🔍 DEBUG - Dados do formulário: {...}
- 🔍 DEBUG - Token captcha: (opcional)
- 🔍 DEBUG - Status da resposta: 200
- 🔍 DEBUG - Resultado da resposta: {ok: true, paymentUrl: '...'}

### 4. **Possíveis problemas:**

#### ❌ **Erro 500 - Banco não configurado:**
- **Sintoma:** Erro 500 no console
- **Solução:** Execute o SQL no Supabase Dashboard

#### ❌ **Erro 400 - Dados inválidos:**
- **Sintoma:** Erro 400 no console
- **Solução:** Verifique se todos os campos estão preenchidos

#### ❌ **Erro de rede - Função não encontrada:**
- **Sintoma:** Erro de rede no console
- **Solução:** Verifique se as funções foram deployadas

#### ❌ **Erro de CORS:**
- **Sintoma:** Erro de CORS no console
- **Solução:** Verifique se as variáveis estão configuradas

### 5. **Comandos para verificar:**

```bash
# Verificar funções
supabase functions list --project-ref igjmwawkepypqdyoljgl

# Verificar variáveis
supabase secrets list --project-ref igjmwawkepypqdyoljgl

# Verificar logs
supabase functions logs submit-form --project-ref igjmwawkepypqdyoljgl
```

### 6. **Configuração manual necessária:**

#### **Banco de Dados:**
1. Acesse: https://supabase.com/dashboard/project/igjmwawkepypqdyoljgl
2. Vá em SQL Editor
3. Execute o SQL de `supabase_schema.sql`

#### **Mercado Pago:**
1. Configure o webhook:
   - URL: `https://igjmwawkepypqdyoljgl.supabase.co/functions/v1/mp-webhook`
   - Eventos: `payment.*`

## 🎯 **RESULTADO ESPERADO:**
- Formulário envia dados com sucesso
- Redirecionamento para Mercado Pago
- Logs de debug no console
- Sem erros vermelhos
