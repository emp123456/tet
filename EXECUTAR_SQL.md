# 🗄️ EXECUTAR SQL NO SUPABASE

## ✅ **SQL CORRIGIDO:**
O arquivo `supabase_schema.sql` foi corrigido e está pronto para execução.

## 🛠️ **COMO EXECUTAR:**

### **1. Acesse o Supabase Dashboard:**
- URL: https://supabase.com/dashboard/project/igjmwawkepypqdyoljgl

### **2. Vá em SQL Editor:**
- Clique em "SQL Editor" no menu lateral

### **3. Execute o SQL:**
- Copie todo o conteúdo do arquivo `supabase_schema.sql`
- Cole no SQL Editor
- Clique em "Run" para executar

## 📋 **O QUE O SQL FAZ:**

### **Cria a tabela:**
- `igreja_cadastros` com todos os campos necessários
- Coluna `modelo_desejado` como NOT NULL
- Coluna `payment_details` como JSONB
- Timestamps automáticos

### **Configura segurança:**
- Habilita Row Level Security (RLS)
- Cria políticas para Edge Functions
- Permite inserção, leitura e atualização

## 🎯 **RESULTADO:**
Após executar o SQL, o formulário funcionará perfeitamente!

## 🧪 **TESTE APÓS EXECUTAR:**
1. Acesse: http://localhost:8080
2. Preencha o formulário
3. Clique em "IR PARA O PAGAMENTO"
4. Verifique os logs no console (F12)

**O SQL está corrigido e pronto para execução!** 🎉
