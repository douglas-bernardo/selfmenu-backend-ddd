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

**RNF**

**RN**
- O usuário não pode alterar seu e-mail para um e-mail já utilizado;
- Para atualizar a sua senha o usuário deve informar a senha antiga;
- Para atualizar a sua senha o usuário deve confirmar nova antiga;

# Criação de conta

**RF**

- O usuário deve poder cadastrar uma conta;

**RNF**

**RN**
- A nova conta precisa ser de acordo com os tipos de plano previamente cadastrados (Free ou Premium);
- O usuário não pode criar uma nova conta caso já possua uma conta ativa;

# Criação de Restaurante

**RF**
- O usuário deve poder cadastrar um restaurante associado a sua conta

**RNF**
- O restaurante precisa ter um nome de domínio que o identifique de forma clara;

**RN**
- O restaurante não poder ser cadastrado para uma contas inativas;
- Somente contas Premium podem cadastrar mais de um restaurante;

# Criação de um item de menu

**RF**
- Usuário deve poder cadastrar um item de menu;
- O usuário deve poder atrelar ao item uma categoria;

**RNF**

**RN**
- Somente usuários ativos podem cadastrar itens;
- O usuário não deve cadastrar itens com o mesmo nome;

# Criação de um menu digital

**RF**
- O usuário deve ser capaz de cadastrar um menu digital associado ao restaurante cadastrado

**RNF**

**RN**
- Cada menu cadastrado deve possui a identificação de seu respectivo restaurante (owner_id);
- Somente restaurantes ativos podem ter menus cadastrados;
- Somente contas Premium podem ter mais de um menu digital cadastrado;
- Somente items pertencentes ao estabelecimento podem ser add ao menu


# Cadastro de garçons

**RF**
- O usuário deve poder cadastrar um garçon;

**RNF**

**RN**
- Somente contas Premium (owner) podem cadastrar garçons;
- O garçon deve ser associado a um owner (conta) válido;
- O garçon deve ser associado a um restaurante válido válido;
- Garçons cadastrados devem possuir usuário e senha para acesso ao sistema e
posterior acompanhamento de pedidos.


# Criação de Pedido

**RF**
- Usuário (cliente final) deve poder criar um pedido
- Usuário (cliente final) deve poder filtrar itens por categoria.
- O usuário deve receber um código unico que identifica a mesa para realizar seu pedido.

**RNF**
- Utilizar estratégia de hash que gere um código curto de fácil digitação.

**RN**
- Somente estabelecimentos pertencentes a contas Premium (owner) podem registrar/gerenciar pedidos;
- Pedidos devem ser associados a um estabelecimento válido;
- Pedidos devem ser associados a uma mesa válida;
- Pedidos devem ser associados a um garçom válido;
- Pedidos precisam conter items válidos;
- Ao realizar um pedido a quantidade do pedido cadastrado deve ser atualizada;
