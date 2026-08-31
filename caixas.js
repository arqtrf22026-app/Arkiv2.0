const CAIXAS_STORAGE_KEY = 'arquivocentral_caixas';

const initialCaixas = [
  { id: "CX001", codigoCaixa: "CX-A-001", descricao: "Caixa de processos judiciais antigos", tipo: "JUD", status: "Fechada", situacao: "Completa", local: "Sede - Arquivo Central - Estante 1" },
  { id: "CX002", codigoCaixa: "CX-B-015", descricao: "Documentos administrativos SIGA", tipo: "ADM", status: "Aberta", situacao: "Incompleta", local: "Sede - Arquivo Central - Estante 2" },
  { id: "CX003", codigoCaixa: "PST-X-007", descricao: "Pastas de documentos diversos", tipo: "Pasta", status: "Aberta", situacao: "Completa", local: "Sede - Arquivo Corrente" },
];

document.addEventListener("DOMContentLoaded", () => {
    if (!localStorage.getItem(CAIXAS_STORAGE_KEY)) {
        localStorage.setItem(CAIXAS_STORAGE_KEY, JSON.stringify(initialCaixas));
    }
    carregarTabelaCaixas();
});

function carregarTabelaCaixas() {
    const caixas = JSON.parse(localStorage.getItem(CAIXAS_STORAGE_KEY)) || [];
    const tbody = document.getElementById('tabela-caixas');
    tbody.innerHTML = '';

    if (caixas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="px-4 py-8 text-center text-gray-500">Nenhuma caixa encontrada.</td></tr>`;
        return;
    }

    caixas.reverse().forEach(caixa => {
        let statusBadge = caixa.status === 'Fechada' 
            ? `<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300">${caixa.status}</span>`
            : `<span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">${caixa.status}</span>`;

        const tr = document.createElement('tr');
        tr.className = "hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group";
        tr.innerHTML = `
            <td class="px-4 py-3 font-medium text-blue-600 dark:text-blue-400 cursor-pointer hover:underline" onclick="abrirModalCaixa('${caixa.id}')">${caixa.codigoCaixa}</td>
            <td class="px-4 py-3">${statusBadge}</td>
            <td class="px-4 py-3">${caixa.tipo}</td>
            <td class="px-4 py-3">${caixa.situacao}</td>
            <td class="px-4 py-3">${caixa.local || 'N/A'}</td>
            <td class="px-4 py-3 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="text-gray-500 hover:text-blue-600 mx-1 p-1 rounded" onclick="abrirModalCaixa('${caixa.id}')"><i data-lucide="edit" class="h-4 w-4"></i></button>
                <button class="text-gray-500 hover:text-red-600 mx-1 p-1 rounded" onclick="excluirCaixa('${caixa.id}')"><i data-lucide="trash-2" class="h-4 w-4"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    lucide.createIcons();
}

function abrirModalCaixa(id = null) {
    document.getElementById('modal-caixa').classList.remove('hidden');
    
    // Limpa o formulário
    document.getElementById('form-id').value = '';
    document.getElementById('form-codigo').value = '';
    document.getElementById('form-tipo').value = 'JUD';
    document.getElementById('form-status').value = 'Aberta';
    document.getElementById('form-situacao').value = 'Incompleta';
    document.getElementById('form-local').value = '';
    document.getElementById('form-descricao').value = '';

    if (id) {
        document.getElementById('modal-titulo').innerText = "Editar Caixa";
        const caixas = JSON.parse(localStorage.getItem(CAIXAS_STORAGE_KEY));
        const cx = caixas.find(c => c.id === id);
        if (cx) {
            document.getElementById('form-id').value = cx.id;
            document.getElementById('form-codigo').value = cx.codigoCaixa || '';
            document.getElementById('form-tipo').value = cx.tipo || 'JUD';
            document.getElementById('form-status').value = cx.status || 'Aberta';
            document.getElementById('form-situacao').value = cx.situacao || 'Incompleta';
            document.getElementById('form-local').value = cx.local || '';
            document.getElementById('form-descricao').value = cx.descricao || '';
        }
    } else {
        document.getElementById('modal-titulo').innerText = "Adicionar Nova Caixa";
    }
}

function fecharModalCaixa() {
    document.getElementById('modal-caixa').classList.add('hidden');
}

function salvarCaixa() {
    const idAtual = document.getElementById('form-id').value;
    const codigo = document.getElementById('form-codigo').value.trim();
    
    if (!codigo) {
        alert("O Código da Caixa é obrigatório.");
        return;
    }

    const novaCaixa = {
        id: idAtual ? idAtual : `CX_${Date.now()}`,
        codigoCaixa: codigo,
        tipo: document.getElementById('form-tipo').value,
        status: document.getElementById('form-status').value,
        situacao: document.getElementById('form-situacao').value,
        local: document.getElementById('form-local').value,
        descricao: document.getElementById('form-descricao').value
    };

    let caixas = JSON.parse(localStorage.getItem(CAIXAS_STORAGE_KEY)) || [];

    if (idAtual) {
        const index = caixas.findIndex(c => c.id === idAtual);
        if (index > -1) caixas[index] = { ...caixas[index], ...novaCaixa };
    } else {
        caixas.push(novaCaixa);
    }

    localStorage.setItem(CAIXAS_STORAGE_KEY, JSON.stringify(caixas));
    carregarTabelaCaixas();
    fecharModalCaixa();
}

function excluirCaixa(id) {
    if(confirm(`Tem certeza que deseja excluir a caixa?`)) {
        let caixas = JSON.parse(localStorage.getItem(CAIXAS_STORAGE_KEY));
        caixas = caixas.filter(c => c.id !== id);
        localStorage.setItem(CAIXAS_STORAGE_KEY, JSON.stringify(caixas));
        carregarTabelaCaixas();
    }
}