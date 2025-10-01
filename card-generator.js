/**
 * Gerador de Cartões e PDF
 * Cria layout de 8 cartões por página A4 (2x4) com dimensões precisas
 */

class CardGenerator {
    constructor() {
        // Dimensões em mm
        this.pageWidth = 210;  // A4 width
        this.pageHeight = 297; // A4 height
        this.marginOuter = 10; // Margens externas
        this.cardSpacing = 5;  // Espaçamento entre cartões
        this.cardPadding = 4;  // Espaçamento interno em mm
        this.cardBorderWidth = 0.75;
        this.cardBorderColor = '#333333';
        this.cardBackground = '#ffffff';
        this.cardSurfaceColor = '#f3f5fb';
        this.cardNameColor = '#1f2937';
        this.cardEmailColor = '#1f2937';
        this.cardPasswordColor = '#ffffff';
        this.cardTurmaColor = '#ffffff';
        this.cardLabelColor = '#64748b';
        this.cardHeaderColor = '#4A90E2';
        this.cardHeaderSecondaryColor = '#7B68EE';
        this.cardPillColor = '#5E82F5';
        this.cardPasswordChipColor = '#7B68EE';
        this.footerNote = '';
        this.footerFontSize = 7;
        this.footerColor = '#94a3b8';
        this.headerHeight = 22; // mm
        this.bodySpacing = 4;   // mm
        this.footerBaseline = 3; // mm
        this.logoDataUrl = null;
        
        // Cálculo das dimensões dos cartões
        // Largura disponível: 210 - (2 * 10) = 190mm
        // Com espaçamento: 190 - 5 = 185mm para 2 cartões
        this.cardWidth = (this.pageWidth - 2 * this.marginOuter - this.cardSpacing) / 2;
        
        // Altura disponível: 297 - (2 * 10) = 277mm
        // Com espaçamentos: 277 - (3 * 5) = 262mm para 4 cartões
        this.cardHeight = (this.pageHeight - 2 * this.marginOuter - 3 * this.cardSpacing) / 4;
        
        this.cardsPerPage = 8;
        
        // Converter mm para pontos (1mm = 2.83465 points)
        this.mmToPoint = 2.83465;
    }

    /**
     * Converte mm para pontos
     */
    mm(value) {
        return value * this.mmToPoint;
    }

    /**
     * Define logotipo para uso nos cartões (data URL)
     * @param {string|null} dataUrl
     * @param {string} mimeType
     */
    setLogo(dataUrl) {
        this.logoDataUrl = dataUrl;
    }

    /**
     * Calcula posição de um cartão na página
     * @param {number} cardIndex - Índice do cartão na página (0-7)
     * @returns {Object} {x, y} posição em mm
     */
    getCardPosition(cardIndex) {
        const col = cardIndex % 2;
        const row = Math.floor(cardIndex / 2);
        
        const x = this.marginOuter + col * (this.cardWidth + this.cardSpacing);
        const y = this.marginOuter + row * (this.cardHeight + this.cardSpacing);
        
        return { x, y };
    }

