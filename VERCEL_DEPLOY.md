# 🚀 Deploy no Vercel - Andreoli Consórcios

## ✅ Configuração Completa

O projeto está **100% configurado** para deploy no Vercel! Todos os arquivos necessários foram criados.

## 📋 Passo a Passo para Deploy

### 1. **Acesse o Vercel**
- Vá para: [vercel.com](https://vercel.com)
- Clique em **"Sign Up"** ou **"Login"**
- **Conecte com sua conta do GitHub**

### 2. **Novo Projeto**
- Clique em **"New Project"**
- **Importe seu repositório** do GitHub
- Selecione o repositório `andreoli-consorcios`

### 3. **Configuração Automática**
O Vercel detectará automaticamente:
- ✅ **Framework**: Vite
- ✅ **Build Command**: `npm run build:static`
- ✅ **Output Directory**: `dist/public`
- ✅ **Install Command**: `npm install`

**Não precisa alterar nada!** As configurações estão no arquivo `vercel.json`.

### 4. **Deploy**
- Clique em **"Deploy"**
- Aguarde 2-3 minutos
- ✅ **Pronto!** Seu site estará online

## 🌐 URLs do Site

Após o deploy, você terá:

### URL Principal
```
https://andreoli-consorcios.vercel.app
```

### URL Personalizada (opcional)
Você pode configurar um domínio personalizado como:
```
https://andreoliconsorcios.com.br
```

## 🔄 Deploy Automático

**Toda vez que você fizer push no GitHub, o site será atualizado automaticamente!**

```bash
git add .
git commit -m "Atualização do site"
git push origin main
```

## 📊 Recursos Incluídos

### ✅ **Funcionalidades que funcionam:**
- 🎯 **Simulações de consórcio** (100% funcionais)
- 📱 **Formulários** (redirecionam para WhatsApp)
- 🖼️ **Galeria de destaques do Instagram**
- 📞 **Botões de contato**
- 🎨 **Design responsivo completo**
- ⚡ **Performance otimizada**

### ❌ **Funcionalidades desabilitadas:**
- 🔐 **Painel administrativo** (precisa de banco de dados)
- 📄 **Upload de currículos** (funcionalidade backend)

## 🎯 **Vantagens do Vercel**

- ✅ **Totalmente gratuito**
- ✅ **SSL automático** (HTTPS)
- ✅ **CDN global** (site rápido mundial)
- ✅ **Deploy automático**
- ✅ **Analytics grátis**
- ✅ **Preview de branches**
- ✅ **Domínio personalizado grátis**

## 🔧 **Configurações Avançadas**

### Headers de Segurança
```json
{
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY", 
  "X-XSS-Protection": "1; mode=block"
}
```

### Cache Otimizado
- **Assets**: Cache de 1 ano
- **HTML**: Cache dinâmico
- **API**: Sem cache

## 🆘 **Solução de Problemas**

### Build Falhou?
```bash
# Teste local primeiro
npm run build:static

# Se der erro, verifique:
npm install
npm run build:static
```

### Site não carrega?
1. Verifique se o build passou
2. Vá em **Deployments** no Vercel
3. Clique no deploy com erro
4. Veja os logs

### Domínio personalizado?
1. No Vercel, vá em **Settings** > **Domains**
2. Adicione seu domínio
3. Configure DNS conforme instruções

## 📞 **Suporte**

Se tiver problemas:
1. Verifique os logs no Vercel
2. Teste o build local: `npm run build:static`
3. Verifique se todos os arquivos estão no GitHub

---

## 🎉 **Resultado Final**

Após seguir este guia, você terá:

✅ **Site online em 5 minutos**  
✅ **Zero custos de hospedagem**  
✅ **Domínio profissional**  
✅ **Deploy automático**  
✅ **Performance mundial**  

**Seu site estará acessível 24/7 para seus clientes testarem!** 🚀