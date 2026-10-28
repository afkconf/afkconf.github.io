/**
 * Índice de edições por ano (página Palestras).
 * Agrupa cada "## [ edições YYYY ]" + sua tabela num <section data-ano>,
 * monta a barra [ 2022 ][ 2023 ]... e mostra só o ano selecionado.
 * Sem JS, todas as seções aparecem normalmente (degradação graciosa).
 */
(function () {
  var main = document.querySelector('main');
  if (!main) return;

  // 1. Envolve cada heading de ano + conteúdo até o próximo heading.
  var anos = [];
  Array.prototype.slice.call(main.querySelectorAll('h2')).forEach(function (h2) {
    var m = h2.textContent.match(/\d{4}/);
    if (!m) return;
    var ano = m[0];
    var sec = document.createElement('section');
    sec.className = 'ano-bloco';
    sec.setAttribute('data-ano', ano);
    h2.parentNode.insertBefore(sec, h2);
    sec.appendChild(h2);
    while (sec.nextElementSibling && sec.nextElementSibling.tagName !== 'H2') {
      sec.appendChild(sec.nextElementSibling);
    }
    if (anos.indexOf(ano) === -1) anos.push(ano);
  });

  if (anos.length === 0) return;
  anos.sort();

  // 2. Barra de índice (usa o placeholder #ano-index, se existir).
  var nav = document.getElementById('ano-index');
  if (!nav) {
    nav = document.createElement('nav');
    nav.id = 'ano-index';
    nav.className = 'ano-index';
    main.insertBefore(nav, main.querySelector('.ano-bloco'));
  }

  function mostrar(ano) {
    var blocos = main.querySelectorAll('.ano-bloco');
    for (var i = 0; i < blocos.length; i++) {
      blocos[i].hidden = (blocos[i].getAttribute('data-ano') !== ano);
    }
    var botoes = nav.querySelectorAll('button');
    for (var j = 0; j < botoes.length; j++) {
      botoes[j].setAttribute('aria-pressed', botoes[j].getAttribute('data-ano') === ano ? 'true' : 'false');
    }
    if (window.history && history.replaceState) {
      history.replaceState(null, '', '#' + ano);
    }
  }

  anos.forEach(function (ano) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('data-ano', ano);
    b.setAttribute('aria-pressed', 'false');
    b.textContent = '[ ' + ano + ' ]';
    b.addEventListener('click', function () { mostrar(ano); });
    nav.appendChild(b);
  });

  // 3. Ano inicial: o do #hash (se válido) ou o mais recente.
  var inicial = (location.hash || '').replace('#', '');
  if (anos.indexOf(inicial) === -1) inicial = anos[anos.length - 1];
  mostrar(inicial);
})();
