# Nexora Conecta

Protótipo de catálogo de negócios locais, feito com HTML, CSS e JavaScript puro, sem dependências de produção ou etapa de compilação.

## Execução

Na pasta do projeto, inicie um servidor estático. Com Python instalado:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Abra http://localhost:8000/index.html. Use o mesmo endereço, porta e navegador para cadastrar e consultar os negócios: o localStorage pertence à origem. Abrir os arquivos diretamente por file:// pode ter comportamento de armazenamento diferente entre navegadores; prefira o servidor local.

## Organização e funcionalidades

- `index.html`: apresentação, acessos e seção Sobre.
- `empreendedor.html`: cadastro de nome do negócio, categoria, descrição e contato (e-mail ou telefone com DDD).
- `cliente.html`: quatro exemplos existentes e cadastros locais, filtros por categoria e perfis em janela de diálogo.
- `css/style.css`: identidade lilás, adaptação às telas, foco visível e redução de movimento.
- `js/script.js`: validação, leitura/gravação na chave `nexora-negocios-v1`, listagem, filtros e detalhes.

Todos os campos são obrigatórios. Nome: 2 a 100 caracteres; descrição: 10 a 1.000; contato: até 150, com e-mail válido ou telefone de 10 a 13 dígitos. Espaços nas extremidades são removidos. Dados cadastrados são inseridos como texto, sem interpretar HTML. Cada perfil apresenta um link mailto: ou tel:; sua abertura depende dos aplicativos configurados no dispositivo.

Os exemplos estão identificados como demonstração, sem contatos reais. Filtros incluem exemplos e cadastros, anunciam a contagem e indicam a seleção. A navegação inclui atalho para o conteúdo, rótulos de campos, estado dos filtros, foco visível e diálogo nativo com fechamento por botão ou Escape e retorno ao link de origem.

## Limitações

- Não há servidor de dados, contas, autenticação, moderação, geolocalização, edição ou exclusão de cadastros.
- Os cadastros ficam somente no navegador/perfil e origem usados; não são publicados nem sincronizados entre dispositivos. Limpar os dados do site os apaga. Não use este protótipo como cópia única de informações importantes.
- Armazenamento bloqueado, cheio ou com dados inválidos gera aviso; o formulário preserva os campos em caso de falha. Dados inválidos não são sobrescritos automaticamente. Os exemplos continuam disponíveis quando a leitura falha.
- Cadastro, filtros e perfis exigem JavaScript. São esperados navegadores atuais com suporte a dialog, localStorage e Object.hasOwn.
- A validação confirma o formato do contato, não a existência ou titularidade. Não há proteção contra anúncios duplicados nem comprovação de localização dos negócios.

## Plano de testes

Use um perfil de navegador de teste. Antes de começar, remova somente a chave `nexora-negocios-v1` no armazenamento desse site, se necessário.

1. Abrir a página inicial e seguir os acessos de cliente e empreendedor; conferir Sobre e os links de retorno em todas as páginas.
2. Enviar formulário vazio, somente espaços, descrição curta e contato inválido: impedir envio e indicar o campo. Conferir os limites máximos e uma categoria não selecionada.
3. Cadastrar um negócio com e-mail e outro com telefone. Conferir sucesso, limpeza do formulário, listagem e persistência após recarregar.
4. Percorrer Todos e as quatro categorias: mostrar apenas os cartões correspondentes, manter o estado pressionado e atualizar a contagem. Repetir com cadastros locais.
5. Abrir os perfis: conferir nome, categoria, descrição e contato; exemplos devem indicar ausência de contato real. Conferir mailto: e tel: sem enviar mensagens nem efetuar chamadas.
6. Usar apenas Tab, Shift+Tab, Enter, Espaço e Escape: acessar o atalho para conteúdo, formulário, filtros e perfis; verificar foco visível, confinamento no diálogo e retorno ao acionador.
7. Verificar telas de 320, 390, 768 e 1280 pixels, textos longos e zoom de 200%: sem conteúdo cortado ou rolagem horizontal indevida.
8. Simular armazenamento bloqueado/cheio e JSON inválido na chave: avisar falha, manter campos e exemplos, sem informar sucesso falso.
9. Cadastrar texto contendo marcação HTML: exibir como texto sem executar código. Conferir console sem erros.
10. Complementar com Firefox, Safari, dispositivos reais e leitor de tela; verificar anúncios de contagem, erros e diálogo. Confirmar atualizações entre duas abas da mesma origem.

### Verificações realizadas nesta implementação

Testes automatizados em Chrome sem interface: campos vazios, espaços, contato inválido, cadastro com e-mail e telefone, persistência após recarga, combinação com exemplos, filtro Casa/Construção, estado do filtro, perfis e destinos mailto:/tel:, fechamento por botão/Escape, retorno de foco, Tab dentro do diálogo, atalho para conteúdo, link Sobre, texto HTML inerte, dados corrompidos e falha simulada de gravação. Sem erros JavaScript durante esses fluxos.

As três páginas foram verificadas quanto a rolagem horizontal nas larguras 320, 390, 768 e 1280 pixels. A listagem em desktop e o formulário em celular passaram por inspeção visual. Sintaxe JavaScript e `git diff --check` também foram verificadas.

Pendentes: demais navegadores, leitor de tela, dispositivos reais, zoom de 200%, limites máximos em interação e sincronização entre abas. Não foram realizados testes com usuários. Não há atribuição de contribuições individuais neste documento.
