# DIAGNÓSTICO DO FORMULÁRIO - PROBLEMAS IDENTIFICADOS

## 🔍 PROBLEMAS ENCONTRADOS

### 1. **VARIÁVEIS DE AMBIENTE NÃO CONFIGURADAS**
- ❌ `VITE_FORM_SUBMIT_URL` não está definida
- ❌ `VITE_HCAPTCHA_SITEKEY` não está configurada
- ❌ Arquivo `.env.local` não existe no projeto

### 2. **PROBLEMAS NO CÓDIGO DO FORMULÁRIO**

#### 2.1 **Validação de CNPJ Muito Restritiva**
```typescript
// Linha 25 em PastorForm.tsx
cnpj: z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "CNPJ inválido (formato: 12.345.678/0001-90)")
```
**Problema**: A regex é muito específica e não aceita CNPJs sem formatação.

#### 2.2 **Validação de CEP Muito Restritiva**
```typescript
// Linha 24 em PastorForm.tsx
cep: z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido (formato: 12345-678)")
```
**Problema**: Não aceita CEPs sem hífen.

#### 2.3 **Validação de Banco Muito Restritiva**
```typescript
// Linha 28 em PastorForm.tsx
banco_numero: z.string().regex(/^\d{3}$/, "Código do banco inválido (3 dígitos)")
```
**Problema**: Alguns bancos têm códigos com 1 ou 2 dígitos.

#### 2.4 **URLs de Retorno Hardcoded**
```typescript
// Linha 95 em submit-form/index.ts
back_urls: {
  success: "http://localhost:8080/success",
  failure: "http://localhost:8080/failure",
  pending: "http://localhost:8080/pending"
}
```
**Problema**: URLs fixas para localhost, não funcionam em produção.

### 3. **PROBLEMAS NO SUPABASE**

#### 3.1 **Falta de Política de Inserção**
```sql
-- supabase_schema.sql linha 25-35
-- Política de INSERT comentada, pode causar erro 403
```

#### 3.2 **Campos Obrigatórios no Schema**
```sql
-- Linha 8-19 em supabase_schema.sql
-- Todos os campos são NOT NULL, mas alguns podem ser opcionais
```

### 4. **PROBLEMAS NO hCAPTCHA**

#### 4.1 **Implementação Invisível Problemática**
```typescript
// Linha 240-260 em PastorForm.tsx
// Criação dinâmica de container pode falhar
```

## 🛠️ SOLUÇÕES IMPLEMENTADAS

### 1. **CRIAR ARQUIVO .env.local**
```bash
# Criar arquivo .env.local na raiz do projeto
VITE_FORM_SUBMIT_URL=https://[SEU-PROJETO].supabase.co/functions/v1/submit-form
VITE_HCAPTCHA_SITEKEY=10000000-ffff-ffff-ffff-000000000001
```

### 2. **CORRIGIR VALIDAÇÕES**

#### 2.1 **CNPJ Mais Flexível**
```typescript
cnpj: z.string()
  .min(14, "CNPJ deve ter pelo menos 14 dígitos")
  .regex(/^\d{2}[.\s]?\d{3}[.\s]?\d{3}[\/\s]?\d{4}[-\s]?\d{2}$/, "CNPJ inválido")
```

#### 2.2 **CEP Mais Flexível**
```typescript
cep: z.string()
  .min(8, "CEP deve ter pelo menos 8 dígitos")
  .regex(/^\d{5}[-\s]?\d{3}$/, "CEP inválido")
```

#### 2.3 **Código do Banco Mais Flexível**
```typescript
banco_numero: z.string()
  .min(1, "Código do banco é obrigatório")
  .regex(/^\d{1,3}$/, "Código do banco deve ter 1 a 3 dígitos")
```

### 3. **URLs DINÂMICAS**
```typescript
const baseUrl = window.location.origin;
back_urls: {
  success: `${baseUrl}/success`,
  failure: `${baseUrl}/failure`,
  pending: `${baseUrl}/pending`
}
```

### 4. **MELHORAR TRATAMENTO DE ERROS**
```typescript
// Adicionar logs detalhados
console.log("Enviando formulário:", data);
console.log("URL de envio:", submitUrl);
console.log("Token captcha:", token);
```

