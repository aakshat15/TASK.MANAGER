import Pool from "../db/dbConfig.js" 
export default class Admin{
    constructor(id,email,password) {
        this.id = id;
        this.email = email;
        this.password = password;
    } 

    authantication(){
        return new Promise((resolve , reject) => {
            Pool.getConnection((err , con) =>{
                if(!err){
                    let sql = "select * from admin where email = ? and password = ?";
                    con.query(sql,[this.email,this.password],(err,result) => {
                        con.release();
                        err ? reject(err) : resolve(result);
                    })
                }
                else{
                    reject(err);
                }
            })
        })
    }
}