# 📋 Mini Prova - Procedimentos Básicos de TI

Sistema de prova online simples para avaliar conhecimentos básicos de suporte de TI.

## 🚀 Funcionalidades

✅ **Tela inicial** com campos de identificação (nome e setor)  
✅ **10 perguntas dissertativas** sobre suporte de TI  
✅ **Timer de 15 minutos** com contagem regressiva  
✅ **Barra de progresso** mostrando perguntas respondidas  
✅ **Validação** antes do envio  
✅ **Integração com Google Sheets** para armazenar respostas  
✅ **Backup local** no navegador (localStorage)  
✅ **Layout responsivo** para desktop e mobile  
✅ **Animações suaves** e design moderno  

## 📁 Estrutura dos Arquivos

```
IntegraçãoTI/
├── index.html       # Estrutura HTML da prova
├── style.css        # Estilos e responsividade
├── script.js        # Lógica e funcionalidades
└── README.md        # Este arquivo
```

## ⚙️ Configuração do Google Sheets

### Passo 1: Criar a Planilha

1. Acesse [Google Sheets](https://sheets.google.com)
2. Crie uma nova planilha
3. Nomeie como "Respostas - Prova TI"
4. Na primeira linha, adicione os cabeçalhos:

```
Data | Nome | Setor | Q1 | Q2 | Q3 | Q4 | Q5 | Q6 | Q7 | Q8 | Q9 | Q10
```

### Passo 2: Criar o Script do Google Apps Script

1. Na planilha, vá em **Extensões** → **Apps Script**
2. Apague o código padrão
3. Cole o seguinte código:

```javascript
function doPost(e) {
  try {
    // Obter a planilha ativa
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parsear os dados recebidos
    const dados = JSON.parse(e.postData.contents);
    
    // Preparar a linha de dados
    const novaLinha = [
      new Date(),           // Data e hora
      dados.nome,           // Nome
      dados.setor,          // Setor
      dados.q1,             // Resposta 1
      dados.q2,             // Resposta 2
      dados.q3,             // Resposta 3
      dados.q4,             // Resposta 4
      dados.q5,             // Resposta 5
      dados.q6,             // Resposta 6
      dados.q7,             // Resposta 7
      dados.q8,             // Resposta 8
      dados.q9,             // Resposta 9
      dados.q10             // Resposta 10
    ];
    
    // Adicionar a linha na planilha
    sheet.appendRow(novaLinha);
    
    // Retornar sucesso
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Retornar erro
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Passo 3: Implantar como Web App

1. Clique em **Implantar** → **Nova implantação**
2. Clique no ícone de engrenagem ⚙️ e selecione **Aplicativo da Web**
3. Configure:
   - **Descrição**: "API para receber respostas da prova"
   - **Executar como**: "Eu" (sua conta)
   - **Quem pode acessar**: "Qualquer pessoa"
4. Clique em **Implantar**
5. **Copie a URL** fornecida (algo como: `https://script.google.com/macros/s/ABC123.../exec`)
6. Cole esta URL no arquivo **script.js**, linha 2:

```javascript
const GOOGLE_SCRIPT_URL = 'COLE_SUA_URL_AQUI';
```

## 🖥️ Como Usar

### Para aplicar a prova:

1. Abra o arquivo `index.html` em um navegador
2. Preencha nome e setor
3. Clique em "Iniciar Prova"
4. Responda às 10 perguntas
5. Clique em "Enviar Prova"

### Para visualizar respostas:

1. Acesse sua planilha no Google Sheets
2. As respostas aparecerão automaticamente
3. Você pode exportar para Excel ou fazer análises

## 🔧 Personalização

### Alterar tempo da prova

No arquivo `script.js`, linha 5:

```javascript
let tempoRestanteSegundos = 15 * 60; // 15 minutos
// Altere para: 20 * 60 (20 minutos) ou 30 * 60 (30 minutos)
```

### Alterar cores

No arquivo `style.css`, altere o gradiente:

```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
/* Experimente outras cores */
```

### Adicionar/Remover perguntas

1. Em `index.html`: adicione/remova blocos `<div class="questao">`
2. Em `script.js`: ajuste os loops `for (let i = 1; i <= 10; i++)` para o número correto
3. No Google Apps Script: ajuste os campos correspondentes

## 📱 Compatibilidade

✅ Chrome, Firefox, Edge, Safari  
✅ Desktop e Mobile  
✅ Tablets  

## 🔒 Segurança e Privacidade

- ✅ Backup local automático no navegador
- ✅ Prevenção de saída acidental durante a prova
- ✅ Validação de campos obrigatórios
- ⚠️ Para uso interno/educacional

## 🛠️ Recursos Extras

### Visualizar backups locais

No console do navegador (F12):

```javascript
mostrarBackups()  // Ver todos os backups
exportarBackups() // Baixar backups em JSON
```

### Limpar backups

```javascript
localStorage.removeItem('provasBackup')
```

## 📞 Suporte

Para dúvidas sobre configuração ou uso, consulte a documentação:
- [Google Apps Script](https://developers.google.com/apps-script)
- [Google Sheets API](https://developers.google.com/sheets/api)

## 📄 Licença

Livre para uso educacional e interno.

---

**Desenvolvido para treinamento de suporte básico de TI** 🖥️