    /**
     * Cria definição de um cartão para pdfmake
     * @param {Object} student - Dados do aluno
     * @returns {Object} Definição do cartão
     */
    createCardDefinition(student) {
        const nameLength = (student.displayName || student.Nome || '').length;
        const emailLength = (student.Email || '').length;

        // Tamanhos de fonte aproximados ao novo design (em pontos)
        let nameFontSize = 11;
        if (nameLength > 24) nameFontSize = 10;
        if (nameLength > 34) nameFontSize = 9;

        let emailFontSize = 10.5;
        if (emailLength > 35) emailFontSize = 8.5;
        if (emailLength > 45) emailFontSize = 7.5;

        const cardWidthPt = this.mm(this.cardWidth);
        const cardHeightPt = this.mm(this.cardHeight);
        const paddingPt = this.mm(this.cardPadding);
        const headerHeightPt = this.mm(this.headerHeight);
        const bodyOffsetPt = headerHeightPt + this.mm(this.bodySpacing);
        const footerOffsetPt = this.mm(this.footerBaseline);
        const contentWidthPt = cardWidthPt - (2 * paddingPt);

        const backgroundCanvas = [
            {
                type: 'rect',
                x: 0,
                y: 0,
                w: cardWidthPt,
                h: cardHeightPt,
                lineWidth: this.cardBorderWidth,
                lineColor: this.cardBorderColor,
                color: this.cardBackground
            },
            {
                type: 'rect',
                x: 0,
                y: 0,
                w: cardWidthPt,
                h: headerHeightPt,
                lineWidth: 0,
                color: this.cardHeaderColor
            },
            {
                type: 'rect',
                x: 0,
                y: headerHeightPt,
                w: cardWidthPt,
                h: cardHeightPt - headerHeightPt,
                lineWidth: 0,
                color: this.cardSurfaceColor
            }
        ];

        const headerColumns = [];

        if (this.logoDataUrl) {
            headerColumns.push({
                width: 'auto',
                image: this.logoDataUrl,
                fit: [this.mm(14), this.mm(14)],
                margin: [0, 0, this.mm(3), 0],
                alignment: 'center'
            });
        }

        headerColumns.push({
            width: '*',
            text: student.displayName || student.Nome || '',
            fontSize: nameFontSize,
            bold: true,
            color: '#ffffff',
            margin: [0, 0, this.mm(2), 0]
        });

        if (student.Turma) {
            headerColumns.push({
                width: 'auto',
                table: {
                    widths: ['*'],
                    body: [[{
                        text: student.Turma,
                        color: '#ffffff',
                        fontSize: 8,
                        bold: true,
                        alignment: 'center',
                        border: [false, false, false, false],
                        fillColor: this.cardPillColor,
                        margin: [this.mm(2), this.mm(1), this.mm(2), this.mm(1)]
                    }]]
                },
                layout: {
                    hLineWidth: () => 0,
                    vLineWidth: () => 0,
                    paddingLeft: () => 0,
                    paddingRight: () => 0,
                    paddingTop: () => 0,
                    paddingBottom: () => 0
                }
            });
        }

        const bodyStack = [
            {
                text: 'EMAIL',
                fontSize: 7,
                color: this.cardLabelColor,
                margin: [0, 0, 0, this.mm(0.8)],
                letterSpacing: 0.6,
                bold: true
            },
            {
                text: student.Email || '—',
                fontSize: emailFontSize,
                color: this.cardEmailColor,
                margin: [0, 0, 0, this.mm(2)],
                noWrap: true
            },
            {
                text: 'PASSWORD',
                fontSize: 7,
                color: this.cardLabelColor,
                margin: [0, 0, 0, this.mm(0.8)],
                letterSpacing: 0.6,
                bold: true
            },
            {
                table: {
                    widths: ['*'],
                    body: [[{
                        text: student.Password || '—',
                        fontSize: 12,
                        bold: true,
                        color: this.cardPasswordColor,
                        alignment: 'center',
                        border: [false, false, false, false],
                        fillColor: this.cardPasswordChipColor,
                        margin: [0, this.mm(1), 0, this.mm(1)]
                    }]]
                },
                layout: {
                    hLineWidth: () => 0,
                    vLineWidth: () => 0,
                    paddingLeft: () => 0,
                    paddingRight: () => 0,
                    paddingTop: () => 0,
                    paddingBottom: () => 0
                },
                margin: [0, 0, 0, this.mm(2)]
            }
        ];

        const footer = this.footerNote ? {
            text: this.footerNote,
            fontSize: this.footerFontSize,
            color: this.footerColor
        } : null;

        return {
            backgroundCanvas,
            headerColumns,
            bodyStack,
            footer,
            width: cardWidthPt,
            height: cardHeightPt,
            padding: paddingPt,
            headerHeight: headerHeightPt,
            bodyOffset: bodyOffsetPt,
            footerOffset: footerOffsetPt,
            contentWidth: contentWidthPt
        };
    }

    /**
     * Cria uma página com até 8 cartões
     * @param {Array<Object>} students - Array de até 8 alunos
     * @returns {Array} Array de definições de cartões
     */
    createPageContent(students) {
        const content = [];
        
        students.forEach((student, index) => {
            const { x, y } = this.getCardPosition(index);
            const cardDef = this.createCardDefinition(student);
            
            const absoluteX = this.mm(x);
            const absoluteY = this.mm(y);

            content.push({
                canvas: cardDef.backgroundCanvas,
                absolutePosition: { x: absoluteX, y: absoluteY }
            });

            content.push({
                absolutePosition: {
                    x: absoluteX + cardDef.padding,
                    y: absoluteY + cardDef.padding
                },
                width: cardDef.contentWidth,
                columns: cardDef.headerColumns,
                columnGap: this.mm(2)
            });

            content.push({
                absolutePosition: {
                    x: absoluteX + cardDef.padding,
                    y: absoluteY + cardDef.bodyOffset
                },
                width: cardDef.contentWidth,
                stack: cardDef.bodyStack
            });

            if (cardDef.footer) {
                content.push({
                    absolutePosition: {
                        x: absoluteX + cardDef.padding,
                        y: absoluteY + cardDef.height - cardDef.padding - cardDef.footerOffset
                    },
                    width: cardDef.contentWidth,
                    text: cardDef.footer.text,
                    fontSize: cardDef.footer.fontSize,
                    color: cardDef.footer.color
                });
            }
        });
        
        return content;
    }

