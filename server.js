const http = require('http');
const { randomUUID, ECDH } = require('crypto');

const livros = [
    {
        id: '1',
        title: 'teste',
        autor: 'Autor Teste',
        anoPublicacao: 2000
    }
];


const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    res.setHeader('Content-Type', 'application/json');

    //todos os livros
    if (method === 'GET' && url === '/livros') {
        return res.end(JSON.stringify(livros));
    }

    //pegar id 
    // if (method === 'GET' && url.startsWith('/livros/')) {
    //     const id = url.split('/')[2];
    //     const livro = livros.find(l => l.id === id);

    //     return res.end(JSON.stringify(livro || { erro: 'Livro não encontrado' }));
    // }

    if (method === "GET" && url.startsWith('/livros')) {
        const id = url.split('/')[2];
        const livro = livros.find(l => l.id === id);

        return res.end(JSON.stringify(livros))

    }

    //criação do livro
    if (method === 'POST' && url === '/livros') {
        let body = '';

        req.on('data', chunk => (body += chunk));
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const anoPublicacao = Number(data.anoPublicacao);

                (isNaN(anoPublicacao) || anoPublicacao <= 1441) &&
                    (() => { throw new Error('Ano de publicação inválido.'); })();

                const livro = { id: randomUUID(), ...data };
                livros.push(livro);

                res.statusCode = 201;
                return res.end(JSON.stringify(livro));
            } catch (error) {
                res.statusCode = 400;
                return res.end(JSON.stringify({ message: error.message }));
            }
        });

        return;
    }
    //atualizar livro
    if (method === 'PUT' && url.startsWith('/livros/')) {
        const id = url.split('/')[2];
        const index = livros.findIndex(l => l.id === id);

        if (index === -1) {
            res.statusCode = 404;
            return res.end(JSON.stringify({ erro: 'Livro não encontrado' }));
        }

        let body = '';
        req.on('data', chunk => (body += chunk));
        req.on('end', () => {
            const data = JSON.parse(body);
            livros[index] = { id, ...data };
            return res.end(JSON.stringify(livros[index]));
        });

        return;
    }
    // Rota não encontrada
    if (method === 'DELETE' && url.startsWith('/livros/')) {
        const id = url.split('/')[2];
        const index = livros.findIndex(l => l.id === id);

        if (index === -1) {
            res.statusCode = 404;
            return res.end(JSON.stringify({ erro: 'Livro não existe' }));
        } else {
            livros.splice(index, 1)[0]
            return res.end(JSON.stringify({ message: 'Livro removido', id: id }));
        }
    }
    res.statusCode = 404;
    res.end(JSON.stringify({ erro: 'Rota não encontrada' }));
});



server.listen(4000, () => {
    console.log('Servidor rodando em http://localhost:4000');
});


