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
}

function adicionarTarefa() {
    if (txt_nova_tarefa.value.trim() !=="") {
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
        item.innerHTML = "<span class 'w-75 text-truncate'>" + txt_nova_tarefa.value + "</span>" + btn_item;
        
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
// 3. ESCUTADORES DE EVENTOS E INÍCIO
//------------------------------------------------------------------

iniciaToDo();