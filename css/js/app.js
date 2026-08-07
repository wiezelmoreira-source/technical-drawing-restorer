document.addEventListener('DOMContentLoaded', () => {
    const inputArquivo = document.getElementById('input-arquivo');
    const canvas = document.getElementById('canvas-restaurador');
    const ctx = canvas.getContext('2d');

    // Inicialização da tela
    function limparCanvas() {
        canvas.width = 600;
        canvas.height = 400;
        ctx.fillStyle = '#222222';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#888888';
        ctx.textAlign = 'center';
        ctx.fillText('Desenho pronto para restauração.', canvas.width / 2, canvas.height / 2);
    }
    limparCanvas();

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

                // Aplicar restauração de contraste
                aplicarRestauracao();
            }
            imagem.src = e.target.result;
        }
        leitor.readAsDataURL(arquivo);
    });

    function aplicarRestauracao() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const limiar = 128; // Define o que é linha (preto) e o que é fundo (branco)

        for (let i = 0; i < data.length; i += 4) {
            let media = (data[i] + data[i + 1] + data[i + 2]) / 3;
            let cor = media > limiar ? 255 : 0;
            data[i] = data[i + 1] = data[i + 2] = cor;
        }
        ctx.putImageData(imageData, 0, 0);
        console.log("Restauração geométrica aplicada com sucesso.");
    }
});