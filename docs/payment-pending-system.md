# Sistema de Pagamento Pendente

## 🎯 Visão Geral

Este sistema detecta automaticamente quando um cliente inicia um pagamento mas não o finaliza, oferecendo uma experiência completa de recuperação.

## 🔄 Fluxo Completo

### 1. Cliente Preenche Formulário
- Cliente preenche dados no formulário
- Sistema salva email no `localStorage`
- Cliente é redirecionado para Mercado Pago

### 2. Cliente Fecha Checkout (Pagamento Pendente)
- Cliente fecha o checkout sem finalizar
- Mercado Pago redireciona para `/pending` ou `/failure`
- Sistema detecta automaticamente o status pendente
- Mostra página de pagamento pendente

### 3. Cliente Volta ao Site
- Sistema verifica `localStorage` e detecta pagamento pendente
- Mostra automaticamente a página de recuperação
- Cliente pode continuar pagamento ou desistir

### 4. Lembrete por Email (24h)
- Sistema verifica pagamentos pendentes há mais de 24h
- Envia email de lembrete automaticamente
- Email contém link direto para finalizar pagamento

## 📁 Arquivos do Sistema

### Edge Functions
- `submit-form`: Processa formulário e cria pagamento
- `recover-payment`: Recupera pagamento pendente
- `mp-webhook`: Recebe notificações do Mercado Pago
- `check-payment-status`: Verifica status do pagamento
- `send-reminder-email`: Envia email de lembrete

### Páginas Frontend
- `/`: Formulário principal
- `/success`: Pagamento aprovado
- `/failure`: Pagamento rejeitado/cancelado
- `/pending`: Pagamento pendente

### Componentes
- `PastorForm.tsx`: Detecta automaticamente pagamentos pendentes

## 🗄️ Banco de Dados

### Tabela: `email_reminders`
```sql
CREATE TABLE email_reminders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    type TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    record_id UUID REFERENCES igreja_cadastros(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔧 Configuração

### 1. Deploy das Funções
```powershell
.\scripts\complete-setup.ps1
```

### 2. Criar Tabela de Lembretes
Execute o SQL fornecido no Supabase Dashboard.

### 3. Configurar Email (Opcional)
- `EMAIL_SERVICE_URL`: URL do serviço de email
- `EMAIL_API_KEY`: Chave da API do serviço

## 🎨 Interface do Usuário

### Página de Pagamento Pendente
- **Título**: "Pagamento Pendente"
- **Descrição**: "Você iniciou o pagamento mas não o finalizou"
- **Botões**:
  - "CONTINUAR PAGAMENTO" (verde)
  - "Verificar Status"
  - "Fazer Novo Pedido"
  - "Voltar ao Início"

### Detecção Automática
- Sistema verifica `localStorage` ao carregar página
- Se encontrar pagamento pendente, mostra automaticamente
- Limpa dados quando pagamento é finalizado

## 📧 Sistema de Email

### Email de Lembrete (24h)
- **Assunto**: "Seu pagamento está aguardando! 💳"
- **Conteúdo**:
  - Saudação personalizada
  - Detalhes do pedido
  - Botão "FINALIZAR PAGAMENTO"
  - Link direto para recuperação

### Controle de Envio
- Verifica se email já foi enviado
- Evita spam de lembretes
- Registra envio na tabela `email_reminders`

## 🔄 Estados do Pagamento

### Pending
- Cliente iniciou mas não finalizou
- Mostra página de recuperação
- Envia lembrete após 24h

### Paid
- Pagamento aprovado
- Limpa dados pendentes
- Redireciona para `/success`

### Rejected/Cancelled
- Pagamento rejeitado
- Mostra página de falha
- Permite novo pedido

## 🚀 Como Testar

### 1. Fluxo Normal
1. Preencha formulário
2. Vá para Mercado Pago
3. Feche o checkout
4. Volte ao site
5. Veja página pendente

### 2. Teste de Recuperação
1. Clique em "CONTINUAR PAGAMENTO"
2. Complete o pagamento
3. Veja redirecionamento para sucesso

### 3. Teste de Desistência
1. Clique em "Fazer Novo Pedido"
2. Veja formulário limpo
3. Dados pendentes são removidos

## 🛠️ Manutenção

### Logs
- Todas as funções registram logs
- Verificar Supabase Dashboard > Edge Functions > Logs

### Monitoramento
- Verificar tabela `email_reminders`
- Monitorar webhooks do Mercado Pago
- Verificar status de pagamentos pendentes

## 🔒 Segurança

- Validação de email em todas as funções
- Controle de rate limiting
- Verificação de autenticidade dos webhooks
- Sanitização de dados de entrada

## 📞 Suporte

Para problemas:
1. Verificar logs das Edge Functions
2. Confirmar configuração do Mercado Pago
3. Testar URLs de retorno
4. Verificar variáveis de ambiente
