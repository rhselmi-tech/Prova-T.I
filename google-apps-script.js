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
        'Q1 - Verificar quando internet não funciona',
        'Q2 - Procedimento com cabo de rede',
        'Q3 - Verificar erros na impressora',
        'Q4 - Documento preso na fila',
        'Q5 - Identificar problema de rede da impressora',
        'Q6 - Papel preso na impressora',
        'Q7 - Impressão frente e verso',
        'Q8 - Trocar toner',
        'Q9 - Portas da impressora',
        'Q10 - Procedimentos antes de chamar o TI'
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
        q1: 'Verificar a conexão com a internet e conferir os cabos de rede.',
        q2: 'Retirar e conectar novamente o cabo de rede.',
        q3: 'Na tela da impressora para identificar mensagens de erro.',
        q4: 'Acessar a fila de impressão e cancelar ou reiniciar o documento.',
        q5: 'Verificar se a impressora está conectada à rede e testando o ping.',
        q6: 'Abrir a impressora cuidadosamente e remover o papel preso.',
        q7: 'Para economizar papel imprimindo nos dois lados da folha.',
        q8: 'Trocar o cartucho de toner quando a impressão estiver fraca ou com mensagem de toner baixo.',
        q9: 'São as diferentes bandejas de alimentação de papel da impressora.',
        q10: 'Verificar cabos, reiniciar equipamentos, conferir conexões básicas.'
      })
    }
  };
  
  const resultado = doPost(dadosTeste);
  Logger.log(resultado.getContent());
}
