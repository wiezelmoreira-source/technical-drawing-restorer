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

    // Lógica de Carregamento (PDF ou Imagem)
    inputArquivo.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type === 'application/pdf') {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const pdf = await pdfjsLib.getDocument({ data: event.target.result }).promise;
                const page = await pdf.getPage(1);
                const viewport = page.getViewport({ scale: 2.0 });
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                await page.render({ canvasContext: ctx, viewport: viewport }).promise;
                aplicarRestauracao();
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
                    aplicarRestauracao();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Filtro de Contraste
    function aplicarRestauracao() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            let media = (data[i] + data[i + 1] + data[i + 2]) / 3;
            let cor = media > 130 ? 255 : 0;
            data[i] = data[i + 1] = data[i + 2] = cor;
        }
        ctx.putImageData(imageData, 0, 0);
    }

    // Função de Salvar
    btnSalvar.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'desenho-restaurado.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
});