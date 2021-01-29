module.exports = function makeHttpRequest (controller) {
    return (req, res) => {
        const httpRequest = {
            body: req.body,
            params: req.params,
            query: req.query,
            ip: req.ip,
            path: req.path,
            method: req.method,
            headers: {
                'Content-Type': req.get('Content-Type'),
            }
        }

        try{
            const httpResponse = controller(httpRequest.body)
            res.set(httpResponse.headers)
            res.type('json')
            res.status(httpResponse.statusCode).send(httpResponse.body)
        }catch(e){
            res.status(500).send({ error: 'An unkown error occurred.' })
        }
    }
}