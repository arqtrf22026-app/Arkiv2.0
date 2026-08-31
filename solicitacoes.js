const SOLICITACOES_STORAGE_KEY = 'arquivocentral_solicitacoes';

const initialSolicitacoes = [
  { id: "SOL001", tipo: "Empréstimo", numeroSolicitacao: "SOL-2024-001", nomeSolicitante: "João Silva", setorSolicitante: "Gab. Des. A", dataSolicitacao: "2024-03-01T10:00:00Z", documentoIds: ["DOC001"], status: "Pendente" },
  { id: "SOL002", tipo: "Desarquivamento", numeroSolicitacao: "SOL-2024-002", nomeSolicitante: "Maria Oliveira", setorSolicitante: "Vara Federal 1", dataSolicitacao: "2024-03-05T10:00:00Z", dataAtendimento: "2024-03-06T10:00:00Z", documentoIds: ["DOC002"], status: "Atendida" },
  { id: "SOL003", tipo: "Empréstimo", numeroSolicitacao: "SOL-2024-003", nomeSolicitante: "Carlos Pereira", setorSolicitante: "Secretaria", dataSolicitacao: "2024-03-10T10:00:00Z", dataAtendimento: "2024-03-11T10:00:00Z", dataDevolucao: "2024-03-20T10:00:00Z", documentoIds: ["DOC003"], status: "Devolvido" },
];

document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem(SOLICITACOES_STORAGE_KEY)) {
        localStorage.setItem(SOLICITACOES_STORAGE_KEY, JSON.stringify(initialSolicitacoes));
    }
    carregarTabelaSolicitacoes();
});

function carregarTabelaSolicitacoes() {
    const solicitacoes = JSON.parse(localStorage.getItem(SOLICITACOES_STORAGE_KEY)) || [];
    const tbody = document.getElementById('tabela-solicitacoes');
    tbody.innerHTML = '';

    if (solicitacoes.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="px-4 py-8 text-center text-gray-500">Nenhuma solicitação encontrada.</td></tr>`;
        return;
    }

    solicitacoes.reverse().forEach(sol => {
        let statusBadge = '';
        if (sol.status === 'Pendente') statusBadge = `<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">${sol.status}</span>`;
        else if (sol.status === 'Atendida') statusBadge = `<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">${sol.status}</span>`;
        else if (sol.status === 'Devolvido') statusBadge = `<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold border border-gray-300 text-gray-800 dark:border-gray-500 dark:text-gray-300">${sol.status}</span>`;

        // Botões de ação dinâmicos dependendo do status
        let acoes = `<button class="text-gray-500 hover:text-blue-600 mx-1 p-1" title="Ver Detalhes"><i data-lucide="eye" class="h-4 w-4 inline"></i></button>`;
        if (sol.status === 'Pendente') {
            acoes += `<button class="text-gray-500 hover:text-green-600 mx-1 p-1" onclick="tramitarSolicitacao('${sol.id}', 'Atendida')" title="Marcar como Atendida"><i data-lucide="check" class="h-4 w-4 inline"></i></button>`;
        } else if (sol.status === 'Atendida' && sol.tipo === 'Empréstimo') {
            acoes += `<button class="text-gray-500 hover:text-purple-600 mx-1 p-1" onclick="tramitarSolicitacao('${sol.id}', 'Devolvido')" title="Registrar Devolução"><i data-lucide="corner-down-left" class="h-4 w-4 inline"></i></button>`;
        }

        const tr = document.createElement('tr');
        tr.className = "hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group";
        tr.innerHTML = `
            <td class="px-4 py-3 font-medium text-blue-600 dark:text-blue-400">${sol.numeroSolicitacao}</td>
            <td class="px-4 py-3">${statusBadge}</td>
            <td class="px-4 py-3">${sol.tipo}</td>
            <td class="px-4 py-3">${sol.nomeSolicitante}</td>
            <td class="px-4 py-3">${sol.setorSolicitante}</td>
            <td class="px-4 py-3">${new Date(sol.dataSolicitacao).toLocaleDateString('pt-BR')}</td>
            <td class="px-4 py-3 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                ${acoes}
            </td>
        `;
        tbody.appendChild(tr);
    });
    lucide.createIcons();
}

function tramitarSolicitacao(id, novoStatus) {
    let msg = novoStatus === 'Atendida' ? "Confirmar atendimento e entregar documento(s) ao solicitante?" : "Confirmar devolução do documento ao arquivo?";
    
    if(confirm(msg)) {
        let solicitacoes = JSON.parse(localStorage.getItem(SOLICITACOES_STORAGE_KEY));
        const index = solicitacoes.findIndex(s => s.id === id);
        
        if (index > -1) {
            solicitacoes[index].status = novoStatus;
            
            if (novoStatus === 'Atendida') {
                solicitacoes[index].dataAtendimento = new Date().toISOString();
            } else if (novoStatus === 'Devolvido') {
                solicitacoes[index].dataDevolucao = new Date().toISOString();
            }

            localStorage.setItem(SOLICITACOES_STORAGE_KEY, JSON.stringify(solicitacoes));
            carregarTabelaSolicitacoes();
        }
    }
}