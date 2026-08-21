// ==============================
// SUPABASE
// ==============================

const SUPABASE_URL =
    "https://syxmyqsdjbrpqegqbewd.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_OycV8Y3hPr9Fr81QvYXo1w_YrzuDM1F";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ==============================
// WHATSAPP JS JOIAS
// ==============================

const numeroWhatsApp =
    "5591984328738";


// ==============================
// PRODUTOS
// ==============================

let produtos = [];

let categoriaAtual =
    "todos";


// ==============================
// ELEMENTOS
// ==============================

const listaProdutos =
    document.getElementById(
        "listaProdutos"
    );

const campoBusca =
    document.getElementById(
        "campoBusca"
    );

const botoesCategorias =
    document.querySelectorAll(
        ".categoria"
    );

const quantidadeProdutos =
    document.getElementById(
        "quantidadeProdutos"
    );

const semResultados =
    document.getElementById(
        "semResultados"
    );


// ==============================
// FORMATAR PREÇO
// ==============================

function formatarPreco(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


// ==============================
// NOME DA CATEGORIA
// ==============================

function nomeCategoria(categoria) {

    const categorias = {

        aneis: "Anel",

        colares: "Colar",

        brincos: "Brinco",

        pulseiras: "Pulseira"

    };


    return categorias[categoria]
        || categoria;

}


// ==============================
// CARREGAR PRODUTOS
// ==============================

async function carregarProdutos() {

    quantidadeProdutos.textContent =
        "Carregando...";


    const {
        data,
        error
    } = await supabaseClient
        .from("produtos")
        .select("*")
        .order(
            "created_at",
            {
                ascending: false
            }
        );


    if (error) {

        console.error(
            "Erro ao carregar produtos:",
            error
        );

        quantidadeProdutos.textContent =
            "Erro ao carregar";

        listaProdutos.innerHTML = `
            <p style="
                grid-column: 1 / -1;
                text-align: center;
                color: #888;
                padding: 30px;
            ">
                Não foi possível carregar
                as joias.
            </p>
        `;

        return;

    }


    produtos =
        data || [];


    filtrarProdutos();

}


// ==============================
// MOSTRAR PRODUTOS
// ==============================

function mostrarProdutos(lista) {

    listaProdutos.innerHTML = "";


    quantidadeProdutos.textContent =
        lista.length === 1
            ? "1 peça"
            : `${lista.length} peças`;


    if (lista.length === 0) {

        semResultados.style.display =
            "block";

        return;

    }


    semResultados.style.display =
        "none";


    lista.forEach(produto => {

        const card =
            document.createElement(
                "article"
            );


        card.classList.add(
            "produto-card"
        );


        const imagem =
            produto.imagem_url
            || "";


        const disponivel =
            produto.status
            !== "esgotado";


        card.innerHTML = `

            <div class="produto-imagem">

                <img
                    src="${imagem}"
                    alt="${produto.nome}"
                    loading="lazy"
                >

                <span class="etiqueta">

                    ${
                        disponivel
                            ? "DISPONÍVEL"
                            : "ESGOTADO"
                    }

                </span>

            </div>


            <div class="produto-info">

                <span class="produto-categoria">
                    ${nomeCategoria(
                        produto.categoria
                    )}
                </span>

                <h3>
                    ${produto.nome}
                </h3>

                <p class="produto-preco">
                    ${formatarPreco(
                        produto.preco
                    )}
                </p>


                ${
                    disponivel

                    ? `

                        <button
                            class="botao-whatsapp"
                            onclick="comprarProduto(${produto.id})"
                        >
                            Comprar pelo WhatsApp
                        </button>

                    `

                    : `

                        <button
                            class="botao-whatsapp"
                            disabled
                            style="
                                opacity: 0.45;
                                cursor: not-allowed;
                            "
                        >
                            Produto esgotado
                        </button>

                    `
                }

            </div>

        `;


        listaProdutos.appendChild(
            card
        );

    });

}


// ==============================
// FILTRAR
// ==============================

function filtrarProdutos() {

    const pesquisa =
        campoBusca.value
            .toLowerCase()
            .trim();


    const filtrados =
        produtos.filter(
            produto => {

                const nome =
                    (
                        produto.nome
                        || ""
                    ).toLowerCase();


                const combinaBusca =
                    nome.includes(
                        pesquisa
                    );


                const combinaCategoria =
                    categoriaAtual
                    === "todos"
                    ||
                    produto.categoria
                    === categoriaAtual;


                return (
                    combinaBusca
                    &&
                    combinaCategoria
                );

            }
        );


    mostrarProdutos(
        filtrados
    );

}


// ==============================
// BUSCA
// ==============================

campoBusca.addEventListener(
    "input",
    filtrarProdutos
);


// ==============================
// CATEGORIAS
// ==============================

botoesCategorias.forEach(
    botao => {

        botao.addEventListener(
            "click",
            () => {

                botoesCategorias
                    .forEach(
                        btn => {

                            btn.classList
                                .remove(
                                    "ativa"
                                );

                        }
                    );


                botao.classList.add(
                    "ativa"
                );


                categoriaAtual =
                    botao.dataset
                        .categoria;


                filtrarProdutos();

            }
        );

    }
);


// ==============================
// WHATSAPP
// ==============================

function comprarProduto(id) {

    const produto =
        produtos.find(
            produto =>
                produto.id === id
        );


    if (!produto) {
        return;
    }


    const mensagem =

        `Olá! Tenho interesse na joia ` +
        `"${produto.nome}", no valor de ` +
        `${formatarPreco(produto.preco)}. ` +
        `Gostaria de saber mais.`;


    const link =

        `https://wa.me/${numeroWhatsApp}` +
        `?text=${encodeURIComponent(
            mensagem
        )}`;


    window.open(
        link,
        "_blank"
    );

}


// ==============================
// ATUALIZAÇÃO EM TEMPO REAL
// ==============================

supabaseClient
    .channel(
        "produtos-js-joias"
    )
    .on(
        "postgres_changes",
        {
            event: "*",
            schema: "public",
            table: "produtos"
        },
        () => {

            carregarProdutos();

        }
    )
    .subscribe();


// ==============================
// INICIAR SITE
// ==============================

carregarProdutos();