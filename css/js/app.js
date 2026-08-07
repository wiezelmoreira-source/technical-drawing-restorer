document.addEventListener('DOMContentLoaded', () => {
    const inputArquivo = document.getElementById('input-arquivo');
    const canvas = document.getElementById('canvas-restaurador');
    const ctx = canvas.getContext('2d');

    function limparCanvas() {
        canvas.width = 600;
        canvas.height = 400;
        ctx.fillStyle = '#222222';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#888888';
        ctx.textAlign = 'center';
        ctx.fillText('Pronto para carregar Imagem (PNG/JPG) ou PDF.', canvas.width / 2, canvas.height / 2);
    }
    limparCanvas();

    inputArquivo.addEventListener('change', async (evento) => {
        const arquivo = evento.target.files[0];
        if (!arquivo) return;

        // Se o arquivo selecionado for um PDF
        if (arquivo.type === 'application/pdf') {
            const reader = new FileReader();
            reader.onload = async function(e) {
                const typedarray = new Uint8Array(e.target.result);
                try {
                    const pdf = await pdfjsLib.getDocument(typedarray).promise;
                    const page = await pdf.getPage(1); // Renderiza a primeira página do PDF
                    
                    const scale = 2.0; // Escala alta para manter a nitidez do desenho técnico
                    const viewport = page.getViewport({ scale: scale });

                    canvas.width = viewport.width;
                    canvas.height = viewport.height;

                    const renderContext = {
                        canvasContext: ctx,
                        viewport: viewport
                    };

                    await page.render(renderContext).promise;
                    aplicarRestauracao();
                    console.log("PDF renderizado e restaurado com sucesso.");
                } catch (error) {
                    console.error("Erro ao processar o PDF:", error);
                    alert("Não foi possível ler este arquivo PDF.");
                }
            };
            reader.readAsArrayBuffer(arquivo);
        } 
        // Se for uma imagem padrão (PNG ou JPEG)
        else {
            const leitor = new FileReader();
            leitor.onload = function (e) {
                const imagem = new Image();
                imagem.onload = function () {
                    canvas.width = imagem.width;
                    canvas.height = imagem.height;
                    ctx.drawImage(imagem, 0, 0);
                    aplicarRestauracao();
                    console.log("Imagem carregada e restaurada com sucesso.");
                }
                imagem.src = e.target.result;
            }
            leitor.readAsDataURL(arquivo);
        }
    });

    // Filtro de contraste inteligente para limpar linhas e fundo
    function aplicarRestauracao() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const limiar = 130; // Ponto de corte entre o fundo e as linhas técnicas

        for (let i = 0; i < data.length; i += 4) {
            let media = (data[i] + data[i + 1] + data[i + 2]) / 3;
            let cor = media > limiar ? 255 : 0;
            data[i] = data[i + 1] = data[i + 2] = cor;
        }
        ctx.putImageData(imageData, 0, 0);
    }
});