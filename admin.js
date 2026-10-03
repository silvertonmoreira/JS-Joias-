// =========================================
// CONFIGURAÇÃO DO SUPABASE
// =========================================

const SUPABASE_URL =
    "https://syxmyqsdjbrpqegqbewd.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_OycV8Y3hPr9Fr81QvYXo1w_YrzuDM1F";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// =========================================
// ELEMENTOS - LOGIN
// =========================================

const areaLogin =
    document.getElementById("areaLogin");

const areaPainel =
    document.getElementById("areaPainel");

const formLogin =
    document.getElementById("formLogin");

const emailLogin =
    document.getElementById("emailLogin");

const senhaLogin =
    document.getElementById("senhaLogin");

const botaoLogin =
    document.getElementById("botaoLogin");

const botaoSair =
    document.getElementById("botaoSair");

const mensagemLogin =
    document.getElementById("mensagemLogin");


// =========================================
// ELEMENTOS - PRODUTOS
// =========================================

const formProduto =
    document.getElementById("formProduto");

const produtoId =
    document.getElementById("produtoId");

const nomeProduto =
    document.getElementById("nomeProduto");

const precoProduto =
    document.getElementById("precoProduto");

const categoriaProduto =
    document.getElementById("categoriaProduto");

const imagemProduto =
    document.getElementById("imagemProduto");

const imagemAtual =
    document.getElementById("imagemAtual");

const statusProduto =
    document.getElementById("statusProduto");

const botaoSalvar =
    document.getElementById("botaoSalvar");

const botaoCancelar =
    document.getElementById("botaoCancelar");

const tituloFormulario =
    document.getElementById("tituloFormulario");

const mensagemProduto =
    document.getElementById("mensagemProduto");

const listaAdminProdutos =
    document.getElementById("listaAdminProdutos");

const carregandoProdutos =
    document.getElementById("carregandoProdutos");

const areaPreview =
    document.getElementById("areaPreview");

const previewImagem =
    document.getElementById("previewImagem");


// =========================================
// RESUMO
// =========================================

const totalJoias =
    document.getElementById("totalJoias");

const totalDisponiveis =
    document.getElementById("totalDisponiveis");

const totalEsgotadas =
    document.getElementById("totalEsgotadas");


let produtos = [];


// =========================================
// MOSTRAR MENSAGENS
// =========================================

function mostrarMensagemLogin(
    texto,
    sucesso = false
) {

    mensagemLogin.textContent = texto;

    mensagemLogin.style.color =
        sucesso
            ? "#70d997"
            : "#ff8787";

}


function mostrarMensagemProduto(
    texto,
    sucesso = false
) {

    mensagemProduto.textContent = texto;

    mensagemProduto.style.color =
        sucesso
            ? "#70d997"
            : "#ff8787";

}


// =========================================
// VERIFICAR LOGIN
// =========================================

async function verificarLogin() {

    const {
        data: { session }
    } = await supabaseClient.auth
        .getSession();

    if (session) {

        mostrarPainel();

    } else {

        mostrarLogin();

    }

}


// =========================================
// MOSTRAR LOGIN
// =========================================

function mostrarLogin() {

    areaLogin.style.display =
        "flex";

    areaPainel.style.display =
        "none";

}


// =========================================
// MOSTRAR PAINEL
// =========================================

function mostrarPainel() {

    areaLogin.style.display =
        "none";

    areaPainel.style.display =
        "block";

    carregarProdutos();

}


// =========================================
// FAZER LOGIN
// =========================================

formLogin.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        mostrarMensagemLogin("");

        botaoLogin.disabled =
            true;

        botaoLogin.textContent =
            "Entrando...";


        const email =
            emailLogin.value.trim();

        const senha =
            senhaLogin.value;


        const {
            error
        } = await supabaseClient.auth
            .signInWithPassword({

                email: email,

                password: senha

            });


        if (error) {

            console.error(error);

            mostrarMensagemLogin(
                error.message
            );

            botaoLogin.disabled =
                false;

            botaoLogin.textContent =
                "Entrar";

            return;

        }


        mostrarMensagemLogin(
            "Login realizado com sucesso!",
            true
        );


        formLogin.reset();


        setTimeout(
            () => {

                mostrarPainel();

                botaoLogin.disabled =
                    false;

                botaoLogin.textContent =
                    "Entrar";

            },
            500
        );

    }
);


// =========================================
// SAIR
// =========================================

botaoSair.addEventListener(
    "click",
    async function() {

        await supabaseClient.auth
            .signOut();

        limparFormulario();

        mostrarLogin();

    }
);


