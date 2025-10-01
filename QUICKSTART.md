# 🚀 Quick Start - Começar em 5 Minutos

## 1️⃣ Abrir a Aplicação

### Localmente
- Faça duplo-clique em `index.html`
- Ou arraste o ficheiro para o browser

### Com Servidor Local (Recomendado para PWA)

**Python 3:**
```bash
python -m http.server 8000
```
Depois abra: `http://localhost:8000`

**Node.js:**
```bash
npx http-server
```

**PHP:**
```bash
php -S localhost:8000
```

## 2️⃣ Testar com Dados de Exemplo

1. **Carregar ficheiro**: Use o `exemplo-alunos.csv` incluído
2. **Mapear colunas**: As colunas já estarão mapeadas automaticamente
3. **Processar**: Clique em "Processar Dados"
4. **Ver preview**: Veja a pré-visualização dos cartões
5. **Gerar PDF**: Clique em "Gerar PDF"
6. **Abrir PDF**: O ficheiro será descarregado automaticamente

✅ **Funcionou?** Ótimo! Agora use os seus próprios dados.

## 3️⃣ Usar os Seus Dados

### Preparar o Ficheiro

**Formato CSV** (mais simples):
```csv
Nome,Turma,Email,Password
João Silva,1ºA,joao@escola.pt,abc123
Maria Costa,1ºB,maria@escola.pt,def456
```

**Formato Excel** (.xlsx):
- Crie uma folha com as colunas: Nome, Turma, Email, Password
- Preencha os dados
- Guarde como .xlsx

### Campos Obrigatórios
- ✅ **Nome**: Nome completo (ex: João Pedro Silva)
- ✅ **Turma**: Código da turma (ex: 1ºA, 2ºB)
- ✅ **Email**: Email completo (ex: aluno@escola.pt)
- ✅ **Password**: Senha (ex: abc123)

### Dicas
- Use **UTF-8** para caracteres especiais (á, é, ç, etc.)
- Evite **linhas vazias** no meio dos dados
- **Primeira linha** deve ser o cabeçalho
- Sem **limite** de alunos (a app divide em páginas)

## 4️⃣ Imprimir os Cartões

1. **Abra o PDF** gerado
2. **Imprima**:
   - Papel: **A4**
   - Escala: **100%** (real size)
   - Cor: **Preto e branco** ou cores (funciona em ambos)
   - Qualidade: **Normal ou Alta**
3. **Corte** seguindo as linhas de borda
4. **Plastifique** (opcional, recomendado)

### Dimensões
- Cada cartão: **~95 × 55 mm**
- 8 cartões por página
- Prontos para plastificação padrão

## 5️⃣ Instalar como App (Opcional)

### Vantagens
- ✨ Ícone no ambiente de trabalho
- 🚀 Mais rápido
- 📱 Funciona offline
- 💾 Não ocupa espaço no disco

### Como Instalar

**No Computador (Chrome/Edge):**
1. Abra a aplicação
2. Clique no ícone ➕ na barra de endereço
3. Clique "Instalar"

**No Telemóvel/Tablet:**
1. Abra no browser
2. Menu → "Adicionar ao ecrã inicial"

📖 **Mais detalhes:** Ver `INSTALL.md`

## ❓ Problemas Comuns

### O ficheiro não carrega
- ✅ Verifique se é CSV ou .xlsx
- ✅ Confirme que tem cabeçalho na primeira linha
- ✅ Teste com o `exemplo-alunos.csv`

### Nomes aparecem estranhos
- ✅ Use UTF-8 no CSV
- ✅ Abra o Excel, "Guardar Como" → escolha UTF-8

### PDF não gera
- ✅ Verifique se todos os campos estão mapeados
- ✅ Veja se há erros na área de estatísticas
- ✅ Tente com menos alunos primeiro

### Emails muito longos
- ✅ A app ajusta automaticamente o tamanho
- ✅ No PDF ficará legível (mesmo se longo)

## 📚 Mais Informações

- 📖 **Manual Completo**: `README.md`
- 🎨 **Gerar Ícones**: `ICONES.md`
- 📱 **Guia de Instalação**: `INSTALL.md`

## 💡 Dicas Profissionais

1. **Teste primeiro** com 3-4 alunos
2. **Guarde o CSV** original como backup
3. **Use nomes consistentes** nas turmas (ex: sempre "1ºA" e não às vezes "1A")
4. **Reveja o preview** antes de gerar o PDF completo
5. **Imprima uma página teste** antes de imprimir tudo

## 🎯 Próximos Passos

✅ Testou com dados de exemplo?
✅ Gerou PDF com sucesso?
✅ Imprimiu uma página teste?

**Perfeito!** Agora pode processar turmas completas.

---

**Tempo total**: ~5 minutos ⏱️
**Dificuldade**: Muito fácil 😊
**Custo**: Grátis 💰

Bom trabalho! 🎓

