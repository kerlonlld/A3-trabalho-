# UNIQ

Loja estática com autenticação Firebase.

## Desenvolvimento

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Preencha `.env.local` com as credenciais de configuração Web do Firebase antes de testar o login. Nunca coloque chaves privadas de service account no navegador.

## Configuração do Firebase Authentication

No Firebase Console, abra **Authentication > Sign-in method** e habilite **E-mail/senha** e **Google**. Em **Authentication > Settings > Authorized domains**, adicione o domínio local e o domínio publicado no Vercel.

## Publicação no Vercel

Importe o repositório no Vercel. O build está configurado em `vercel.json`. Cadastre as variáveis `VITE_FIREBASE_*` de `.env.example` nas configurações do projeto Vercel, faça um novo deploy e inclua o domínio gerado na lista de domínios autorizados do Firebase.