// =========================================
// FORMATAR PREÇO
// =========================================

function formatarPreco(valor) {

    return Number(valor)
        .toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

}


// =========================================
// NOME DA CATEGORIA
// =========================================

function nomeCategoria(categoria) {

    const categorias = {

        aneis: "Anel",

        colares: "Colar",

        brincos: "Brinco",

        pulseiras: "Pulseira",
        pingentes: "Pingente"

    };


    return categorias[categoria]
        || categoria;

}


// =========================================
// CARREGAR PRODUTOS
// =========================================

async function carregarProdutos() {

    carregandoProdutos.style.display =
        "block";

    listaAdminProdutos.innerHTML =
        "";


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


    carregandoProdutos.style.display =
        "none";


    if (error) {

        console.error(error);

        listaAdminProdutos.innerHTML = `
            <p style="
                text-align:center;
                color:#ff8787;
                padding:25px 10px;
            ">
                Erro ao carregar as joias.
            </p>
        `;

        return;

    }


    produtos =
        data || [];


    mostrarProdutos();

    atualizarResumo();

}


// =========================================
// RESUMO
// =========================================

function atualizarResumo() {

    totalJoias.textContent =
        produtos.length;


    totalDisponiveis.textContent =
        produtos.filter(
            produto =>
                produto.status ===
                "disponivel"
        ).length;


    totalEsgotadas.textContent =
        produtos.filter(
            produto =>
                produto.status ===
                "esgotado"
        ).length;

}


// =========================================
// MOSTRAR PRODUTOS
// =========================================

function mostrarProdutos() {

    listaAdminProdutos.innerHTML =
        "";


    if (produtos.length === 0) {

        listaAdminProdutos.innerHTML = `
            <p style="
                color:#777;
                text-align:center;
                padding:30px 10px;
                font-size:13px;
            ">
                Nenhuma joia cadastrada ainda.
            </p>
        `;

        return;

    }


    produtos.forEach(
        produto => {

            const item =
                document.createElement(
                    "div"
                );


            item.classList.add(
                "admin-produto"
            );


            item.innerHTML = `

                <img
                    src="${produto.imagem_url || ""}"
                    alt="${produto.nome}"
                >


                <div class="admin-produto-info">

                    <h3>
                        ${produto.nome}
                    </h3>

                    <p>
                        ${formatarPreco(
                            produto.preco
                        )}
                    </p>

                    <span>
                        ${nomeCategoria(
                            produto.categoria
                        )}
                    </span>

                    <span
                        class="${
                            produto.status ===
                            "disponivel"

                            ? "status-disponivel"

                            : "status-esgotado"
                        }"
                    >

                        ${
                            produto.status ===
                            "disponivel"

                            ? "Disponível"

                            : "Esgotado"
                        }

                    </span>

                </div>


                <div class="admin-acoes">

                    <button
                        class="botao-editar"
                        onclick="editarProduto(${produto.id})"
                    >
                        Editar
                    </button>

                    <button
                        class="botao-excluir"
                        onclick="excluirProduto(${produto.id})"
                    >
                        Excluir
                    </button>

                </div>

            `;


            listaAdminProdutos
                .appendChild(
                    item
                );

        }
    );

}


// =========================================
// PREVIEW DA FOTO
// =========================================

imagemProduto.addEventListener(
    "change",
    function() {

        const arquivo =
            imagemProduto.files[0];


        if (!arquivo) {

            return;

        }


        const urlTemporaria =
            URL.createObjectURL(
                arquivo
            );


        previewImagem.src =
            urlTemporaria;

        areaPreview.style.display =
            "block";

    }
);


// =========================================
// COMPRIMIR FOTO ANTES DO UPLOAD
// =========================================

