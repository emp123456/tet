# Relatório de Auditoria de Segurança

## Resumo Executivo

- Removido uso direto do Supabase no cliente para envio de formulário.
- Removida política RLS permissiva para `anon` e adicionado guia para uso de claims.
- Sugerido backend/Edge Function para receber dados e aplicar antiautomação.

## Vulnerabilidades e Correções

### Críticas
- Coleta de PII pelo cliente com inserção direta no banco.
  - Correção: envio agora direcionado a `VITE_FORM_SUBMIT_URL` (backend necessário).
- RLS permissiva (`anon` insert).
  - Correção: política removida e comentado exemplo seguro por claims JWT.

### Altas
- Exposição de `anon key` (por design, mas arriscado com RLS aberta).
  - Mitigação: remover uso no cliente para operações sensíveis.

### Médias
- Mensagens de erro detalhadas no cliente.
  - Correção: mensagem genérica no `toast`.

### Baixas
- Cabeçalhos de segurança ausentes (ajustar no hosting).

## Checklist de Correções

- [ ] Implementar backend/Edge Function para `VITE_FORM_SUBMIT_URL` com:
  - [ ] hCaptcha/reCAPTCHA e rate limiting
  - [ ] Validação/normalização de dados
  - [ ] Criptografia de campos sensíveis no banco (pgcrypto/KMS)
  - [ ] Logging de auditoria sem vazar PII
- [ ] Atualizar RLS para permitir apenas inserts verificados via claim JWT
- [ ] Configurar CSP e cabeçalhos de segurança no hosting

## Referências

- OWASP Top 10, ASVS 2.x/3.x/9.x
- Supabase RLS Best Practices

