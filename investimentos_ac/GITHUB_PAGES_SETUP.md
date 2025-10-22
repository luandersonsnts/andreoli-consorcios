# Como Configurar o Site no GitHub Pages

Este guia vai te ajudar a publicar seu site da FIRME INVESTIMENTOS no GitHub Pages.

## O que você precisa saber

O GitHub Pages só funciona com sites estáticos (apenas HTML, CSS e JavaScript). Por isso, fizemos algumas adaptações:

- ✅ **Todas as simulações funcionam normalmente** - os cálculos são feitos no navegador
- ✅ **Formulários redirecionam para WhatsApp** - quando alguém preenche um formulário, é aberto o WhatsApp com os dados já preenchidos
- ✅ **O site visual continua igual** - nada muda na aparência
- ❌ **Painel admin não funciona** - o painel de administração precisa de banco de dados, que o GitHub Pages não tem

## Passo a Passo

### 1. Configurar o Repositório

No seu repositório do GitHub, vá em **Settings** (Configurações):

1. No menu lateral esquerdo, clique em **Pages**
2. Em **Source** (Fonte), selecione: **GitHub Actions**

### 2. O Deploy Automático

Pronto! O arquivo `.github/workflows/deploy.yml` já está configurado no seu repositório.

**Toda vez que você fizer um push para a branch `main`, o site será automaticamente publicado!**

### 3. Acessar o Site

Depois do primeiro deploy (leva cerca de 2-5 minutos), seu site estará disponível em:

```
https://SEU-USUARIO.github.io/SEU-REPOSITORIO/
```

Por exemplo:
- Se seu usuário é `joao` e o repositório é `firme-investimentos`
- O site ficará em: `https://joao.github.io/firme-investimentos/`

### 4. Verificar o Status do Deploy

1. Vá na aba **Actions** do seu repositório
2. Você verá a lista de deploys
3. Um círculo verde ✓ significa que deu certo
4. Um círculo vermelho ✗ significa que deu erro

## Como Funciona Agora

### Simulação de Investimentos
Quando alguém preencher o formulário e clicar em "Criar Minha Projeção":
1. O cálculo é feito no navegador
2. Abre automaticamente o WhatsApp com os dados da simulação
3. A pessoa continua a conversa direto com você no WhatsApp (87) 98162-0542

### Simulação de Consórcio
Mesma coisa! Calcula tudo no navegador e redireciona para o WhatsApp com a proposta detalhada.

### Formulário de Reclamações/Sugestões
Abre o WhatsApp com a mensagem já formatada para você.

## Perguntas Frequentes

### Posso usar meu próprio domínio?
Sim! No GitHub Pages, em **Settings > Pages > Custom domain**, você pode adicionar seu domínio personalizado.

### Os dados são salvos em algum lugar?
No GitHub Pages, não. Tudo vai direto para o WhatsApp. Se quiser salvar os dados, precisa usar o Replit ou outro serviço que tenha banco de dados.

### Posso ter as duas versões?
Sim! Você pode:
- Manter o site no Replit com banco de dados e painel admin
- Publicar no GitHub Pages para ter uma URL pública gratuita
- Ambos funcionarão independentemente

### Como atualizar o site?
É só fazer as mudanças aqui no Replit e dar push para o GitHub. O deploy é automático!

## Testando Localmente

Se quiser testar como vai ficar no GitHub Pages antes de publicar:

```bash
VITE_STATIC_SITE=true npx vite build --config vite.config.static.ts
npx vite preview
```

## Suporte

Se tiver algum problema:
1. Verifique a aba **Actions** no GitHub para ver os logs de erro
2. Certifique-se de que o arquivo `.github/workflows/deploy.yml` está na branch main
3. Verifique se o GitHub Pages está habilitado nas configurações do repositório