async function comprimirImagem(arquivo) {

    if (!arquivo || !arquivo.type.startsWith("image/")) {
        return arquivo;
    }

    const TAMANHO_MAXIMO = 1600;
    const QUALIDADE_WEBP = 0.82;

    try {

        const imagem = await new Promise((resolve, reject) => {

            const img = new Image();
            const url = URL.createObjectURL(arquivo);

            img.onload = () => {
                URL.revokeObjectURL(url);
                resolve(img);
            };

            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error("Não foi possível ler a imagem."));
            };

            img.src = url;

        });


        let largura = imagem.naturalWidth;
        let altura = imagem.naturalHeight;

        if (largura > TAMANHO_MAXIMO || altura > TAMANHO_MAXIMO) {

            const proporcao = Math.min(
                TAMANHO_MAXIMO / largura,
                TAMANHO_MAXIMO / altura
            );

            largura = Math.round(largura * proporcao);
            altura = Math.round(altura * proporcao);

        }


        const canvas = document.createElement("canvas");
        canvas.width = largura;
        canvas.height = altura;

        const contexto = canvas.getContext("2d");

        if (!contexto) {
            return arquivo;
        }

        contexto.drawImage(
            imagem,
            0,
            0,
            largura,
            altura
        );


        const blobComprimido = await new Promise(resolve => {
            canvas.toBlob(
                resolve,
                "image/webp",
                QUALIDADE_WEBP
            );
        });


        if (!blobComprimido) {
            return arquivo;
        }

        // Se por algum motivo a compressão aumentar o arquivo,
        // mantém o original para não desperdiçar espaço.
        if (blobComprimido.size >= arquivo.size) {
            return arquivo;
        }

        return new File(
            [blobComprimido],
            `joia-${Date.now()}.webp`,
            {
                type: "image/webp",
                lastModified: Date.now()
            }
        );

    } catch (erro) {

        console.warn(
            "Não foi possível comprimir a imagem. O arquivo original será enviado.",
            erro
        );

        return arquivo;

    }

}


// =========================================
// ENVIAR FOTO PARA O SUPABASE
// =========================================

async function enviarFoto(arquivo) {

    if (!arquivo) {

        return null;

    }


    const arquivoParaUpload =
        await comprimirImagem(arquivo);


    const extensao =
        arquivoParaUpload.type === "image/webp"
            ? "webp"
            : (arquivoParaUpload.name.split(".").pop() || "jpg");


    const nomeArquivo =

        `${Date.now()}-` +

        `${Math.random()
            .toString(36)
            .substring(2, 10)}` +

        `.${extensao}`;


    const caminho =
        `produtos/${nomeArquivo}`;


    const {
        data,
        error
    } = await supabaseClient
        .storage
        .from("joias")
        .upload(
            caminho,
            arquivoParaUpload,
            {
                cacheControl: "3600",
                contentType: arquivoParaUpload.type || undefined,
                upsert: false
            }
        );


    if (error) {

        console.error(
            "Erro no upload:",
            error
        );

        throw new Error(
            "Não foi possível enviar a foto."
        );

    }


    const {
        data: publicUrlData
    } = supabaseClient
        .storage
        .from("joias")
        .getPublicUrl(
            data.path
        );


    return publicUrlData.publicUrl;

}


// =========================================
// APAGAR FOTO DO STORAGE
// =========================================

async function apagarFotoStorage(
    urlImagem
) {

    if (!urlImagem) {

        return;

    }


    try {

        const marcador =
            "/storage/v1/object/public/joias/";


        const indice =
            urlImagem.indexOf(
                marcador
            );


        if (indice === -1) {

            console.warn(
                "Não foi possível identificar o caminho da foto:",
                urlImagem
            );

            return;

        }


        const caminho =
            decodeURIComponent(
                urlImagem.substring(
                    indice +
                    marcador.length
                )
            );


        const {
            error
        } = await supabaseClient
            .storage
            .from("joias")
            .remove(
                [caminho]
            );


        if (error) {

            console.error(
                "Erro ao apagar foto do Storage:",
                error
            );

        }

    } catch (erro) {

        console.error(
            "Erro ao apagar foto:",
            erro
        );

    }

}


// =========================================
// SALVAR PRODUTO
// =========================================

