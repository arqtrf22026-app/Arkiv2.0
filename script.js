const STORAGE_KEYS = {
    DOCUMENTOS: 'arquivocentral_documentos',
    SOLICITACOES: 'arquivocentral_solicitacoes',
    TRANSFERENCIAS: 'arquivocentral_transferencias'
};

// Dados Mockados
const placeholderDocumentos = [
  { id: "DOC001", status: "Arquivado", orgao: "TRF2", origem: "Tribunal de Justiça - TJ", categoria: "Processo Judicial", tipoDocumento: "Ação Ordinária", numeroDocumento: "PRC-2023-001", dataAbrangente: "01/2023 - 03/2023", anoEliminacaoPrevisto: "2039", descricaoDocumento: "Processo referente à disputa contratual X." },
  { id: "DOC002", status: "Emprestado", orgao: "SJRJ", origem: "Secretaria Municipal - SM", categoria: "Documento", tipoDocumento: "Solicitação de Informações", numeroDocumento: "OFC-2023-045", dataAbrangente: "20/03/2023", anoEliminacaoPrevisto: "2027", descricaoDocumento: "Ofício solicitando informações." },
  { id: "DOC003", status: "Arquivado", orgao: "SJES", origem: "Câmara de Vereadores - CV", categoria: "Processo Administrativo", tipoDocumento: "Comunicação Interna", numeroDocumento: "MEM-2022-112", dataAbrangente: "05/11/2022", anoEliminacaoPrevisto: "", descricaoDocumento: "Memorando sobre nova política interna." },
  { id: "DOC004", status: "Eliminado", orgao: "TRF2", origem: "Advocacia Geral - AG", categoria: "Documento", tipoDocumento: "Requerimento", numeroDocumento: "REQ-2014-001", dataAbrangente: "10/06/2014", anoEliminacaoPrevisto: "2018", descricaoDocumento: "Requerimento antigo." },
  { id: "DOC005", status: "Aguardando prazo para eliminação", orgao: "SJRJ", origem: "Vara Federal - VF", categoria: "Processo Judicial", tipoDocumento: "Petição", numeroDocumento: "PET-2010-555", dataAbrangente: "15/08/2010", anoEliminacaoPrevisto: "2026", descricaoDocumento: "Petição inicial." }
];

const placeholderSolicitacoes = [
    { numeroSolicitacao: "SOL-2024-001", dataSolicitacao: "2024-03-01T10:00:00Z", status: "Pendente" }
];

document.addEventListener("DOMContentLoaded", () => {
    inicializarBancoDeDados();
    configurarLayout();
    marcarMenuAtivo();
    
    // Carrega estatísticas apenas se estiver na página do Dashboard
    if (document.getElementById('stat-total-docs')) {
        carregarEstatisticasDashboard();
    }
    
    lucide.createIcons();
});

function inicializarBancoDeDados() {
    if (!localStorage.getItem(STORAGE_KEYS.DOCUMENTOS)) {
        localStorage.setItem(STORAGE_KEYS.DOCUMENTOS, JSON.stringify(placeholderDocumentos));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SOLICITACOES)) {
        localStorage.setItem(STORAGE_KEYS.SOLICITACOES, JSON.stringify(placeholderSolicitacoes));
    }
}

function getDadosLocais(chave) {
    const dados = localStorage.getItem(chave);
    return dados ? JSON.parse(dados) : [];
}

function carregarEstatisticasDashboard() {
    const documentos = getDadosLocais(STORAGE_KEYS.DOCUMENTOS);
    const solicitacoes = getDadosLocais(STORAGE_KEYS.SOLICITACOES);
    const transferencias = getDadosLocais(STORAGE_KEYS.TRANSFERENCIAS);

    document.getElementById('stat-total-docs').textContent = documentos.length;
    document.getElementById('stat-arquivados').textContent = documentos.filter(d => d.status === 'Arquivado').length;
    document.getElementById('stat-emprestados').textContent = documentos.filter(d => d.status === 'Emprestado').length;
    document.getElementById('stat-solicitacoes').textContent = solicitacoes.filter(s => s.status === 'Pendente').length;

    const listaAtividades = document.getElementById('recent-activities');
    const atividades = [
        ...transferencias.filter(t => t.status === 'Pendente').map(t => ({ tipo: 'Transferência Pendente', id: t.id, data: t.dataTransferencia })),
        ...solicitacoes.filter(s => s.status === 'Pendente').map(s => ({ tipo: 'Solicitação Pendente', id: s.numeroSolicitacao, data: s.dataSolicitacao }))
    ].sort((a, b) => new Date(b.data) - new Date(a.data)).slice(0, 5);

    if (atividades.length > 0) {
        listaAtividades.innerHTML = atividades.map(ativ => `
            <div class="flex items-center justify-between border-b dark:border-gray-700 pb-3 last:border-0">
                <div class="flex items-center gap-3">
                    <div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <i data-lucide="${ativ.tipo.includes('Transferência') ? 'arrow-right-left' : 'send'}" class="h-4 w-4"></i>
                    </div>
                    <div>
                        <p class="text-sm font-medium">${ativ.tipo}</p>
                        <p class="text-xs text-gray-500">ID: ${ativ.id} - ${new Date(ativ.data).toLocaleDateString('pt-BR')}</p>
                    </div>
                </div>
                <button class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition">Ver</button>
            </div>
        `).join('');
    }
}

function marcarMenuAtivo() {
    const caminho = window.location.pathname;
    let nomePagina = caminho.split("/").pop();
    
    // Se o nome da página for vazio (ex: abriu direto na pasta), define como index
    if (!nomePagina) nomePagina = "index.html";

    const linksMenu = document.querySelectorAll('#menu-navegacao a');
    
    linksMenu.forEach(link => {
        const href = link.getAttribute('href');
        
        // Remove as classes de destaque de todos
        link.className = "flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors";
        
        // Aplica o destaque apenas no link que corresponde à página atual
        if (href === nomePagina) {
            link.className = "flex items-center px-3 py-2 bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 rounded-md transition-colors";
        }
    });
}

function configurarLayout() {
    const html = document.documentElement;
    const btnTheme = document.getElementById('btn-theme');
    const iconTheme = document.getElementById('icon-theme');
    const btnSidebar = document.getElementById('btn-toggle-sidebar');
    const sidebar = document.getElementById('sidebar');

    if (localStorage.getItem('theme') === 'dark') {
        html.classList.add('dark');
        if (iconTheme) iconTheme.setAttribute('data-lucide', 'sun');
    }

    if (btnTheme) {
        btnTheme.addEventListener('click', () => {
            if (html.classList.contains('dark')) {
                html.classList.remove('dark');
                localStorage.setItem('theme', 'light');
                iconTheme.setAttribute('data-lucide', 'moon');
            } else {
                html.classList.add('dark');
                localStorage.setItem('theme', 'dark');
                iconTheme.setAttribute('data-lucide', 'sun');
            }
            lucide.createIcons();
        });
    }

    if (btnSidebar && sidebar) {
        btnSidebar.addEventListener('click', () => {
            if (sidebar.classList.contains('w-64')) {
                sidebar.classList.remove('w-64');
                sidebar.classList.add('w-0', 'hidden');
            } else {
                sidebar.classList.remove('w-0', 'hidden');
                sidebar.classList.add('w-64');
            }
        });
    }
}
