document.addEventListener('DOMContentLoaded', () => {
    const inputArquivo = document.getElementById('input-arquivo');
    const btnSalvar = document.getElementById('btn-salvar');
    const canvas = document.getElementById('canvas-restaurador');
    const ctx = canvas.getContext('2d');

    // Inicialização da tela
    canvas.width = 600;
    canvas.height = 400;
    ctx.fillStyle = '#222222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Função de Restauração de Alto Contraste
    // Esta função garante que as linhas fiquem nítidas (pretas) e o fundo limpo (branco)
    function aplicarRestauracao() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Loop de processamento de imagem
        for (let i = 0; i < data.length; i += 4) {
            let media = (data[i] + data[i + 1] + data[i + 2]) / 3;
            // Limiar ajustado para melhor performance em desenhos técnicos
            let cor = media > 140 ? 255 : 0; 
            data[i] = data[i + 1] = data[i + 2] = cor; // Define a cor final (preto ou branco)
        }
        ctx.putImageData(imageData, 0, 0);
        console.log("Restauração técnica concluída.");
    }

    // Lógica de Carregamento
    inputArquivo.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type === 'application/pdf') {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const pdf = await pdfjsLib.getDocument({ data: event.target.result }).promise;
                const page = await pdf.getPage(1);
                const viewport = page.getViewport({ scale: 2.5 }); // Escala maior para nitidez
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                await page.render({ canvasContext: ctx, viewport: viewport }).promise;
                aplicarRestauracao(); // Aplica o filtro logo após renderizar o PDF
            };
            reader.readAsArrayBuffer(file);
        } else {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    aplicarRestauracao(); // Aplica o filtro logo após carregar a imagem
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Função de Salvar com forçador de download
    btnSalvar.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'desenho-tecnico-restaurado.png';
        // Converte o canvas para imagem PNG
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
    });
});