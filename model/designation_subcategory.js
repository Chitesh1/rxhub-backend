let connection=require('../model/connection');
require('dotenv').config();
class DesignationSubCategory{

    static getDesignationSubCatList(page_count,cat_id,cb){
        let pagination=process.env.ADMIN_PAGINATION;
        let skip=parseInt(page_count) * pagination;
        let sqlQuery=`SELECT designation_subcategories.id,designation_subcategories.name,designation_categories.name as category_name FROM designation_subcategories 
         LEFT JOIN designation_categories ON designation_subcategories.designation_category_id=designation_categories.id
         WHERE designation_subcategories.designation_category_id =${cat_id} ORDER BY designation_subcategories.id DESC `;
        connection.query(sqlQuery,cb);            
    }

    static getDesignationSubCatListCount(cat_id,cb){
        let sqlQuery=`SELECT COUNT(designation_subcategories.id) as count FROM designation_subcategories 
        LEFT JOIN designation_categories ON designation_subcategories.designation_category_id=designation_categories.id
        WHERE designation_subcategories.designation_category_id =${cat_id}`;  
        connection.query(sqlQuery,cb);
    }

    static editSubCategory(id,inputs,cb){
        let name=inputs.name?inputs.name:'';
        let category_id=inputs.cat_id?inputs.cat_id:'';
        let sqlQuery=`UPDATE designation_subcategories SET name=?,designation_category_id =? WHERE id=?`;
        connection.query(sqlQuery,[name,category_id,id],cb);
    }

    static addSubCategory(inputs,cb){
        console.log(inputs);    
        let name=inputs.name?inputs.name:'';
        let cat_id=inputs.cat_id?inputs.cat_id:'';
        let disease=`INSERT designation_subcategories SET name=?,designation_category_id=?`;
        // let disease_translations=`INSERT disease_translations SET disease_id=?,language=?,name=?`;s
        connection.query(disease,[name,cat_id],cb);
    }

    static deleteSubCategories(subcat_id,cb){
        let sqlQuery=`DELETE FROM designation_subcategories WHERE id=${subcat_id}`;
        connection.query(sqlQuery,cb);
    }


}

module.exports=DesignationSubCategory;