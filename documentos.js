document.addEventListener("DOMContentLoaded", () => {
    carregarTabelaDocumentos();
    
    // Verifica se veio com parâmetro add=true da Dashboard
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('add') === 'true') {
        abrirModalDocumento();
    }
});

function carregarTabelaDocumentos() {
    const documentos = getDadosLocais(STORAGE_KEYS.DOCUMENTOS);
    const tbody = document.getElementById('tabela-documentos');
    tbody.innerHTML = '';

    if (documentos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="px-4 py-8 text-center text-gray-500">Nenhum documento encontrado.</td></tr>`;
        return;
    }

    // Inverte o array para mostrar os cadastros mais recentes primeiro
    [...documentos].reverse().forEach(doc => {
        let corBadge = "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
        if (doc.status === 'Arquivado') corBadge = "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300";
        if (doc.status === 'Eliminado') corBadge = "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300";
        if (doc.status === 'Emprestado') corBadge = "border border-gray-300 text-gray-800 dark:border-gray-500 dark:text-gray-300";
        if (doc.status === 'Aguardando prazo para eliminação') corBadge = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300";

        const tr = document.createElement('tr');
        tr.className = "hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group";
        tr.innerHTML = `
            <td class="px-4 py-3 font-medium text-blue-600 dark:text-blue-400 cursor-pointer hover:underline" onclick="abrirModalDocumento('${doc.id}')">${doc.id}</td>
            <td class="px-4 py-3"><span class="px-2.5 py-0.5 rounded-full text-xs font-semibold ${corBadge}">${doc.status}</span></td>
            <td class="px-4 py-3">${doc.orgao}</td>
            <td class="px-4 py-3">${doc.categoria}</td>
            <td class="px-4 py-3">${doc.numeroDocumento || 'N/A'}</td>
            <td class="px-4 py-3">${doc.dataAbrangente || 'N/A'}</td>
            <td class="px-4 py-3 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="text-gray-500 hover:text-blue-600 mx-1 p-1 rounded" onclick="abrirModalDocumento('${doc.id}')" title="Editar"><i data-lucide="edit" class="h-4 w-4"></i></button>
                <button class="text-gray-500 hover:text-red-600 mx-1 p-1 rounded" onclick="excluirDocumento('${doc.id}')" title="Excluir"><i data-lucide="trash-2" class="h-4 w-4"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    lucide.createIcons();
}

function abrirModalDocumento(id = null) {
    document.getElementById('modal-documento').classList.remove('hidden');
    
    document.getElementById('form-id').value = '';
    document.getElementById('form-status').value = 'Arquivado';
    document.getElementById('form-orgao').value = 'TRF2';
    document.getElementById('form-categoria').value = 'Documento';
    document.getElementById('form-numero').value = '';
    document.getElementById('form-data-abrangente').value = '';
    document.getElementById('form-ano-elim').value = '';
    document.getElementById('form-descricao').value = '';

    if (id) {
        document.getElementById('modal-titulo').innerText = "Editar Documento";
        document.getElementById('modal-desc').innerText = `ID: ${id}`;
        
        const documentos = getDadosLocais(STORAGE_KEYS.DOCUMENTOS);
        const doc = documentos.find(d => d.id === id);
        
        if (doc) {
            document.getElementById('form-id').value = doc.id;
            document.getElementById('form-status').value = doc.status || 'Arquivado';
            document.getElementById('form-orgao').value = doc.orgao || 'TRF2';
            document.getElementById('form-categoria').value = doc.categoria || 'Documento';
            document.getElementById('form-numero').value = doc.numeroDocumento || '';
            document.getElementById('form-data-abrangente').value = doc.dataAbrangente || '';
            document.getElementById('form-ano-elim').value = doc.anoEliminacaoPrevisto || '';
            document.getElementById('form-descricao').value = doc.descricaoDocumento || '';
            
            // Bloqueia campos se estiver eliminado
            const campos = document.querySelectorAll('#modal-documento input, #modal-documento select, #modal-documento textarea');
            campos.forEach(c => c.disabled = (doc.status === 'Eliminado'));
        }
    } else {
        document.getElementById('modal-titulo').innerText = "Adicionar Item ao Acervo";
        document.getElementById('modal-desc').innerText = "Preencha as informações básicas do documento.";
        const campos = document.querySelectorAll('#modal-documento input, #modal-documento select, #modal-documento textarea');
        campos.forEach(c => c.disabled = false);
    }
}

function fecharModalDocumento() {
    document.getElementById('modal-documento').classList.add('hidden');
    // Remove parâmetro URL caso tenha vindo da dashboard
    window.history.replaceState({}, document.title, window.location.pathname);
}

function excluirDocumento(id) {
    const documentos = getDadosLocais(STORAGE_KEYS.DOCUMENTOS);
    const doc = documentos.find(d => d.id === id);
    
    if (doc && doc.status === 'Eliminado') {
        alert("Ação não permitida: Documentos com status 'Eliminado' não podem ser excluídos.");
        return;
    }

    if(confirm(`Tem certeza que deseja excluir permanentemente o documento ${id}?`)) {
        const novosDocs = documentos.filter(d => d.id !== id);
        localStorage.setItem(STORAGE_KEYS.DOCUMENTOS, JSON.stringify(novosDocs));
        carregarTabelaDocumentos();
    }
}

function salvarDocumento() {
    const idAtual = document.getElementById('form-id').value;
    
    const novoDocumento = {
        status: document.getElementById('form-status').value,
        orgao: document.getElementById('form-orgao').value,
        categoria: document.getElementById('form-categoria').value,
        numeroDocumento: document.getElementById('form-numero').value,
        dataAbrangente: document.getElementById('form-data-abrangente').value,
        anoEliminacaoPrevisto: document.getElementById('form-ano-elim').value,
        descricaoDocumento: document.getElementById('form-descricao').value,
    };

    // Validação básica simulando o que tinha no React
    if(!novoDocumento.orgao || !novoDocumento.categoria) {
        alert("Preencha os campos obrigatórios.");
        return;
    }

    let documentos = getDadosLocais(STORAGE_KEYS.DOCUMENTOS);

    if (idAtual) {
        const index = documentos.findIndex(d => d.id === idAtual);
        if (index > -1) {
            documentos[index] = { ...documentos[index], ...novoDocumento };
        }
    } else {
        novoDocumento.id = `DOC${Date.now()}`;
        novoDocumento.origem = "Cadastro Manual";
        novoDocumento.dataCadastro = new Date().toISOString();
        novoDocumento.tipoMeio = "Não digital";
        novoDocumento.digitalizado = "Não";
        documentos.push(novoDocumento);
    }

    localStorage.setItem(STORAGE_KEYS.DOCUMENTOS, JSON.stringify(documentos));
    carregarTabelaDocumentos();
    fecharModalDocumento();
}