let connection= require('../model/connection');

require('dotenv').config();
class BodyParts{

    static getBodyParts(page_count,search_key,filter,cb){
        let pagination=process.env.ADMIN_PAGINATION;
        let skip =parseInt(page_count) * pagination;
        let sql;
        if(search_key!=''){
            sql=`SELECT body_parts.id,body_part_translations.name,body_parts.gender,body_parts.image FROM body_parts 
                LEFT JOIN body_part_translations ON body_parts.id=body_part_translations.body_part_id
                WHERE body_part_translations.language=1 AND upper(body_part_translations.name) LIKE '%${search_key.toUpperCase()}%' ORDER BY body_parts.id DESC LIMIT ${pagination} OFFSET ${skip}`;
        }else if(filter!=''){
            sql=`SELECT body_parts.id,body_part_translations.name,body_parts.gender,body_parts.image FROM body_parts 
                LEFT JOIN body_part_translations ON body_parts.id=body_part_translations.body_part_id
                WHERE body_part_translations.language=1 AND body_parts.gender=${filter} ORDER BY body_parts.id DESC LIMIT ${pagination} OFFSET ${skip}`;
        }
        else{
            sql=`SELECT body_parts.id,body_part_translations.name,body_parts.gender,body_parts.image FROM body_parts 
                LEFT JOIN body_part_translations ON body_parts.id=body_part_translations.body_part_id
                WHERE body_part_translations.language=1 ORDER BY body_parts.id DESC LIMIT ${pagination} OFFSET ${skip}`;
        }
        
        connection.query(sql,cb);        
    }

    static getBodyPartListingWithoutPaginations(gender,cb){
        let sql;
        if(gender!=''){
            sql=`SELECT body_parts.id,body_part_translations.name,body_parts.gender,body_parts.image FROM body_parts 
                LEFT JOIN body_part_translations ON body_parts.id=body_part_translations.body_part_id
                WHERE body_part_translations.language=1 AND body_parts.gender=${gender} ORDER BY body_parts.id DESC`;
        }else{
            sql=`SELECT body_parts.id,body_part_translations.name,body_parts.gender,body_parts.image FROM body_parts 
            LEFT JOIN body_part_translations ON body_parts.id=body_part_translations.body_part_id
            WHERE body_part_translations.language=1 ORDER BY body_parts.id DESC`;
        }
        
        connection.query(sql,cb);        
    }

    static getBodyPartsCount(search_key,filter,cb){
        let sql;
        if(search_key!=''){
            sql=`SELECT COUNT(body_parts.id) as count FROM body_parts 
                LEFT JOIN body_part_translations ON body_parts.id=body_part_translations.body_part_id
                WHERE body_part_translations.language=1 AND upper(body_part_translations.name) LIKE '%${search_key.toUpperCase()}%'`;
        }else if(filter!=''){
            sql=`SELECT COUNT(body_parts.id) as count FROM body_parts 
                LEFT JOIN body_part_translations ON body_parts.id=body_part_translations.body_part_id
                WHERE body_part_translations.language=1 AND body_parts.gender=${filter} ORDER BY body_parts.id DESC`;
        }
        else{
            sql=`SELECT COUNT(body_parts.id) as count FROM body_parts 
                LEFT JOIN body_part_translations ON body_parts.id=body_part_translations.body_part_id
                WHERE body_part_translations.language=1`;
        }
        
        connection.query(sql,cb);
    }

    static addBodyParts(inputs,cb){
        console.log(inputs);
        let name=inputs.name?inputs.name:'';
        let gender=inputs.gender?inputs.gender:'';
        let image=inputs.image?inputs.image:'';
        if(gender==3){
            let body_part=`INSERT INTO body_parts (image,gender) VALUES ?`;
            var values = [
                [ image, '1'],
                [ image, '2']
            ];
            connection.query(body_part,[values],(err,result)=>{
                if(err){console.log(err)}
                let id=result.insertId;
                let second_id=result.insertId+1;
                
                let body_part_translations=`INSERT INTO body_part_translations (body_part_id,name,language) VALUES ?`;
                var values = [
                    [ id, name,'1'],
                    [ second_id, name,'1']
                ];
                connection.query(body_part_translations,[values],cb);
            });
        }else{
            let body_part=`INSERT body_parts SET id=NULL,image=?,gender=?`;
            let body_part_translations=`INSERT body_part_translations SET body_part_id=?,name=?,language=?`;
            connection.query(body_part,[image,gender],(err,result)=>{
                if(err){
                    console.log(err);
                }else{
                    connection.query(body_part_translations,[result.insertId,name,1],cb);
                }
            });
        }
        
    }

    static editBodyPart(inputs,cb){
        console.log(inputs);
        let name=inputs.name?inputs.name:'';
        let id=inputs.id?inputs.id:'';
        let gender=inputs.gender?inputs.gender:'';
        let image=inputs.image?inputs.image:'';
        let bodyparttr;
        let param;
        if(image==''){
             bodyparttr=`UPDATE body_parts SET gender=? WHERE id=?`;
             param=[gender,id];
        }else{
             bodyparttr=`UPDATE body_parts SET gender=?,image=? WHERE id=?`;
             param=[gender,image,id];
        }
        connection.query(bodyparttr,param,(err,result)=>{
            if(err){
                console.log(err);
            }
        });
        let bodyPart=`UPDATE body_part_translations SET name=? WHERE body_part_id=? AND language=1`;
        connection.query(bodyPart,[name,id],cb);
    }

    static deleteBodyPart(part_id,cb){
        let bodyPart=`DELETE FROM body_parts WHERE id=?`;
        let bodyPartTranslations=`DELETE FROM body_part_translations WHERE body_part_id=?`;
        connection.query(bodyPart,[part_id],(err,result)=>{
            if(err){
                console.log(err);
            }else{
                connection.query(bodyPartTranslations,[part_id],cb);
            }
        });
    }

}

module.exports=BodyParts;