formProduto.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        mostrarMensagemProduto("");


        botaoSalvar.disabled =
            true;


        botaoSalvar.textContent =
            produtoId.value

                ? "Salvando alterações..."

                : "Cadastrando joia...";


        let novaFotoEnviada =
            null;


        try {

            const arquivo =
                imagemProduto.files[0];


            const fotoAntiga =
                imagemAtual.value;


            let urlImagem =
                fotoAntiga;


            // NOVO PRODUTO PRECISA DE FOTO

            if (
                !produtoId.value &&
                !arquivo
            ) {

                mostrarMensagemProduto(
                    "Escolha uma foto da joia."
                );

                botaoSalvar.disabled =
                    false;

                botaoSalvar.textContent =
                    "Salvar joia";

                return;

            }


            // ENVIA FOTO NOVA

            if (arquivo) {

                mostrarMensagemProduto(
                    "Enviando foto..."
                );


                novaFotoEnviada =
                    await enviarFoto(
                        arquivo
                    );


                urlImagem =
                    novaFotoEnviada;

            }


            const dadosProduto = {

                nome:
                    nomeProduto.value
                        .trim(),

                preco:
                    Number(
                        precoProduto.value
                    ),

                categoria:
                    categoriaProduto.value,

                status:
                    statusProduto.value,

                imagem_url:
                    urlImagem

            };


            // =================================
            // EDITAR PRODUTO
            // =================================

            if (produtoId.value) {

                const {
                    error
                } = await supabaseClient
                    .from("produtos")
                    .update(
                        dadosProduto
                    )
                    .eq(
                        "id",
                        Number(
                            produtoId.value
                        )
                    );


                if (error) {

                    throw error;

                }


                // SE TROCOU A FOTO,
                // APAGA A FOTO ANTIGA

                if (
                    arquivo &&
                    fotoAntiga &&
                    fotoAntiga !==
                    urlImagem
                ) {

                    await apagarFotoStorage(
                        fotoAntiga
                    );

                }


                mostrarMensagemProduto(
                    "Joia atualizada com sucesso!",
                    true
                );

            }


            // =================================
            // NOVO PRODUTO
            // =================================

            else {

                const {
                    error
                } = await supabaseClient
                    .from("produtos")
                    .insert(
                        [
                            dadosProduto
                        ]
                    );


                if (error) {

                    throw error;

                }


                mostrarMensagemProduto(
                    "Joia cadastrada com sucesso!",
                    true
                );

            }


            limparFormulario();

            await carregarProdutos();


        } catch (erro) {

            console.error(
                erro
            );


            // SE A FOTO FOI ENVIADA,
            // MAS O PRODUTO NÃO FOI SALVO,
            // APAGA A FOTO

            if (novaFotoEnviada) {

                await apagarFotoStorage(
                    novaFotoEnviada
                );

            }


            mostrarMensagemProduto(
                erro.message ||
                "Não foi possível salvar a joia."
            );

        }


        botaoSalvar.disabled =
            false;

        botaoSalvar.textContent =
            "Salvar joia";

    }
);


// =========================================
// EDITAR PRODUTO
// =========================================

function editarProduto(id) {

    const produto =
        produtos.find(
            produto =>
                produto.id === id
        );


    if (!produto) {

        return;

    }


    produtoId.value =
        produto.id;

    nomeProduto.value =
        produto.nome;

    precoProduto.value =
        produto.preco;

    categoriaProduto.value =
        produto.categoria;

    statusProduto.value =
        produto.status;

    imagemAtual.value =
        produto.imagem_url || "";


    if (produto.imagem_url) {

        previewImagem.src =
            produto.imagem_url;

        areaPreview.style.display =
            "block";

    }


    tituloFormulario.textContent =
        "Editar joia";


    botaoSalvar.textContent =
        "Salvar alterações";


    botaoCancelar.style.display =
        "block";


    mostrarMensagemProduto("");


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// =========================================
// EXCLUIR PRODUTO
// =========================================

async function excluirProduto(id) {

    const produto =
        produtos.find(
            produto =>
                produto.id === id
        );


    if (!produto) {

        return;

    }


    const confirmar =
        confirm(
            `Deseja realmente excluir "${produto.nome}"?`
        );


    if (!confirmar) {

        return;

    }


    const {
        error
    } = await supabaseClient
        .from("produtos")
        .delete()
        .eq(
            "id",
            id
        );


    if (error) {

        console.error(
            error
        );

        alert(
            "Não foi possível excluir a joia."
        );

        return;

    }


    // APAGA A FOTO DO STORAGE

    if (produto.imagem_url) {

        await apagarFotoStorage(
            produto.imagem_url
        );

    }


    await carregarProdutos();

}


// =========================================
// LIMPAR FORMULÁRIO
// =========================================

function limparFormulario() {

    formProduto.reset();


    produtoId.value =
        "";

    imagemAtual.value =
        "";


    statusProduto.value =
        "disponivel";


    previewImagem.src =
        "";

    areaPreview.style.display =
        "none";


    tituloFormulario.textContent =
        "Adicionar nova joia";


    botaoCancelar.style.display =
        "none";


    botaoSalvar.textContent =
        "Salvar joia";

}


// =========================================
// CANCELAR EDIÇÃO
// =========================================

botaoCancelar.addEventListener(
    "click",
    function() {

        limparFormulario();

        mostrarMensagemProduto("");

    }
);


// =========================================
// ACOMPANHAR LOGIN
// =========================================

supabaseClient.auth
    .onAuthStateChange(
        (
            event,
            session
        ) => {

            if (
                event === "SIGNED_OUT"
            ) {

                mostrarLogin();

            }

        }
    );


// =========================================
// INICIAR
// =========================================

verificarLogin();