const admin = require("../firebase-config");

class MiddleWare{

    async decodedToken(req,res,next) {

        const token = req.headers.authorization.split(' ')[1];

        try{

            const decodeValue = await admin.auth().verifyIdToken(token);

            if(decodeValue){
                return next();
            }

            return res.json( {message: 'Un authorize' } );
            
        }
        catch(err){
            return res.json( {message: 'internal error' } );
        }
        
    }
    
}

module.exports = new MiddleWare();