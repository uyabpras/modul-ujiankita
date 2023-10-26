module.exports = (sequelize, DataTypes) =>{
    const Modul = sequelize.define('Modul',{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          description: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          id_soal: {
            type: DataTypes.ARRAY,
            allowNull: false,
          },
          status: {
            type: DataTypes.ENUM,
            values: ['active', 'pending', 'deactive']
          }
    })

    return Modul
};