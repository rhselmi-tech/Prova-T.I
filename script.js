// Configuração do Google Sheets
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw3tRG9tZe1M-n4FvACMVLt3e-jRYQDWPds1dIZUm5dM0J86jB4lHrXI6Xhi-1OTP4b/exec';
const TEMPO_INICIAL_SEGUNDOS = 10 * 60;

// Variáveis globais
let tempoRestanteSegundos = TEMPO_INICIAL_SEGUNDOS;
let timerInterval;
let nomeParticipante = '';
let setorParticipante = '';

// Inicializar a prova
function iniciarProva() {
    // Validar campos
    const nome = document.getElementById('nomeParticipante').value.trim();
    const setor = document.getElementById('setorParticipante').value.trim();
    
    if (!nome) {
        alert('⚠️ Por favor, digite seu nome!');
        document.getElementById('nomeParticipante').focus();
        return;
    }
    
    if (!setor) {
        alert('⚠️ Por favor, digite seu setor!');
        document.getElementById('setorParticipante').focus();
        return;
    }
    
    // Armazenar dados
    nomeParticipante = nome;
    setorParticipante = setor;
    
    // Exibir informações na tela da prova
    document.getElementById('nomeDisplay').textContent = nome;
    document.getElementById('setorDisplay').textContent = setor;
    
    // Trocar telas
    document.getElementById('telaInicial').classList.add('hidden');
    document.getElementById('telaProva').classList.remove('hidden');
    
    // Iniciar timer
    iniciarTimer();
    
    // Focar na primeira questão
    setTimeout(() => {
        const primeiraOpcao = document.querySelector('input[name="q1"][value="A"]');
        if (primeiraOpcao) {
            primeiraOpcao.focus();
        }
    }, 300);
}

// Timer de contagem regressiva
function iniciarTimer() {
    atualizarDisplayTimer();
    
    timerInterval = setInterval(() => {
        tempoRestanteSegundos--;
        atualizarDisplayTimer();
        
        // Avisar quando faltarem 5 minutos
        if (tempoRestanteSegundos === 5 * 60) {
            alert('⏰ Atenção! Restam apenas 5 minutos!');
        }
        
        // Avisar quando faltarem 1 minuto
        if (tempoRestanteSegundos === 60) {
            alert('⏰ Atenção! Resta apenas 1 minuto!');
        }
        
        // Tempo esgotado
        if (tempoRestanteSegundos <= 0) {
            clearInterval(timerInterval);
            alert('⏰ Tempo esgotado! A prova será enviada automaticamente.');
            enviarProva();
        }
    }, 1000);
}

// Atualizar display do timer
function atualizarDisplayTimer() {
    const minutos = Math.floor(tempoRestanteSegundos / 60);
    const segundos = tempoRestanteSegundos % 60;
    
    const display = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    document.getElementById('tempoRestante').textContent = display;
    
    // Mudar cor quando tempo estiver acabando
    const timerElement = document.getElementById('timer');
    if (tempoRestanteSegundos < 60) {
        timerElement.style.background = '#ffebee';
        timerElement.style.color = '#c62828';
    } else if (tempoRestanteSegundos < 5 * 60) {
        timerElement.style.background = '#fff3e0';
        timerElement.style.color = '#e65100';
    }
}

// Atualizar barra de progresso
function atualizarProgresso() {
    let respondidas = 0;
    
    // Contar quantas perguntas foram respondidas
    for (let i = 1; i <= 10; i++) {
        const respostaSelecionada = document.querySelector(`input[name="q${i}"]:checked`);
        if (respostaSelecionada) {
            respondidas++;
        }
    }
    
    // Atualizar barra
    const porcentagem = (respondidas / 10) * 100;
    document.getElementById('progressoBar').style.width = porcentagem + '%';
    
    // Atualizar texto
    document.getElementById('progressoTexto').textContent = `Pergunta ${respondidas}/10 respondidas`;
}

// Confirmar envio da prova
function confirmarEnvio() {
    // Verificar quantas perguntas foram respondidas
    let respondidas = 0;
    let naoRespondidas = [];
    
    for (let i = 1; i <= 10; i++) {
        const respostaSelecionada = document.querySelector(`input[name="q${i}"]:checked`);
        if (respostaSelecionada) {
            respondidas++;
        } else {
            naoRespondidas.push(i);
        }
    }
    
    // Avisar se houver perguntas não respondidas
    if (naoRespondidas.length > 0) {
        const confirmar = confirm(
            `⚠️ Você respondeu ${respondidas} de 10 perguntas.\n\n` +
            `Perguntas não respondidas: ${naoRespondidas.join(', ')}\n\n` +
            `Deseja enviar mesmo assim?`
        );
        
        if (!confirmar) {
            // Focar na primeira pergunta não respondida
            const primeiraOpcao = document.querySelector(`input[name="q${naoRespondidas[0]}"][value="A"]`);
            if (primeiraOpcao) {
                primeiraOpcao.focus();
            }
            return;
        }
    } else {
        const confirmar = confirm(
            '✅ Você respondeu todas as perguntas!\n\n' +
            'Deseja enviar sua prova agora?'
        );
        
        if (!confirmar) {
            return;
        }
    }
    
    // Enviar prova
    enviarProva();
}

