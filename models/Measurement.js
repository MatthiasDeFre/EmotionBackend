var mongoose = require('mongoose');
var MeasurementSchema = mongoose.Schema({
    type : {type: String, enum: ['BLIJ', 'DROEVIG', "BOOS", "ONVERSCHILLIG", "GEFRUSTREERD","ANDERS"]},
    date : {type: Date, default: new Date(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate())}
 })

 mongoose.model("measurement", MeasurementSchema);
