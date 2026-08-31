const TRANSFERENCIAS_STORAGE_KEY = 'arquivocentral_transferencias';

const initialTransferencias = [
    {
        id: 'TRANSF_1717088400000',
        nomeServidor: 'Carlos Andrade',
        setorRemetente: 'Gabinete do Desembargador X',
        dataTransferencia: '2024-05-30T10:00:00Z',
        status: 'Pendente'
    },
    {
        id: 'TRANSF_1717088500000',
        nomeServidor: 'Lúcia Martins',
        setorRemetente: 'Secretaria de Recursos Humanos',
        dataTransferencia: '2024-05-28T15:30:00Z',
        status: 'Aprovada'
    }
];

document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem(TRANSFERENCIAS_STORAGE_KEY)) {
        localStorage.setItem(TRANSFERENCIAS_STORAGE_KEY, JSON.stringify(initialTransferencias));
    }
    carregarTabelaTransferencias();
});

function carregarTabelaTransferencias() {
    const transferencias = JSON.parse(localStorage.getItem(TRANSFERENCIAS_STORAGE_KEY)) || [];
    const tbody = document.getElementById('tabela-transferencias');
    tbody.innerHTML = '';

    if (transferencias.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="px-4 py-8 text-center text-gray-500">Nenhuma transferência encontrada.</td></tr>`;
        return;
    }

    transferencias.reverse().forEach(transf => {
        let statusBadge = transf.status === 'Pendente' 
            ? `<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">${transf.status}</span>`
            : `<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">${transf.status}</span>`;

        const tr = document.createElement('tr');
        tr.className = "hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group";
        tr.innerHTML = `
            <td class="px-4 py-3 font-medium text-blue-600 dark:text-blue-400">${transf.id}</td>
            <td class="px-4 py-3">${statusBadge}</td>
            <td class="px-4 py-3">${transf.nomeServidor}</td>
            <td class="px-4 py-3">${transf.setorRemetente}</td>
            <td class="px-4 py-3">${new Date(transf.dataTransferencia).toLocaleDateString('pt-BR')}</td>
            <td class="px-4 py-3 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="text-gray-500 hover:text-green-600 mx-1 p-1" title="Aprovar" onclick="aprovarTransferencia('${transf.id}')"><i data-lucide="check-circle" class="h-4 w-4 inline"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    lucide.createIcons();
}

function aprovarTransferencia(id) {
    if(confirm('Tem certeza que deseja aprovar esta transferência e integrar os documentos ao acervo?')) {
        let transferencias = JSON.parse(localStorage.getItem(TRANSFERENCIAS_STORAGE_KEY));
        const index = transferencias.findIndex(t => t.id === id);
        
        if(index > -1 && transferencias[index].status === 'Pendente') {
            transferencias[index].status = 'Aprovada';
            localStorage.setItem(TRANSFERENCIAS_STORAGE_KEY, JSON.stringify(transferencias));
            carregarTabelaTransferencias();
            alert("Transferência aprovada com sucesso!");
        } else {
            alert("Esta transferência já foi processada.");
        }
    }
}