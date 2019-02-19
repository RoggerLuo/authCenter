const mongoose = require("mongoose");
const def = require("../utils/default_val").def;

const subjectPrototype = {
    name:def.string,
    popularity:def.number,
    image:def.string,
}
schema = new mongoose.Schema(subjectPrototype)
mongoose.model("subject", schema);


//   const userAgent = {
//     browser: {},
//     cpu: {},
//     device: {},
//     engine: {},
//     os: {},
//     ua: {},
//   };

//   const visitPage = {
//     url: def.string,
//     name: def.string,
//     time: def.string,
//   };


    // url: def.string,
    // type: def.string,
    // name: def.string,
    // description: def.string,
    // line: def.string,
    // column: def.string,
    // createDate: def.date,
    // userAgent,
    // visitPage,
    // stack: [],
    // appId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "App"
    // },

