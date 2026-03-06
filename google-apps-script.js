/**
 * Google Apps Script - Web App para receber respostas da prova
 * 
 * INSTRUÇÕES:
 * 1. Abra sua planilha no Google Sheets
 * 2. Vá em Extensões → Apps Script
 * 3. Cole este código
 * 4. Clique em Implantar → Nova implantação → Aplicativo da Web
 * 5. Configure:
 *    - Executar como: Eu
 *    - Quem pode acessar: Qualquer pessoa
 * 6. Copie a URL gerada e cole no arquivo script.js
 */

const GABARITO = ['B', 'C', 'A', 'B', 'C', 'A', 'B', 'C', 'A', 'B'];
const COR_ACERTO_FUNDO = '#dcfce7';
const COR_ACERTO_FONTE = '#166534';
const COR_ERRO_FUNDO = '#fee2e2';
const COR_ERRO_FONTE = '#991b1b';

function obterCoresRespostas(respostas) {
  const backgrounds = respostas.map((resposta, indice) => {
    const acertou = resposta === GABARITO[indice];
    return acertou ? COR_ACERTO_FUNDO : COR_ERRO_FUNDO;
  });

  const fontColors = respostas.map((resposta, indice) => {
    const acertou = resposta === GABARITO[indice];
    return acertou ? COR_ACERTO_FONTE : COR_ERRO_FONTE;
  });

  return { backgrounds, fontColors };
}

function doPost(e) {
  try {
    // Obter a planilha ativa
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Verificar se existe cabeçalho, se não, criar
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Data',
        'Nome',
        'Setor',
        'Q1 - B',
        'Q2 - C',
        'Q3 - A',
        'Q4 - B',
        'Q5 - C',
        'Q6 - A',
        'Q7 - B',
        'Q8 - C',
        'Q9 - A',
        'Q10 - B'
      ]);
      
      // Formatar cabeçalho
      const headerRange = sheet.getRange(1, 1, 1, 13);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#667eea');
      headerRange.setFontColor('#ffffff');
    }
    
    // Parsear os dados recebidos
    const dados = JSON.parse(e.postData.contents);
    
    // Preparar a linha de dados
    const novaLinha = [
      new Date(),           // Data e hora atual
      dados.nome,           // Nome do participante
      dados.setor,          // Setor/Departamento
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
    
    // Formatar a data para o padrão brasileiro
    const ultimaLinha = sheet.getLastRow();
    const celulData = sheet.getRange(ultimaLinha, 1);
    celulData.setNumberFormat('dd/mm/yyyy hh:mm:ss');

    // Corrigir e colorir respostas (Q1..Q10)
    const respostas = [
      dados.q1,
      dados.q2,
      dados.q3,
      dados.q4,
      dados.q5,
      dados.q6,
      dados.q7,
      dados.q8,
      dados.q9,
      dados.q10
    ].map((resposta) => String(resposta || '').trim().toUpperCase());

    const cores = obterCoresRespostas(respostas);

    const rangeRespostas = sheet.getRange(ultimaLinha, 4, 1, 10);
    rangeRespostas
      .setBackgrounds([cores.backgrounds])
      .setFontColors([cores.fontColors])
      .setFontWeight('bold')
      .setHorizontalAlignment('center');
    
    // Auto-ajustar largura das colunas (opcional)
    sheet.autoResizeColumns(1, 13);
    
    // Log de sucesso
    Logger.log(`✅ Prova recebida de: ${dados.nome} - ${dados.setor}`);
    
    // Retornar sucesso
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true,
        message: 'Prova enviada com sucesso!'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log de erro
    Logger.log(`❌ Erro ao processar prova: ${error.toString()}`);
    
    // Retornar erro
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Função para testar o script localmente
 * Execute esta função para verificar se tudo está funcionando
 */
function testarScript() {
  const dadosTeste = {
    postData: {
      contents: JSON.stringify({
        nome: 'João da Silva',
        setor: 'Administrativo',
        q1: 'B',
        q2: 'A',
        q3: 'A',
        q4: 'C',
        q5: 'C',
        q6: 'A',
        q7: 'B',
        q8: 'B',
        q9: 'A',
        q10: 'B'
      })
    }
  };
  
  const resultado = doPost(dadosTeste);
  Logger.log(resultado.getContent());
}

/**
 * Reaplica as cores de acerto/erro em todas as linhas já registradas.
 * Execute manualmente esta função no Apps Script quando precisar recalcular a planilha inteira.
 */
function colorirRespostasExistentes() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const ultimaLinha = sheet.getLastRow();

  if (ultimaLinha < 2) {
    Logger.log('Nenhuma resposta para colorir.');
    return;
  }

  const valores = sheet.getRange(2, 4, ultimaLinha - 1, 10).getValues();

  const backgrounds = valores.map((linha) => {
    const respostas = linha.map((resposta) => String(resposta || '').trim().toUpperCase());
    return obterCoresRespostas(respostas).backgrounds;
  });

  const fontColors = valores.map((linha) => {
    const respostas = linha.map((resposta) => String(resposta || '').trim().toUpperCase());
    return obterCoresRespostas(respostas).fontColors;
  });

  sheet
    .getRange(2, 4, ultimaLinha - 1, 10)
    .setBackgrounds(backgrounds)
    .setFontColors(fontColors)
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  Logger.log('Cores reaplicadas com sucesso para todas as respostas.');
}
