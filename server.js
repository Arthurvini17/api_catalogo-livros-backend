const http = require('http');
const { url } = require('inspector');

const livros = [];

const getLivros = http.createServer((req, res) => {
    try {
        if (req.method === 'GET' && req.url === '/livros') {
            req.end(JSON.stringify((livros))
            )
        }
    } catch (error) {

    }
})

getLivros.listen(4001, () => {
    console.log('Metodo get online')
})