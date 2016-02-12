**IMPORTANTE**: em seu terminal de preferência, dentro deste diretório, baixe todas as dependências do projeto através do comando `npm install` antes de continuar.

# EXERCÍCIO 8

Vamos concluir nosso cadastro de palestrantes.

## PASSO 1

Precisamos criar um endpoint que seja capaz de lidar com requisições do tipo POST para a rota `/palestrantes`.

Altere **app/api/palestrantes.js**. Vamos encadear uma chamada à função `.post` para a routa `/palestrantes:

```
// app/api/palestrantes.js

var mongoose = require('mongoose');

module.exports = function(app) {
    
    var Palestrante = mongoose.model('Palestrante');
    
    app.route('/palestrantes')
        .get(function(req, res) {
            Palestrante
                .find()
                .then(function(palestrantes) {
                    res.json(palestrantes);     
                });
        })
        .post(function(req, res) {

            // precisamos receber os dados do palestrante. Como?
        });
};
```

## PASSO 2

Quando nosso cliente Angular enviar os dados do palestrante (ainda precisamos implementar essa funcionalidade) eles serão enviados através 
do método POST. Mas onde teremos acesso a esses dados? O Express possui o middleware `body-parser`. Quando ativado, todos os dados enviados na requisição serão acessíveis através de `req.body`, sendo assim, `req.body` será nosso palestrante! **Precisamos ativar o middleware**.

**Altere** `app/config/express.js` e importe o módulo, configurando-o logo em seguida. Seu arquivo deverá ficar assim:

```
// app/config/express.js

var express = require('express');
var app = express()
    ,consign = require('consign')
    ,bodyParser = require('body-parser'); // novidade! importando o middlware

app.use(express.static('public'));

// novidade! configuração do body parser
app.use(bodyParser.json());

consign({cwd: 'app'})
    .include('models')
    .then('api')
    .into(app);


module.exports = app;

```
## PASSO 3 

Agora que já sabemos que `req.body` é nosso palestrante enviado pelo nosso cliente Angular, podemos usar a função `Palestrante.create` do nosso modelo do Mongoose para gravá-lo no banco. Como resposta, enviaremos para o cliente o paestrante, só que dessa vez com seu ID preenchido:

```
// app/api/paletrantes.js

var mongoose = require('mongoose');

module.exports = function(app) {
    
    var Palestrante = mongoose.model('Palestrante');
    
    app.route('/palestrantes')
        .get(function(req, res) {
            Palestrante
                .find()
                .then(function(palestrantes) {
                    res.json(palestrantes);     
                });
        })
        .post(function(req, res) {
            Palestrante
            .create(req.body)
            .then(function(palestrante) {
                // devolve o palestrante, mas com o ID preenchido
                res.status(200).send(palestrante);
            });
        });
};
```

## PASSO 4

Vamos voltar para nosso cliente Angular. 

**Crie** o arquivo **public/js/controllers/cadastro-controller.js** importando-o em `public/index.html`, de preferência, logo após a importação de `lista-controller.js'>

```
<!-- public/index.html -->
<script src="js/controllers/cadastro-controller.js"></script>
```

Ainda em `cadastro-controller.js`, crie o controller `CadastroController` que recebe por injeção `$scope` e `$resource`. 

```
// public/js/controllers/cadastro-controller.js

angular.module('minhaApp')
    .controller('CadastroController', function($scope, $resource) {

        var recursoPalestrante = $resource('/palestrantes');

    });
```


## PASSO 5

Crie em **$scope** a propriedade **palestrante**. Ela receberá os dados do formuário do palestrante à medida que formos digitando.

```
angular.module('minhaApp')
    .controller('CadastroController', function($scope, $resource) {

        var recursoPalestrante = $resource('/palestrantes');
        $scope.palestrante = {};

    });
```

## PASSO 6

Precisamos que os dois input's do nosso formulário (nome e palestra) estejam assciados às propriedades de `$scope.palestrante`. Fazemos isso através da diretiva `ng-model`, que além de ler, é capaz de gravar no escopo do controller (two-way data binding):

```
<!-- public/partials/cadastro.html -->
<h2 class="text-center">Cadastro de Palestrantes</h2>
<form>
    <div class="form-group">
        <label>Nome</label>
        <input class="form-control" ng-model="palestrante.nome">
    </div>
    <div class="form-group">
        <label>Palestra</label>
        <input class="form-control" ng-model="palestrante.palestra">
    </div>
    <button class="btn btn-primary">Cadastrar</button>
</form>
```

## PASSO 7

Todas vez que interagirmos com o input, nossa entrada será atualizada em `$scope.palestrante.nome` e `$scope.palestrante.palestra`. A ideia agora é executarmos alguma ação no controller que envie os dados capturados para o servidor. 

**Altere** `public/js/controllers/cadastro-controller.js` adicionando a propriedade `$scope.gravar`:

```
angular.module('minhaApp')
    .controller('CadastroController', function($scope, $resource) {

        var recursoPalestrante = $resource('/palestrantes');
        $scope.palestrante = {};

        $scope.gravar = function() {

            // precisa enviar nosso palestrante para nosso endpoint!
        }
    });
```

## PASSO 8

Dentro da nossa função `gravar`, vamos invocar `recursoFoto.save()`, que recebe o palestrante como parâmetro. Por baixo dos panos uma requisição do tipo POST enviará todas as propriedades do palestrante como parâmetros para nosso endpoint `/palestrantes`, aquele que definimos quando criamos nosso recurso:

```
angular.module('minhaApp')
    .controller('CadastroController', function($scope, $resource) {

        var recursoPalestrante = $resource('/palestrantes');
        $scope.palestrante = {};

        $scope.gravar = function() {

            recursoPalestrante.save($scope.palestrante, function() {
                
                // salva o palestrante
             });
        }
    });
```

## PASSO 9

Se tudo correr bem, quando salvarmos nosso palestrante, a função passada como callback para `save` será executada. É uma boa hora de limparmos o nosso formulário. Basta atribuírmos à `$scope.palestrante` uma nova instância do nosso recurso. Devido ao two-way data binding, essa alteração refletirá em nosso formulário, limpando-o:

```
angular.module('minhaApp')
    .controller('CadastroController', function($scope, $resource) {

        var recursoPalestrante = $resource('/palestrantes');
        $scope.palestrante = new recursoPalestrante();

        $scope.gravar = function() {

            recursoPalestrante.save($scope.palestrante, function() {
                
                $scope.palestrante = {};
             });
        }
    });
```

## PASSO 10

Mas como nosso formulário sabe que deve chegar `$scope.gravar`? Vamos usar a diretiva `ng-submit` no próprio formulário. Para cada evento do JavaScript, temos uma diretiva correspondente no Angular. Nela, indicamos que queremos chamar a função `gravar()` apenas quando o formulário for submetido:

```
<!-- public/partials/cadastro.html -->
<!-- adicionando a diretiva ng-submit no formulário -->
<form ng-submit="gravar()">
```

### PASSO 11

Precisamos agora associar o controller `CadastroController` com nossa view `cadastro.html`.

**Altere** `public/main.js` e adicione a chave `controller` que falta para a rota `cadastro`, e claro, atribuindo como seu valor `CadastroController:

```
// public/main.js
// código anterior omitido

$routeProvider.when('/cadastro', {
    controller: 'CadastroController',
    templateUrl: 'partials/cadastro.html'
});

// código posterior omitido
```

Agora é só testar o resultado. Cadastre alguns palestrantes, depois, verifique se todos aparecem na listagem.