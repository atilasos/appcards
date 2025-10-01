/**
 * Aplicação Principal
 * Coordena upload, parsing, processamento e geração de PDF
 */

class App {
    constructor() {
        this.rawData = null;
        this.processedStudents = null;
        this.cardGenerator = new CardGenerator();
        this.logoDataUrl = null;
        
        this.initializeEventListeners();
    }

    /**
     * Inicializa event listeners
     */
    initializeEventListeners() {
        // Upload area
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('file-input');
        
        uploadArea.addEventListener('click', () => fileInput.click());
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file) this.handleFileUpload(file);
        });
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) this.handleFileUpload(file);
        });

        // Process button
        document.getElementById('process-btn').addEventListener('click', () => {
            this.processData();
        });

        // Generate PDF button
        document.getElementById('generate-btn').addEventListener('click', () => {
            this.generatePDF();
        });

        // Print button
        document.getElementById('print-btn').addEventListener('click', () => {
            this.openPrintPreview();
        });

        // Logo upload
        const logoInput = document.getElementById('logo-input');
        logoInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) {
                this.logoDataUrl = null;
                this.cardGenerator.setLogo(null);
                this.showLogoPreview(null);
                if (this.processedStudents) {
                    this.showPreview();
                }
                return;
            }

            if (!file.type.startsWith('image/')) {
                alert('Por favor selecione um ficheiro de imagem (PNG, SVG, JPG).');
                logoInput.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                this.logoDataUrl = e.target.result;
                this.cardGenerator.setLogo(this.logoDataUrl);
                this.showLogoPreview(this.logoDataUrl);
                if (this.processedStudents) {
                    this.showPreview();
                }
            };
            reader.onerror = () => {
                alert('Não foi possível ler o logotipo.');
                logoInput.value = '';
                this.logoDataUrl = null;
                this.cardGenerator.setLogo(null);
                this.showLogoPreview(null);
                if (this.processedStudents) {
                    this.showPreview();
                }
            };
            reader.readAsDataURL(file);
        });

        // Reset button
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.reset();
        });
    }

    /**
     * Mostra/esconde loading overlay
     */
    showLoading(show = true) {
        const loading = document.getElementById('loading');
        if (show) {
            loading.classList.remove('hidden');
        } else {
            loading.classList.add('hidden');
        }
    }

    /**
     * Handle file upload
     */
    async handleFileUpload(file) {
        this.showLoading(true);
        
        try {
            const fileName = file.name.toLowerCase();
            let data;
            
            if (fileName.endsWith('.csv')) {
                data = await this.parseCSV(file);
            } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
                data = await this.parseExcel(file);
            } else {
                throw new Error('Formato de ficheiro não suportado. Use CSV ou Excel (.xlsx)');
            }
            
            this.rawData = data;
            this.showFileInfo(file, data);
            this.setupColumnMapping(data);
            
        } catch (error) {
            alert('Erro ao carregar ficheiro: ' + error.message);
            console.error(error);
        } finally {
            this.showLoading(false);
        }
    }

    /**
     * Parse CSV file
     */
    parseCSV(file) {
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                encoding: 'UTF-8',
                complete: (results) => {
                    if (results.errors.length > 0) {
                        console.warn('CSV parsing warnings:', results.errors);
                    }
                    resolve(results.data);
                },
                error: (error) => reject(error)
            });
        });
    }

    /**
     * Parse Excel file
     */
    parseExcel(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    
                    // Usar primeira folha
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });
                    
                    resolve(jsonData);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('Erro ao ler ficheiro Excel'));
            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * Mostra informação do ficheiro carregado
     */
    showFileInfo(file, data) {
        const fileInfo = document.getElementById('file-info');
        fileInfo.innerHTML = `
            <strong>✅ Ficheiro carregado:</strong> ${file.name}<br>
            <strong>Linhas encontradas:</strong> ${data.length}
        `;
        fileInfo.classList.remove('hidden');
    }

    /**
     * Setup column mapping
     */
    setupColumnMapping(data) {
        if (data.length === 0) {
            alert('Ficheiro vazio!');
            return;
        }
        
        // Obter colunas do ficheiro
        const columns = Object.keys(data[0]);
        
        // Preencher selects
        const selects = ['col-nome', 'col-turma', 'col-email', 'col-password'];
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            select.innerHTML = '<option value="">-- Selecione --</option>';
            
            columns.forEach(col => {
                const option = document.createElement('option');
                option.value = col;
                option.textContent = col;
                select.appendChild(option);
            });
            
            // Auto-detect comum
            const autoMap = {
                'col-nome': ['nome', 'name', 'aluno', 'student'],
                'col-turma': ['turma', 'class', 'classe'],
                'col-email': ['email', 'e-mail', 'mail'],
                'col-password': ['password', 'senha', 'pass', 'pwd']
            };
            
            if (autoMap[selectId]) {
                const match = columns.find(col => 
                    autoMap[selectId].some(term => 
                        col.toLowerCase().includes(term)
                    )
                );
                if (match) select.value = match;
            }
        });
        
        // Mostrar seção de mapeamento
        document.getElementById('mapping-section').classList.remove('hidden');
    }

    /**
     * Processa dados com mapeamento de colunas
     */
    processData() {
        this.showLoading(true);
        
        try {
            // Obter mapeamento de colunas
            const colNome = document.getElementById('col-nome').value;
            const colTurma = document.getElementById('col-turma').value;
            const colEmail = document.getElementById('col-email').value;
            const colPassword = document.getElementById('col-password').value;
            
            if (!colNome || !colTurma || !colEmail || !colPassword) {
                alert('Por favor, selecione todas as colunas necessárias!');
                this.showLoading(false);
                return;
            }
            
            // Mapear dados
            const mappedData = this.rawData.map((row, index) => ({
                Nome: String(row[colNome] || '').trim(),
                Turma: String(row[colTurma] || '').trim(),
                Email: String(row[colEmail] || '').trim(),
                Password: String(row[colPassword] || '').trim(),
                _originalIndex: index + 2 // +2 porque linha 1 é cabeçalho
            }));
            
            // Validar dados
            const validation = this.validateData(mappedData);
            
            if (validation.errors.length > 0) {
                this.showErrors(validation.errors);
            }
            
            // Filtrar linhas válidas
            const validData = mappedData.filter(row => 
                row.Nome && row.Turma && row.Email && row.Password
            );
            
            if (validData.length === 0) {
                alert('Nenhum dado válido encontrado!');
                this.showLoading(false);
                return;
            }
            
            // Processar nomes e desambiguar
            const processed = NameProcessor.processStudents(validData);
            
            // Ordenar por turma e último nome
            this.processedStudents = NameProcessor.sortStudents(processed);
            
            // Mostrar estatísticas
            this.showStats(validation, validData.length);
            
            // Mostrar preview
            this.showPreview();
            
            // Mostrar seção de preview
            document.getElementById('preview-section').classList.remove('hidden');
            
            // Scroll para preview
            document.getElementById('preview-section').scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            
        } catch (error) {
            alert('Erro ao processar dados: ' + error.message);
            console.error(error);
        } finally {
            this.showLoading(false);
        }
    }

    /**
     * Valida dados dos alunos
     */
    validateData(data) {
        const errors = [];
        
        data.forEach((row, index) => {
            const issues = [];
            
            if (!row.Nome || row.Nome.length === 0) issues.push('Nome vazio');
            if (!row.Turma || row.Turma.length === 0) issues.push('Turma vazia');
            if (!row.Email || row.Email.length === 0) issues.push('Email vazio');
            if (!row.Password || row.Password.length === 0) issues.push('Password vazia');
            
            if (issues.length > 0) {
                errors.push({
                    line: row._originalIndex,
                    issues: issues,
                    data: row
                });
            }
        });
        
        return { errors, total: data.length };
    }

    /**
     * Mostra erros de validação
     */
    showErrors(errors) {
        const errorBox = document.getElementById('errors');
        
        if (errors.length === 0) {
            errorBox.classList.add('hidden');
            return;
        }
        
        const maxShow = 5;
        let html = `<h4>⚠️ Problemas encontrados (${errors.length})</h4>`;
        html += '<ul style="margin-left: 20px;">';
        
        errors.slice(0, maxShow).forEach(error => {
            html += `<li>Linha ${error.line}: ${error.issues.join(', ')}</li>`;
        });
        
        if (errors.length > maxShow) {
            html += `<li><em>... e mais ${errors.length - maxShow} problemas</em></li>`;
        }
        
        html += '</ul>';
        html += '<p><small>Estas linhas serão ignoradas.</small></p>';
        
        errorBox.innerHTML = html;
        errorBox.classList.remove('hidden');
    }

    /**
     * Mostra estatísticas
     */
    showStats(validation, validCount) {
        const stats = document.getElementById('stats');
        
        const totalPages = Math.ceil(validCount / 8);
        const turmas = [...new Set(this.processedStudents.map(s => s.Turma))];
        
        stats.innerHTML = `
            <span>📊 Total de alunos válidos: <strong>${validCount}</strong></span>
            <span>📄 Páginas: <strong>${totalPages}</strong></span>
            <span>🏫 Turmas: <strong>${turmas.length}</strong> (${turmas.join(', ')})</span>
            ${validation.errors.length > 0 ? `<span style="color: #d32f2f;">⚠️ Linhas com erros: <strong>${validation.errors.length}</strong></span>` : ''}
        `;
    }

    /**
     * Mostra preview dos cartões
     */
    showPreview() {
        const preview = document.getElementById('preview');
        preview.innerHTML = this.cardGenerator.createPreviewHTML(this.processedStudents);
        this.updatePreviewLogos(preview);
    }

    /**
     * Gera PDF final
     */
    generatePDF() {
        this.showLoading(true);
        
        setTimeout(() => {
            try {
                const filename = document.getElementById('pdf-filename').value || 'cartoes-login-1ciclo';
                this.cardGenerator.generatePDF(this.processedStudents, filename);
                
                alert('✅ PDF gerado com sucesso! O download deve começar automaticamente.');
            } catch (error) {
                alert('Erro ao gerar PDF: ' + error.message);
                console.error(error);
            } finally {
                this.showLoading(false);
            }
        }, 100);
    }

    /**
     * Abre visualização de impressão nativa do browser
     */
    openPrintPreview() {
        if (!this.processedStudents || this.processedStudents.length === 0) {
            alert('É necessário processar os dados antes de imprimir.');
            return;
        }

        try {
            this.cardGenerator.openPrintPreview(this.processedStudents);
        } catch (error) {
            alert('Erro ao abrir impressão: ' + error.message);
            console.error(error);
        }
    }

    /**
     * Mostra uma miniatura do logo carregado
     */
    showLogoPreview(dataUrl) {
        let preview = document.getElementById('logo-preview');
        if (!preview) {
            preview = document.createElement('div');
            preview.id = 'logo-preview';
            preview.className = 'logo-preview hidden';
            const logoOptions = document.querySelector('.logo-options');
            if (logoOptions) {
                logoOptions.appendChild(preview);
            }
        }

        if (!dataUrl) {
            preview.innerHTML = '';
            preview.classList.add('hidden');
            return;
        }

        preview.innerHTML = `<img src="${dataUrl}" alt="Logotipo" />`;
        preview.classList.remove('hidden');
    }

    /**
     * Atualiza logos na pré-visualização
     */
    updatePreviewLogos(container) {
        const logoUrl = this.logoDataUrl;
        container.querySelectorAll('[data-card-logo]').forEach(node => {
            if (logoUrl) {
                node.src = logoUrl;
                node.classList.remove('hidden');
            } else {
                node.src = '';
                node.classList.add('hidden');
            }
        });
    }

    /**
     * Reset da aplicação
     */
    reset() {
        if (confirm('Deseja recomeçar? Todos os dados atuais serão perdidos.')) {
            location.reload();
        }
    }
}

// Inicializar aplicação quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new App();
});

// Service Worker para PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(reg => console.log('Service Worker registrado'))
            .catch(err => console.log('Service Worker erro:', err));
    });
}

