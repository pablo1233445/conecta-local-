'use strict';
const CHAVE = 'nexora-negocios-v1';
const categorias = { alimentacao: 'Alimentação', 'aulas-cursos': 'Aulas/Cursos', 'beleza-estetica': 'Beleza/Estética', 'casa-construcao': 'Casa/Construção' };
function contatoValido(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor) || (/^\+?[\d\s().-]+$/.test(valor) && /^\d{10,13}$/.test(valor.replace(/\D/g, '')));
}
function negocioValido(item) {
    return item && typeof item.nome === 'string' && item.nome.trim().length >= 2 && item.nome.length <= 100 && Object.hasOwn(categorias, item.categoria) && typeof item.descricao === 'string' && item.descricao.trim().length >= 10 && item.descricao.length <= 1000 && typeof item.contato === 'string' && item.contato.length <= 150 && contatoValido(item.contato);
}
function lerNegocios() {
    const dados = JSON.parse(localStorage.getItem(CHAVE) || '[]');
    if (!Array.isArray(dados) || !dados.every(negocioValido)) throw new Error('Dados inválidos');
    return dados;
}
const formulario = document.querySelector('#cadastro');
if (formulario) {
    const campos = ['nome', 'categoria', 'descricao', 'contato'].map(id => document.getElementById(id));
    function validar() {
        campos.forEach(campo => {
            const valor = campo.value.trim();
            let erro = '';
            if (!valor) erro = 'Preencha este campo.';
            else if (campo.id === 'nome' && valor.length < 2) erro = 'Informe pelo menos 2 caracteres.';
            else if (campo.id === 'descricao' && valor.length < 10) erro = 'Descreva seu negócio em pelo menos 10 caracteres.';
            else if (campo.id === 'contato' && !contatoValido(valor)) erro = 'Informe um e-mail válido ou telefone com DDD (10 a 13 dígitos).';
            campo.setCustomValidity(erro);
            if (erro) campo.setAttribute('aria-invalid', 'true');
            else campo.removeAttribute('aria-invalid');
        });
    }
    campos.forEach(campo => campo.addEventListener('input', validar));
    formulario.addEventListener('submit', evento => {
        evento.preventDefault();
        validar();
        if (!formulario.reportValidity()) return;
        const mensagem = document.querySelector('#mensagem');
        document.querySelector('#ver-negocios').hidden = true;
        try {
            const negocios = lerNegocios();
            const negocio = Object.fromEntries(campos.map(campo => [campo.id, campo.value.trim()]));
            negocios.push(negocio);
            localStorage.setItem(CHAVE, JSON.stringify(negocios));
            formulario.reset();
            campos.forEach(campo => { campo.setCustomValidity(''); campo.removeAttribute('aria-invalid'); });
            mensagem.textContent = 'Negócio cadastrado com sucesso neste navegador!';
            document.querySelector('#ver-negocios').hidden = false;
        } catch {
            mensagem.textContent = 'Não foi possível salvar. O armazenamento pode estar bloqueado, cheio ou conter dados inválidos. Seus campos foram mantidos; tente em outro navegador ou verifique os dados locais.';
        }
        mensagem.focus();
    });
}
const explorar = document.querySelector('#explorar');
if (explorar) {
    const dialogo = document.querySelector('#perfil');
    let origem;
    function abrirPerfil(negocio, link) {
        origem = link;
        document.querySelector('#perfil-nome').textContent = negocio.nome;
        document.querySelector('#perfil-categoria').textContent = categorias[negocio.categoria] + (negocio.exemplo ? ' · Exemplo de demonstração' : '');
        document.querySelector('#perfil-descricao').textContent = negocio.descricao;
        const contato = document.querySelector('#perfil-contato');
        contato.replaceChildren();
        if (negocio.exemplo) contato.textContent = 'Exemplo de demonstração, sem contato real disponível.';
        else {
            const linkContato = document.createElement('a');
            linkContato.textContent = negocio.contato;
            linkContato.href = negocio.contato.includes('@') ? 'mailto:' + negocio.contato : 'tel:' + negocio.contato.replace(/[^\d+]/g, '');
            contato.append(linkContato);
        }
        dialogo.showModal();
    }
    function ligarPerfil(card, negocio) {
        const link = card.querySelector('a');
        link.setAttribute('aria-label', 'Ver perfil de ' + negocio.nome);
        link.addEventListener('click', evento => { evento.preventDefault(); abrirPerfil(negocio, link); });
    }
    explorar.querySelectorAll('article').forEach(card => {
        const negocio = { nome: card.querySelector('h4').textContent, categoria: card.dataset.categoria, descricao: card.querySelectorAll('p')[1].textContent, exemplo: true };
        const selo = document.createElement('span');
        selo.className = 'selo'; selo.textContent = 'Exemplo de demonstração';
        card.prepend(selo);
        ligarPerfil(card, negocio);
    });
    let selecionada = 'todos';
    function carregar() {
        explorar.querySelectorAll('[data-cadastrado]').forEach(card => card.remove());
        const aviso = document.querySelector('#aviso-armazenamento');
        aviso.textContent = '';
        try {
            lerNegocios().forEach(negocio => {
                const card = document.createElement('article');
                card.dataset.categoria = negocio.categoria; card.dataset.cadastrado = '';
                ['h4', 'p', 'p', 'a'].forEach((tag, indice) => {
                    const elemento = document.createElement(tag);
                    elemento.textContent = [negocio.nome, categorias[negocio.categoria], negocio.descricao, 'Ver perfil'][indice];
                    if (tag === 'a') elemento.href = '#perfil';
                    card.append(elemento);
                });
                explorar.append(card); ligarPerfil(card, negocio);
            });
        } catch { aviso.textContent = 'Não foi possível carregar os cadastros locais. Os exemplos continuam disponíveis.'; }
        filtrar();
    }
    function filtrar() {
        let total = 0;
        explorar.querySelectorAll('article').forEach(card => {
            card.hidden = selecionada !== 'todos' && card.dataset.categoria !== selecionada;
            if (!card.hidden) total++;
        });
        explorar.querySelectorAll('button[data-categoria]').forEach(botao => botao.setAttribute('aria-pressed', String(botao.dataset.categoria === selecionada)));
        document.querySelector('#resultados').textContent = total ? `${total} negócio(s) encontrado(s), incluindo exemplos de demonstração.` : 'Nenhum negócio nesta categoria.';
    }
    explorar.querySelectorAll('button[data-categoria]').forEach(botao => botao.addEventListener('click', () => { selecionada = botao.dataset.categoria; filtrar(); }));
    document.querySelector('#fechar-perfil').addEventListener('click', () => dialogo.close());
    dialogo.addEventListener('close', () => origem?.focus());
    window.addEventListener('storage', evento => { if (evento.key === CHAVE || evento.key === null) carregar(); });
    window.addEventListener('pageshow', carregar);
    carregar();
}
