document.addEventListener('DOMContentLoaded', () => {
    const inputArquivo = document.getElementById('input-arquivo');
    const canvas = document.getElementById('canvas-restaurador');
    const ctx = canvas.getContext('2d');

    // Configuração inicial da prancheta
    canvas.width = 600;
    canvas.height = 400;
    ctx.fillStyle = '#222222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#888888';
    ctx.font = '14px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText('Nenhum desenho carregado. Clique em "Abrir Desenho".', canvas.width / 2, canvas.height / 2);

    // Manipula a imagem selecionada diretamente pelo input nativo
    inputArquivo.addEventListener('change', (evento) => {
        const arquivo = evento.target.files[0];
        if (!arquivo) return;

        const leitor = new FileReader();
        leitor.onload = function (e) {
            const imagem = new Image();
            imagem.onload = function () {
                canvas.width = imagem.width;
                canvas.height = imagem.height;
                ctx.drawImage(imagem, 0, 0);
                console.log("Desenho técnico carregado com sucesso.");
            }
            imagem.src = e.target.result;
        }
        leitor.readAsDataURL(arquivo);
    });
});