## 🚀 PASSOS PARA CORRIGIR

### 1. **Configurar Variáveis de Ambiente**
```bash
# Criar .env.local na raiz
echo "VITE_FORM_SUBMIT_URL=https://[SEU-PROJETO].supabase.co/functions/v1/submit-form" > .env.local
echo "VITE_HCAPTCHA_SITEKEY=10000000-ffff-ffff-ffff-000000000001" >> .env.local
```

### 2. **Deployar Funções do Supabase**
```bash
# No diretório supabase/
supabase functions deploy submit-form
supabase functions deploy check-payment-status
supabase functions deploy recover-payment
supabase functions deploy mp-webhook
```

### 3. **Configurar Banco de Dados**
```sql
-- Executar no Supabase SQL Editor
-- Verificar se a tabela existe e tem as políticas corretas
```

### 4. **Testar Formulário**
```bash
# Rodar projeto
npm run dev
# Acessar http://localhost:8080
# Preencher formulário e verificar console do navegador
```

## 🔧 CÓDIGO CORRIGIDO

### PastorForm.tsx - Validações Corrigidas
```typescript
const pastorFormSchema = z.object({
  nome_pastor: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  telefone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  email: z.string().email("Email inválido"),
  endereco: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
  cep: z.string()
    .min(8, "CEP deve ter pelo menos 8 dígitos")
    .regex(/^\d{5}[-\s]?\d{3}$/, "CEP inválido"),
  cnpj: z.string()
    .min(14, "CNPJ deve ter pelo menos 14 dígitos")
    .regex(/^\d{2}[.\s]?\d{3}[.\s]?\d{3}[\/\s]?\d{4}[-\s]?\d{2}$/, "CNPJ inválido"),
  numero_fieis: z.string().min(1, "Selecione o número de fiéis"),
  modelo_desejado: z.string().min(1, "Selecione um modelo"),
  banco: z.string().min(2, "Banco é obrigatório"),
  banco_numero: z.string()
    .min(1, "Código do banco é obrigatório")
    .regex(/^\d{1,3}$/, "Código do banco deve ter 1 a 3 dígitos"),
  agencia: z.string().min(3, "Agência inválida"),
  conta: z.string().min(3, "Conta inválida"),
  correntista_nome: z.string().min(2, "Nome do correntista é obrigatório"),
});
```

### submit-form/index.ts - URLs Dinâmicas
```typescript
const baseUrl = req.headers.get("origin") || "http://localhost:8080";
back_urls: {
  success: `${baseUrl}/success`,
  failure: `${baseUrl}/failure`,
  pending: `${baseUrl}/pending`
}
```

## 📋 CHECKLIST DE VERIFICAÇÃO

- [ ] Criar arquivo `.env.local` com as variáveis necessárias
- [ ] Deployar todas as funções do Supabase
- [ ] Configurar webhook do Mercado Pago
- [ ] Testar formulário com dados válidos
- [ ] Verificar logs no console do navegador
- [ ] Verificar logs no Supabase Dashboard
- [ ] Testar fluxo completo de pagamento

## 🆘 EM CASO DE ERRO

### Verificar Console do Navegador
```javascript
// Abrir DevTools (F12) e verificar:
// 1. Erros de rede (Network tab)
// 2. Erros de JavaScript (Console tab)
// 3. Se as variáveis de ambiente estão carregadas
console.log("VITE_FORM_SUBMIT_URL:", import.meta.env.VITE_FORM_SUBMIT_URL);
```

### Verificar Logs do Supabase
```bash
# No Supabase Dashboard > Functions > Logs
# Verificar se há erros nas funções
```

### Testar Função Manualmente
```bash
# Usar curl para testar a função
curl -X POST https://[SEU-PROJETO].supabase.co/functions/v1/submit-form \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 4c39d20289c028d8a119e86a1ad43e601eae5df962e57612a2f58b9ce2b5f7fb" \
  -d '{"nome_pastor":"Teste","telefone":"11999999999","email":"teste@teste.com",...}'
```
