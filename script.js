//----------------------------------------------------------
// 1. VARIÁVEIS GLOBAIS
// São acessíveis a partir de qualquer função JavaScript.
//----------------------------------------------------------

// Procura pelo elemento com o ID "txt-nova-tarefa" np documento HTML
const txt_nova_tarefa = document.querySelector("#txt-nova-tarefa")
// Procura pelo elemento com o ID "btn-nova-tarefa" no documento HTML
const btn_nova_tarefa = document.querySelector("#btn-nova-tarefa");
// Procura pelo elemento com o ID "lista-tarefas" no documento HTML
const lista_tarefas = document.querySelector("#lista-tarefas");

const audioConcluir = new Audio('sound/gmae.wav');

// Variável global que controla a exibição da modal "Excluir tarefa"
const modalExcluir = new bootstrap.Modal(document.getElementById('exampleModal'));

// Variável global que armazena a tarefa que será excluída
let id_tarefa_excluir;

//-------------------------------------------------------------------
// 2. FUNÇÕES DE LÓGICA
//-------------------------------------------------------------------

function iniciaToDo () {
    // alert("Olá mundo!");
    // Associa função ao evento de clicar no botão de "Adicionar" nova tarefa
    btn_nova_tarefa.addEventListener("click", adicionarTarefa);
    // Associa função "adicionarTarerfaEnter()" ao evento de pressionar a tecla "enter"
    // no campo de "Adicionar nova tarefa"
    txt_nova_tarefa.addEventListener("keypress", adicionarTarefaEnter)

    // Carrega as tarefas salvas no cookie do navegador Web  ao carregar a página
    const arrayTarefas = obterTarefasDoNavegador();
    salvarCookieTarefas([]);
    arrayTarefas.forEach(strTarefa => {
        adicionarTarefa(strTarefa);
        
    });

    lista_tarefas.querySelectorAll("li").forEach(li=> makeDraggable(li));

}

function adicionarTarefa(strTarefa) {
    if (typeof strTarefa !== 'string' || strTarefa == null) {
        strTarefa = txt_nova_tarefa.value;
    }

    if (strTarefa.trim() !=="") {
        const btn_item = `
        <div>
            <button class="btn btn-success btn sm me-2 btn-concluir" onclick="concluirTarefa(this)">Concluir</button>
            <button class="btn btn-danger btn-sm btn-excluir" onclick="obterIDTarefaExcluir(this);modalExcluir.show()">Excluir</button>
        </div>
    `;
        
        // Cria um novo item da lista
        const item = document.createElement("li");
        item.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
        // Adiciona o texto digitado na caixa de texto e os botões para concluir e excluir a tarefa.
        //"span" permite aplicar formatações em linha
        // "w-75" limita o nome da tarefa a 75% do tamanho da linha, deixando 25% do tamanho restante reservado para os botões
        //"text-truncate" corta e adiciona reticencias (tres pontos ...) em nomes de tarefas que excedem 75% da largura da linha
        item.innerHTML = "<span class 'w-75 text-truncate'>" + strTarefa + "</span>" + btn_item;
        
        //Adicionar suporte a arrastar e soltar a nova tarefa da lista de tarefas
        makeDraggable(item);
        item.addEventListener("dragend", () => {
            let arrayTarefas = []; 
            Array.from(lista_tarefas.children).forEach(i => {
                arrayTarefas.push(i.querySelector("span").textContent);
            });
            salvarCookieTarefas(arrayTarefas);
        });

        // Adicionar a tarefa aos cookies do navegador
        adicionarTarefaAosCookies(strTarefa);
        
        // Adiciona o item a lista de tarefas
        lista_tarefas.append(item);
    }
    // Limpa o campo de texto de "Adicionar nova tarefa" após adicionar a tarefa a lista
    txt_nova_tarefa.value = "";
    // Seleciona o campo "Adicionar nova tarefa" após adicionar a tarefa a lista
    txt_nova_tarefa.focus();
}

function adicionarTarefaEnter(evento) {
    // Se a tecla pressionada for igual a "enter"
    if (evento.key == "Enter") {
        // Chama a função JavaScript "adicionarTarefa()"
        adicionarTarefa();
    }
}

function concluirTarefa(btn_concluir) {
    audioConcluir.play();
    
    for(let i = 0; i <= 50; i++) {
        confetti();
    }
    
    // Atualiza o ID da tarefa a ser excluída e
    //passa como parametro o botão de "Concluir" clickado.
    obterIDTarefaExcluir(btn_concluir);
    
    // Chama a função JS "excluirTarefa()" e passa como parametro o botão de "Concluir"
    excluirTarefa();
}

function excluirTarefa() {
    // Remove o item da lista de tarefas
    const arrayTarefas = obterTarefasDoNavegador(); //Carrega as tarefas para um vetor a partir do cookie do navegador web
    arrayTarefas.splice(id_tarefa_excluir, 1); // Remove 1 tarefa do vetor a partir di ID da tarefa excluida
    salvarCookieTarefas(arrayTarefas); // Atualiza o cookie do navewgador web após excluir a tarefa
    lista_tarefas.removeChild(lista_tarefas.children[id_tarefa_excluir])
    // Fecha a modal de "Excluir tarefa"
    modalExcluir.hide();
} 

function obterIDTarefaExcluir(btn) {
    // Encontra o elemento HTML "li" (item) pai mais próximo do botão de "Concluir"
    // O botão "Concluir" foi o "elemento" que executou a função.
    // Perceba que na função JS "obterIDTarefaExcluir()", o botão clickado é
    // recebido como parametro da função (btn).
    const item = btn.closest("li");
    const tarefas = Array.from(lista_tarefas.children);
    // Por exemplo, se temos 3 tarefas e excluímos a última tarefa,
    //id_tarefa_excluir será definido para "3" que é o ID da tarefa excluída
    id_tarefa_excluir = tarefas.indexOf(item);
}

//------------------------------------------------------------------
// 3. COOKIE
// Adiciona funcionalidade de cookies (persistência) dos itens adicionados ao carrinho
// (mantém os produtos adicionados as tarefas mesmo ao fechar ou atualizar a página)
//------------------------------------------------------------------

const CHAVE_TAREFAS_TODO = 'tarefas_todo';

function obterTarefasDoNavegador() {
    // Tenta ler o cookie do navegador
    try {
        const cookie = localStorage.getItem(CHAVE_TAREFAS_TODO);
        if (cookie) {
            // Se existir, retorna o cookie
            return JSON.parse(cookie);
        }
    } catch (e) {
        console.error("Falha ao ler o cookie do armazenamento local.")
    }
    // Retorna um vetor vaziuo em caso de falha
    return [];
}

function salvarCookieTarefas(arrayTarefas) {
    try {
        // Salva as tarefas em formato JSON no navegador Web.
        //Você pode visualizar os itens salvos no navegador Web em:
        // Botão direito na página > Inspencionar > Application > Storage > Local storage
        localStorage.setItem(CHAVE_TAREFAS_TODO, JSON.stringify(arrayTarefas));
    } catch (e) {
        console.error("ERRO: Falha ao salvar as tarefas no navegador. Erro: ", e);
    }
}

function adicionarTarefaAosCookies(strTarefa) {
    const arrayTarefas = obterTarefasDoNavegador();
    arrayTarefas.push(strTarefa);
    salvarCookieTarefas(arrayTarefas);
    
}

//-------------------------------------------------------------------
// 4. ESCUTADORES DE EVENTOS E INÍCIO
//-------------------------------------------------------------------

iniciaToDo();