# Recuperação de Senha

**RF**

- O usuário deve poder recuperar sua senha através do e-mail;
- O usuário deve receber um e-mail com instruções para recuperação de senha;
- O usuário deve poder resetar sua senha;

**RNF**

- Utilizar o Ethereal como fake SMTP service para testar envios em ambiente dev;
- Utilizar Amazon SES para envios em produção;
- O envio de e-mails deve acontecer em segundo plano (background jobs);

**RN**

- O link enviado por e-mail para o reset de senha deve expirar em 2h;
- O usuário precisa confirmar a nova senha ao resetar sua senha;

# Atualização do perfil

**RF**

- O usuário deve poder atualizar seu nome, e-mail e senha;

**RN**
- O usuário não pode alterar seu e-mail para um e-mail já utilizado;
- Para atualizar a sua senha o usuário deve informar a senha antiga;
- Para atualizar a sua senha o usuário deve confirmar nova antiga;

# Criação de conta

**RF**

- O usuário deve poder cadastrar uma conta;

**RN**
- A nova conta precisa ser de acordo com os tipos previamente cadastrados;
- O usuário não pode criar uma nova conta caso já possua uma conta ativa;

# Criação de Restaurante

**RF**
- O usuário deve poder cadastrar um restaurante associado a sua conta

**RNF**
- O restaurante precisa ter um nome de domínio que o identifique de forma clara;

**RN**
- O restaurante não poder ser cadastrado para uma contas inativas;
- Somente contas Premium podem cadastrar mais de um restaurante;

# Criação de um menu digital

**RF**
- O usuário deve ser capaz de cadastrar um menu digital associado ao restaurante cadastrado

**RN**
- Cada menu cadastrado deve possui a identificação de seu respectivo restaurante (owner_id)
- Somente contas Premium podem podem ter mais de um menu digital cadastrado;
