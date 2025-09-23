# 🔍 VERIFICAR VARIÁVEIS DE AMBIENTE

## ✅ **ARQUIVO .env.local CONFIGURADO:**
```
VITE_FORM_SUBMIT_URL=https://igjmwawkepypqdyoljgl.supabase.co/functions/v1/submit-form
VITE_HCAPTCHA_SITEKEY=10000000-ffff-ffff-ffff-000000000001
```

## 🧪 **COMO TESTAR:**

### **1. Verificar no Console do Navegador:**
1. Acesse: http://localhost:8080
2. Abra o console (F12)
3. Digite no console:
```javascript
console.log('VITE_FORM_SUBMIT_URL:', import.meta.env.VITE_FORM_SUBMIT_URL);
console.log('VITE_HCAPTCHA_SITEKEY:', import.meta.env.VITE_HCAPTCHA_SITEKEY);
```

### **2. Resultados Esperados:**
- ✅ **Sucesso:** As variáveis aparecem com os valores corretos
- ❌ **Erro:** As variáveis aparecem como `undefined`

### **3. Se as variáveis não aparecerem:**

#### **Solução 1: Reiniciar o Vite**
1. Pare o processo (Ctrl+C)
2. Execute: `npm run dev`
3. Teste novamente

#### **Solução 2: Verificar arquivo .env.local**
1. Verifique se o arquivo existe na raiz do projeto
2. Verifique se não há espaços extras
3. Verifique se não há caracteres especiais

#### **Solução 3: Usar variáveis hardcoded temporariamente**
Edite o `PastorForm.tsx` e substitua:
```javascript
const submitUrl = import.meta.env.VITE_FORM_SUBMIT_URL as string | undefined;
```
Por:
```javascript
const submitUrl = "https://igjmwawkepypqdyoljgl.supabase.co/functions/v1/submit-form";
```

## 🎯 **RESULTADO:**
Após verificar as variáveis, o formulário deve funcionar corretamente!
