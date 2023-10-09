# Drag 'n Drop ToDo List


## 🚀 Começando

Essas instruções permitirão que você obtenha uma cópia do projeto em operação na sua máquina local para fins de desenvolvimento e teste.

### 📋 Pré-requisitos

Do que você precisa para rodar o software?

```
-node
-compilador SASS
```

### 🔧 Instalação

Execute o seguinte comando na pasta raiz do projeto:

```
npm install
```

### ⚙️ Execução

Para rodar a aplicação em modo de desenvolvimento execute o seguinte comando:

```
npm run start
```

### 📦 Implantação AWS

Para servir a aplicação na web utilizando o serviços S3 de AWS siga as instruções abaixo.

1 - No console de serviços selecione o serviço S3

2 - NO menu lateral escolha a opção "Buckets" e em seguida "Criar bucket"

3 - Selecione o bucket escolhido e na guia de permissões desabilite a opção "Bloquear acesso público"

4 - Ainda na área de permissões configure a política do bucket 

5 - Também na área de permissões configure o Compartilhamento de recursos de origem cruzada (CORS)

6 - Em seguida na guia "Propriedades" na área "Editar hospedagem de site estático" clique em "Editar"

7 - Em "hospedagem de site estático marque a opção "Ativar" e em tipo de hospedagem marque a opção "Hospedar um site estático"

8 - em "Documento de ídice" coloque "index.html" e salve as alterações

9 - Gere a pasta build da aplicação com o seguinte comando na pasta raiz:

```
npm run build
```
10 - Na guia "Objetos" do seu bucket clique em carregar

11 - Clique em "adicionar arquivos" e em "Adicionar pastas" e faça o upload de todos os arquivos de pastas da pasta build geradas.

#### Fornecendo uma distribuição com Cloudfront

Passos para criar uma distribuição do aplicativo utilizando o serviço Cloudfront

1 - Selecione o serviço Cloudfront no console AWS

2 - Clique em "Create distribution"

3 - Na área origin selecione o bucket criado anteriormente e e escolha um nome

4 - Para esta aplicação não é necessário configurações avançadas, mas fique a vontade para explorar suas necessidades.

5 - Clique em "Create distribution" para finalizar

##

### Clique [aqui](http://teste-tantaculo.s3-website-sa-east-1.amazonaws.com) para utilizar a aplicação