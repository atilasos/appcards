# 🎓 Gerador de Cartões de Login - 1º Ano

Aplicação web multiplataforma para gerar PDFs com cartões de login para alunos do 1º ano do ensino básico.

## ✨ Características

- **Multiplataforma**: Funciona em browsers (Chrome, Firefox, Safari, Edge) e pode ser instalada como app em Windows, macOS, Linux, Android e iPad
- **Interface amigável**: Design colorido e atrativo para crianças de 7 anos
- **Suporte múltiplos formatos**: CSV e Excel (.xlsx)
- **Layout profissional**: 8 cartões por página A4 (95×55mm cada)
- **Pronto para impressão**: Margens corretas, bordas de corte, preto e branco
- **Processamento inteligente**: Desambiguação automática de nomes duplicados
- **Preview em tempo real**: Visualize antes de gerar
- **Totalmente offline**: Funciona sem internet após primeira carga

## 📋 Requisitos do Ficheiro de Entrada

### Formato
- **CSV**: Delimitadores suportados: vírgula, ponto e vírgula ou tabulação
- **Excel**: Formato .xlsx, primeira folha será usada

### Colunas Obrigatórias
O ficheiro deve conter as seguintes informações (os nomes das colunas podem variar):
- **Nome**: Nome completo do aluno
- **Turma**: Identificação da turma (ex: 1ºA, 1ºB)
- **Email**: Endereço de email do aluno
- **Password**: Senha de acesso

### Exemplo de CSV
```csv
Nome,Turma,Email,Password
João Silva Santos,1ºA,joao.silva@escola.pt,abc123
Maria Costa Oliveira,1ºA,maria.costa@escola.pt,def456
Pedro Rodrigues,1ºB,pedro.rodrigues@escola.pt,ghi789
```

### Exemplo de Excel
| Nome | Turma | Email | Password |
|------|-------|-------|----------|
| João Silva Santos | 1ºA | joao.silva@escola.pt | abc123 |
| Maria Costa Oliveira | 1ºA | maria.costa@escola.pt | def456 |
| Pedro Rodrigues | 1ºB | pedro.rodrigues@escola.pt | ghi789 |

## 🚀 Como Usar

### 1. Aceder à Aplicação

#### Opção A: Usar Online
1. Abra o ficheiro `index.html` num browser moderno
2. Ou hospede os ficheiros num servidor web (GitHub Pages, Netlify, Vercel, etc.)

#### Opção B: Instalar como App (PWA)
1. Abra a aplicação no browser
2. No Chrome/Edge: Clique no ícone de instalação na barra de endereço
3. No Safari (iOS): Partilhar → Adicionar ao Ecrã Principal
4. A app funcionará como aplicação nativa

### 2. Carregar Ficheiro
- Arraste o ficheiro CSV ou Excel para a área de upload
- Ou clique para selecionar o ficheiro

### 3. Mapear Colunas
- Selecione qual coluna corresponde a cada informação
- A aplicação tenta detetar automaticamente as colunas corretas

### 4. Processar Dados
- Clique em "Processar Dados"
- Reveja as estatísticas e eventuais erros
- Visualize a pré-visualização da primeira página

### 5. Gerar PDF
- (Opcional) Altere o nome do ficheiro PDF
- Clique em "Gerar PDF"
- O ficheiro será descarregado automaticamente

## 📐 Especificações Técnicas

### Layout dos Cartões
- **Formato**: A4 (210 × 297 mm)
- **Cartões por página**: 8 (2 colunas × 4 linhas)
- **Dimensões do cartão**: ~95 × 55 mm
- **Margens externas**: 10 mm
- **Espaçamento entre cartões**: 5 mm
- **Bordas**: Linhas finas para guiar o corte

### Conteúdo dos Cartões
Cada cartão contém (sem títulos):
1. **Nome do aluno** (maior destaque)
2. **Email** (nunca quebra linha)
3. **Password** (em negrito)
4. **Turma** (discreto, canto inferior direito)

### Processamento de Nomes
- Mostra **Primeiro + Último nome** por padrão
- Se houver duplicados na mesma turma, adiciona nomes intermédios
- Mantém acentos e hífenes
- Remove espaços duplos

### Ordenação
- Primeiro por **Turma** (alfabeticamente)
- Depois por **Último nome** (alfabeticamente)

## 🛠️ Tecnologias Utilizadas

- **HTML5/CSS3**: Interface e design
- **JavaScript ES6+**: Lógica da aplicação
- **Papa Parse**: Parsing de CSV
- **SheetJS (xlsx)**: Leitura de ficheiros Excel
- **pdfMake**: Geração de PDF
- **PWA**: Service Worker para funcionamento offline
- **Google Fonts**: Tipografia Poppins (similar a Century Gothic)

## 📱 Compatibilidade

### Browsers
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

### Sistemas Operativos
- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Linux (Ubuntu, Fedora, etc.)
- ✅ Android 8+
- ✅ iOS/iPadOS 14+

## 🌐 Deploy/Hospedagem

### GitHub Pages
1. Faça upload dos ficheiros para um repositório GitHub
2. Vá a Settings → Pages
3. Selecione a branch main e pasta root
4. A aplicação estará disponível em `https://[username].github.io/[repo]`

### Netlify
1. Arraste a pasta do projeto para [Netlify Drop](https://app.netlify.com/drop)
2. A aplicação estará online imediatamente

### Vercel
```bash
npm install -g vercel
vercel
```

### Servidor Local
Para testar localmente com Python:
```bash
python -m http.server 8000
```
Depois aceda a `http://localhost:8000`

## 🔧 Estrutura de Ficheiros

```
appcards/
├── index.html              # Página principal
├── styles.css              # Estilos e design
├── app.js                  # Aplicação principal
├── name-processor.js       # Processamento de nomes
├── card-generator.js       # Geração de cartões e PDF
├── manifest.json          # Configuração PWA
├── service-worker.js      # Service Worker (offline)
└── README.md              # Documentação
```

## 🐛 Resolução de Problemas

### O PDF não gera
- Verifique se todos os campos obrigatórios estão preenchidos
- Tente com um ficheiro menor primeiro
- Verifique a consola do browser (F12) para erros

### Emails muito longos cortados
- A aplicação reduz automaticamente o tamanho da fonte
- Emails com mais de 50 caracteres podem ser truncados visualmente no preview
- No PDF final, o texto será ajustado para caber

### Nomes duplicados
- A aplicação adiciona automaticamente nomes intermédios
- Se ainda assim forem iguais, usa o nome completo

### App não instala
- Verifique se está a usar HTTPS (ou localhost)
- Alguns browsers mobile requerem interação do utilizador
- Tente atualizar o browser

## 📝 Notas de Desenvolvimento

### Próximas Melhorias Possíveis
- [ ] Suporte para fotos dos alunos
- [ ] Temas personalizáveis
- [ ] Exportação para outros tamanhos de cartão
- [ ] Impressão direta sem gerar PDF
- [ ] Suporte para QR codes
- [ ] Histórico de ficheiros processados

### Contribuições
Este é um projeto educacional. Sugestões e melhorias são bem-vindas!

## 📄 Licença

Este projeto é fornecido como está, para fins educacionais.

## 👨‍💻 Suporte

Para questões ou problemas:
1. Verifique este README
2. Consulte a consola do browser (F12)
3. Teste com ficheiros de exemplo mais simples

---

**Desenvolvido com 💙 para educação - 2025**