    /**
     * Gera o PDF completo
     * @param {Array<Object>} students - Array de todos os alunos
     * @param {string} filename - Nome do ficheiro (sem extensão)
     */
    async generatePDF(students, filename = 'cartoes-login-1ciclo') {
        // Dividir alunos em páginas de 8 cartões
        const pages = [];
        for (let i = 0; i < students.length; i += this.cardsPerPage) {
            pages.push(students.slice(i, i + this.cardsPerPage));
        }

        // Criar documento pdfmake
        const docDefinition = {
            pageSize: 'A4',
            pageOrientation: 'portrait',
            pageMargins: [0, 0, 0, 0],
            info: {
                title: 'Cartões de Login - 1º Ciclo',
                author: 'Gerador de Cartões',
                subject: 'Cartões de login para alunos do 1º ciclo'
            },
            content: [],
            defaultStyle: {
                font: 'Roboto', // pdfmake default, similar to Poppins
                color: '#000000'
            },
            styles: {
                // Estilos personalizados se necessário
            }
        };

        // Adicionar páginas
        pages.forEach((pageStudents, pageIndex) => {
            if (pageIndex > 0) {
                docDefinition.content.push({ text: '', pageBreak: 'before' });
            }
            
            const pageContent = this.createPageContent(pageStudents);
            docDefinition.content.push(...pageContent);
        });

        // Gerar e fazer download do PDF
        pdfMake.createPdf(docDefinition).download(`${filename}.pdf`);
    }

    /**
     * Abre visualização de impressão nativa com layout em HTML/CSS
     * @param {Array<Object>} students
     */
    openPrintPreview(students) {
        const printWindow = window.open('', '_blank');

        if (!printWindow) {
            alert('Não foi possível abrir a janela de impressão. Verifique bloqueadores de pop-up.');
            return;
        }

        const documentHtml = this.createPrintDocument(students);
        printWindow.document.open('text/html');
        printWindow.document.write(documentHtml);
        printWindow.document.close();
    }

    /**
     * Cria documento HTML completo para impressão direta
     * @param {Array<Object>} students
     * @returns {string}
     */
    createPrintDocument(students) {
        const cardsHtml = students.map(student => this.createPrintCardHTML(student)).join('');

        const pageMargin = this.marginOuter;
        const cardWidth = this.cardWidth;
        const cardHeight = this.cardHeight;
        const gap = this.cardSpacing;
        const headerHeight = this.headerHeight;

        return `<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <title>Cartões de Login - Impressão</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-color: ${this.cardHeaderColor};
            --secondary-color: ${this.cardHeaderSecondaryColor};
            --pill-color: ${this.cardPillColor};
            --surface-color: ${this.cardSurfaceColor};
            --password-chip: ${this.cardPasswordChipColor};
        }
        @page {
            size: A4 portrait;
            margin: ${pageMargin}mm;
        }
        * {
            box-sizing: border-box;
        }
        body {
            margin: 0;
            font-family: 'Poppins', sans-serif;
            background: white;
        }
        .print-wrapper {
            display: grid;
            grid-template-columns: repeat(2, ${cardWidth}mm);
            column-gap: ${gap}mm;
            row-gap: ${gap}mm;
            justify-content: center;
        }
        .print-card {
            width: ${cardWidth}mm;
            height: ${cardHeight}mm;
            border: 0.4mm solid #2d3548;
            display: flex;
            flex-direction: column;
            background: var(--surface-color);
            page-break-inside: avoid;
        }
        .print-card-header {
            background: var(--primary-color);
            color: #ffffff;
            padding: 4mm 5mm;
            display: flex;
            align-items: center;
            gap: 4mm;
            flex-wrap: nowrap;
            min-height: ${headerHeight}mm;
        }
        .print-card-logo img {
            max-height: 14mm;
            max-width: 18mm;
            object-fit: contain;
        }
        .print-card-logo {
            display: flex;
            align-items: center;
            margin-right: 2mm;
        }
        .print-card-name {
            font-size: 11pt;
            font-weight: 600;
            margin-right: 4mm;
            flex: 1;
        }
        .print-card-tag {
            background: var(--pill-color);
            padding: 1.5mm 4mm;
            border-radius: 2mm;
            font-size: 8pt;
            font-weight: 600;
            letter-spacing: 0.08em;
            margin-left: auto;
            white-space: nowrap;
        }
        .print-card-body {
            padding: 5mm;
            flex: 1;
            display: flex;
            flex-direction: column;
        }
        .print-field {
            margin-bottom: 4mm;
        }
        .print-field-label {
            font-size: 7pt;
            font-weight: 600;
            letter-spacing: 0.12em;
            color: #64748b;
            margin-bottom: 1mm;
        }
        .print-field-value {
            font-size: 11pt;
            font-weight: 600;
            color: #1f2937;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .print-password {
            margin-top: 1mm;
            font-size: 11.5pt;
            font-weight: 700;
            color: #ffffff;
            background: var(--password-chip);
            text-align: center;
            padding: 2.5mm 0;
            border-radius: 2mm;
        }
        .print-instructions {
            font-size: 9pt;
            margin-bottom: 6mm;
            color: #1f2937;
        }
        @media print {
            .print-instructions {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="print-instructions">
        <strong>Dicas:</strong> utilize margens padrão, escala 100% e desative cabeçalho/rodapé do navegador antes de imprimir.
    </div>
    <div class="print-wrapper">
        ${cardsHtml}
    </div>
    <script>
        window.addEventListener('load', () => {
            setTimeout(() => {
                try {
                    window.focus();
                    window.print();
                } catch (err) {
                    console.error(err);
                }
            }, 150);
        });
    </script>
</body>
</html>`;
    }

