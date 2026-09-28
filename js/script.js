const botoesCategorias = document.querySelectorAll('button[data-categoria]');
const cardsEmpreendedores = document.querySelectorAll('article[data-categoria]');
botoesCategorias.forEach(function(botao) {

    botao.addEventListener('click', function() {
        const categoriaSelecionada = botao.dataset.categoria;


        cardsEmpreendedores.forEach(function(card) {
            const categoriaCard = card.dataset.categoria;

            if (categoriaCard === categoriaSelecionada || categoriaSelecionada === 'todos') {
                card.style.display = 'block';
                
                }else {
                    card.style.display = 'none';
                }    

            });

         });

    });