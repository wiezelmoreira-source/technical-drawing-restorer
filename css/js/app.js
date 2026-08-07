// Aguarda o navegador carregar todos os elementos antes de rodar o script
document.addEventListener('DOMContentLoaded', () => {
    const inputArquivo = document.getElementById('input-arquivo');
    const btnCarregar = document.getElementById('btn-carregar');
    const canvas = document.getElementById('canvas-restaurador');
    const ctx = canvas.getContext('2d');

    // Mensagem inicial na prancheta
    ctx.fillStyle = '#888888';
    ctx.font = '16px Segoe UI';
    ctx.textAlign = 'center';
    canvas.width = 600;
    canvas.height = 400;
    ctx.fillText('Nenhum desenho carregado. Clique em "Abrir Desenho".', canvas.width / 2, canvas.height / 2);

    // Quando clicar no botão bonito, ele aciona o seletor de arquivos oculto
    btnCarregar.addEventListener('click', () => {
        inputArquivo.click();
    });

    // Quando o usuário selecionar um arquivo de imagem
    inputArquivo.addEventListener('change', (evento) => {
        const arquivo = evento.target.files[0];
        if (!arquivo) return;

        const leitor = new FileReader();
        leitor.onload = function (e) {
            const imagem = new Image();
            imagem.onload = function () {
                // Ajusta o tamanho do canvas para o tamanho exato da imagem original (Preservação Geométrica Total)
                canvas.width = imagem.width;
                canvas.height = imagem.height;

                // Desenha a imagem na prancheta virtual
                ctx.drawImage(imagem, 0, 0);
                console.log("Desenho técnico carregado com sucesso. Geometria preservada.");
            }
            imagem.src = e.target.result;
        }
        leitor.readAsDataURL(arquivo);
    });
});