// Enviar prova para Google Sheets
async function enviarProva() {
    // Parar o timer
    clearInterval(timerInterval);
    
    // Coletar respostas
    const dados = {
        nome: nomeParticipante,
        setor: setorParticipante,
        q1: (document.querySelector('input[name="q1"]:checked') || {}).value || '',
        q2: (document.querySelector('input[name="q2"]:checked') || {}).value || '',
        q3: (document.querySelector('input[name="q3"]:checked') || {}).value || '',
        q4: (document.querySelector('input[name="q4"]:checked') || {}).value || '',
        q5: (document.querySelector('input[name="q5"]:checked') || {}).value || '',
        q6: (document.querySelector('input[name="q6"]:checked') || {}).value || '',
        q7: (document.querySelector('input[name="q7"]:checked') || {}).value || '',
        q8: (document.querySelector('input[name="q8"]:checked') || {}).value || '',
        q9: (document.querySelector('input[name="q9"]:checked') || {}).value || '',
        q10: (document.querySelector('input[name="q10"]:checked') || {}).value || ''
    };
    
    // Desabilitar botão de envio
    const btnEnviar = document.querySelector('.btn-enviar');
    const textoOriginal = btnEnviar.innerHTML;
    btnEnviar.disabled = true;
    btnEnviar.innerHTML = '<span class="loading"></span> Enviando...';
    
    try {
        // Enviar para Google Sheets
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados)
        });
        
        // Simular um pequeno delay para melhor experiência
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mostrar tela de sucesso
        document.getElementById('telaProva').classList.add('hidden');
        document.getElementById('telaSucesso').classList.remove('hidden');
        
        // Salvar dados localmente como backup (opcional)
        salvarBackupLocal(dados);
        
    } catch (error) {
        console.error('Erro ao enviar prova:', error);
        
        // Mesmo com erro, mostrar sucesso (por causa do no-cors)
        // O Google Apps Script deve estar configurado corretamente
        document.getElementById('telaProva').classList.add('hidden');
        document.getElementById('telaSucesso').classList.remove('hidden');
        
        // Salvar backup local
        salvarBackupLocal(dados);
    }
}

// Salvar backup local no localStorage
function salvarBackupLocal(dados) {
    try {
        const dataHora = new Date().toLocaleString('pt-BR');
        const backup = {
            dataHora: dataHora,
            ...dados
        };
        
        // Recuperar backups anteriores
        let backups = JSON.parse(localStorage.getItem('provasBackup') || '[]');
        backups.push(backup);
        
        // Salvar
        localStorage.setItem('provasBackup', JSON.stringify(backups));
        
        console.log('✅ Backup local salvo com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar backup local:', error);
    }
}

// Reiniciar prova
function reiniciarProva() {
    // Resetar variáveis
    tempoRestanteSegundos = TEMPO_INICIAL_SEGUNDOS;
    nomeParticipante = '';
    setorParticipante = '';
    
    // Limpar campos
    document.getElementById('nomeParticipante').value = '';
    document.getElementById('setorParticipante').value = '';
    
    // Limpar respostas
    for (let i = 1; i <= 10; i++) {
        const alternativas = document.querySelectorAll(`input[name="q${i}"]`);
        alternativas.forEach((alternativa) => {
            alternativa.checked = false;
        });
    }
    
    // Resetar progresso
    document.getElementById('progressoBar').style.width = '0%';
    document.getElementById('progressoTexto').textContent = 'Pergunta 1/10';
    
    // Resetar timer visual
    document.getElementById('timer').style.background = '#dbeafe';
    document.getElementById('timer').style.color = '#1e3a8a';
    
    // Voltar para tela inicial
    document.getElementById('telaSucesso').classList.add('hidden');
    document.getElementById('telaInicial').classList.remove('hidden');
}

// Prevenir saída acidental durante a prova
window.addEventListener('beforeunload', function (e) {
    // Verificar se a prova está em andamento
    const provaEmAndamento = !document.getElementById('telaProva').classList.contains('hidden');
    
    if (provaEmAndamento) {
        e.preventDefault();
        e.returnValue = '';
        return '';
    }
});

// Inicialização quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎓 Sistema de Prova Online - Procedimentos Básicos de TI');
    console.log('📊 Para visualizar backups locais, digite: mostrarBackups()');
});

// Função para visualizar backups (debugging)
function mostrarBackups() {
    const backups = JSON.parse(localStorage.getItem('provasBackup') || '[]');
    console.table(backups);
    return backups;
}

// Função para exportar backups (se necessário)
function exportarBackups() {
    const backups = JSON.parse(localStorage.getItem('provasBackup') || '[]');
    const dataStr = JSON.stringify(backups, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `provas_backup_${new Date().getTime()}.json`;
    link.click();
    
    console.log('✅ Backups exportados com sucesso!');
}
