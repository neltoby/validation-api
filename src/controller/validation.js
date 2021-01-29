module.exports = function makeValidationController ({ makeValidation }) {
    return function validationController (request){
        try{
            const res = makeValidation(request)
            return {
                headers: {
                    'Content-Type': 'application/json',
                }, 
                statusCode: 200,
                body: res
            }
        }catch(e){
            return {
                headers: {
                    'Content-Type': 'application/json',
                }, 
                statusCode: e.statusCode,
                body: e.message
            };
        }
    }
}