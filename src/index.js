const { request, response } = require('express');
const express = require('express');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());

/**
 * Tipos de parâmetros:
 * 
 * Query Params: Filtros e paginação
 * Route Params: Identificar recursos (Atualizar ou deletar)
 * Request Body: Conteúdo na hora criar ou editar um recurso (JSON)
 */

const projects = [];

function logRequest(request, response, next) {
    const { method, url } = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.time(logLabel);

    next();

    console.timeEnd(logLabel);
}

function validateProjectId(request, response, next) {
    const { id } = request.params;

    if (!isUuid(id)) {
        return response.status(400).json({ error: 'Invalid project ID' });
    }

    return next();
}

app.use(logRequest);
app.use('/projects/:id', validateProjectId);

app.get('/projects', (request, response) => {
    // const query = request.query; // Query Params: Filtros e paginação
                        // Insomnia tem aba especifica para esse recurso
    // console.log(title);
    // console.log(owner);

    const { title } = request.query;

    const results = title 
        ? projects.filter(project => project.title.includes(title))
        : projects;

    return response.json(results);
})

app.post('/projects', (request, response) => {
    // const body = request.body;

    // console.log(body);
    
    const { title, owner } = request.body;

    const project = { id: uuid(), title, owner };

    projects.push(project);

    return response.json(project);
})

app.put('/projects/:id', (request, response) => {
    const { id } = request.params;
    const { title, owner } = request.body;

    const projectIndex = projects.findIndex(projectFind => projectFind.id === id)
    
    if (projectIndex < 0 ) {
        return response.status(400).json({ error: 'Project not found!'})
    }

    const project = {
        id,
        title,
        owner,
    };

    projects[projectIndex] = project;   

    return response.json(project);
})

app.delete('/projects/:id', (request, response) => {
    const { id } = request.params;

    const projectIndex = projects.findIndex(projectFind => projectFind.id === id)
    
    if (projectIndex < 0 ) {
        return response.status(400).json({ error: 'Project not found!'});
    }

    // Remove do array e a qtde para remover
    projects.splice(projectIndex, 1);

    projects[projectIndex] = project;   

    return response.status(204).send();
})

app.listen(3333, () => {
    console.log('🚀 Back-end started!');
})