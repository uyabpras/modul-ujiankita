const { Error } = require('sequelize');
const db = require('../db/connect');
const modulDB = db.modul;
//const axiosInstance = require('../helper/axiosInstance')
const kafkaProducer = require('../config/kafka');

exports.list = async(req,res) => {
    try {
        const page = req.query.page;
        const limit = parseInt(req.query.limit)|| 10;
        const offset = page * limit - limit;
        const whereClause = {};

        if (req.query.name){
            whereClause.name = req.query.name;
        }

        if(req.query.status){
            whereClause.status = req.query.status;
        }

        const result = await modulDB.findAndCount({
          where: whereClause,
          order: [["createdAt", req.query.order || "ASC"]],
          limit: limit,
          offset: offset
        });

        const totalpages = Math.ceil(result.count / limit);
        if (page > totalpages) {
            res.status(400).json({
              success: false,
              message: "Invalid page number, exceeds total pages.",
              totalpages: totalpages
            });
          } else {
            res.status(200).json({
              success: true,
              data: result.rows,
              totalpages: totalpages
            });
          }
    } catch (err) {
        res.status(500).send({
            message: err.message || "error getting soal"
        });
    }
};

exports.get = async (req, res) => {
    try{
        const result = await modulDB.findByPk(req.params.id)
        if (!result) {
            res.status(404).send({ 
                success: false,
                data: null,
                message: "soal not found by id:" + req.params.id
            });
        } else {
            res.status(200).send({
                success: true,
                data: result,
            });
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "error getting soal"
        });
    }
};

exports.add = async (req,res) =>{
    try {
        if (req.body.token.role === 'admin' || req.body.token.role === 'guru'){
            res.status(403).json({
                success: false, 
                message: 'access denied only for admins/teacher'
            });  
        };

        if(req.body.status !== "active" || req.body.status !== "deactivated" || req.body.status !== "pendings"){
            res.status(400).send({ 
                success: false,
                data: null,
                message: "status not compatible: " + req.body.status
            });
        };

        const addModul = {
            name : req.body.name,
            description: req.body.description,
            id_soal: req.body.id_soal,
            status: req.body.status,
        };

        const result = await modulDB.create(addModul)
        if(!result){
            res.status(400).send({
                success: false,
                message: "failed creating modul",
                err: Error,
            });
        }

        const msg = {
            userID : req.body.token.id,
            service: 'modul',
            typeTask: `modul ID: ${result.id}`,
            data: {
                modul: result._id,
                status: result.status,
                desc: 'create modul'
            }
        };
        kafkaProducer.createTask(msg);

        return res.status(200).json({
            success: true,
            data: result,
            message: "success creating modul"
        });
    } catch (err) {
        res.status(500).send({
            message: err.message || "error connect service"
        });
    }
};

exports.editModul = async (req, res) => {
    try {
        if (req.body.token.role === 'admin' || req.body.token.role === 'guru'){
            res.status(403).json({
                success: false, 
                message: 'access denied only for admins/teachers'
            });  
        };
        const findID = await modulDB.findByPk(req.params.id);

        if (!FindID) {
            res.status(404).send({ 
                success: false,
                data: null,
                message: "modul not found by id:" + req.params.id
            });
        }

        let new_dataSoal = findID.soal_id;

        if (req.body.delete_soal){
            new_dataSoal = new_dataSoal.filter(item => !req.body.delete_soal.includes(item));
        }

        if (req.body.add_soal){
            for(const item of req.body.add_soal){
                if (!new_dataSoal.includes(item)){
                    new_dataSoal.push(item);
                }
            }
        }

        const updateModul = {
            name: req.body.name,
            description: req.body.description,
            id_soal: new_dataSoal,
            status: req.body.status
        };
        
        const updatedModul = modulDB.update(updateModul,{where:{id: req.body.id}});
        if (!updatedModul){
            res.status(400).send({ 
                success: false,
                data: updatedModul,
                message: "update modul is failed by id:" + req.params.id,
                error: err
            });
        }

        const msg = {
            userID: req.body.token.id,
            service: 'modul',
            typeTask: `modul ID: ${updateModul.id}`,
            data:{
                soal: updateModul.id,
                desc: req.body.comment || 'update modul'
            }
        }
        kafkaProducer.updateTask(msg);

        res.status(200).send({
            success: true,
            data: updatedModul,
            message: "successfully updated data by id:" + req.params.id
        });

    } catch (err) {
        res.status(500).send({
            message: err.message || "error connect service"
        }); 
    }
};

exports.delete = async(req,res)=>{
    try {
        if (req.body.token.role === 'admin' || req.body.token.role === 'guru'){
            res.status(403).json({
                success: false, 
                message: 'access denied only for admins/teachers'
            });  
        };
        const findID = await modulDB.findByPk(req.params.id);
      // If no results found, return document not found
      if (!findID) {
        res.status(404).json({
          success: false,
          result: null,
          message: "No modul found by this id: " + req.params.id,
        });
    }else{
        const result = await modulDB.destroy({where: {id: req.params.id}})

        const msg = {
            userID: req.body.token.id,
            service: 'modul',
            typeTask: `modul ID: ${req.params.id}`,
            data:{
                soal: req.params.id,
                desc: 'delete'
            }
        }
        kafkaProducer.updateTask(msg);

        res.status(200).json({
          success: true,
          data: result,
          message: "Successfully Deleted the modul by id: " + req.params.id,
        });
    }  
    } catch (err) {
        res.status(500).send({
            message: err.message || "error connect service"
        }); 
    }
};

exports.getHealth = async(req, res) => {
    const data = {
      uptime: process.uptime(),
      message: 'Ok',
      date: new Date()
    }
  
    res.status(200).send(data);
  }