    /**
     * Cria HTML de um cartão individual para a versão de impressão
     * @param {Object} student
     * @returns {string}
     */
    createPrintCardHTML(student) {
        const name = this.escapeHtml(student.displayName || student.Nome || '—');
        const email = this.escapeHtml(student.Email || '—');
        const password = this.escapeHtml(student.Password || '—');
        const turma = student.Turma ? this.escapeHtml(student.Turma) : '';
        const tagHtml = turma ? `<div class="print-card-tag">${turma}</div>` : '';
        const logoHtml = this.logoDataUrl ? `<div class="print-card-logo"><img src="${this.logoDataUrl}" alt="Logotipo" /></div>` : '';

        return `
        <div class="print-card">
            <div class="print-card-header">
                ${logoHtml}
                <div class="print-card-name">${name}</div>
                ${tagHtml}
            </div>
            <div class="print-card-body">
                <div class="print-field">
                    <div class="print-field-label">EMAIL</div>
                    <div class="print-field-value">${email}</div>
                </div>
                <div class="print-field">
                    <div class="print-field-label">PASSWORD</div>
                    <div class="print-password">${password}</div>
                </div>
            </div>
        </div>`;
    }

    /**
     * Cria preview HTML dos cartões da primeira página
     * @param {Array<Object>} students - Array de alunos
     * @returns {string} HTML dos cartões
     */
    createPreviewHTML(students) {
        const firstPageStudents = students.slice(0, this.cardsPerPage);
        
        const cardsHtml = firstPageStudents.map(student => {
            const name = this.escapeHtml(student.displayName || student.Nome || '—');
            const email = this.escapeHtml(student.Email || '—');
            const password = this.escapeHtml(student.Password || '—');
            const turma = this.escapeHtml(student.Turma || '');
            const tagHtml = turma ? `<div class="card-preview-tag">${turma}</div>` : '';
            const logoHtml = this.logoDataUrl ? `<img data-card-logo src="${this.logoDataUrl}" alt="Logotipo" class="card-preview-logo">` : '<img data-card-logo class="card-preview-logo hidden" alt="Logotipo">';
            
            return `
                <div class="card-preview">
                    <div class="card-preview-header">
                        ${logoHtml}
                        <div class="card-preview-name">${name}</div>
                        ${tagHtml}
                    </div>
                    <div class="card-preview-body">
                        <div class="card-preview-field">
                            <span class="card-preview-label">Email</span>
                            <span class="card-preview-value">${email}</span>
                        </div>
                        <div class="card-preview-field">
                            <span class="card-preview-label">Password</span>
                            <span class="card-preview-chip">${password}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        return `<div class="card-preview-grid">${cardsHtml}</div>`;
    }

    /**
     * Escapa HTML para prevenir XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Export para uso em outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CardGenerator;
}

