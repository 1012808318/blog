

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var ReplySchema = new Schema({
	article: { type: ObjectId, ref: 'article' },
	from: { type: ObjectId, ref: 'user' },
	reply: [{
		from: { type: ObjectId, ref: 'user' },
		to: { type: ObjectId, ref: 'user' },
		content: String
	}],
	content: String,
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
});

ReplySchema.pre('save', function(next) {
	if( this.isNew ) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	next();
});

ReplySchema.statics = {
	findAll: function(cb) {
		return this.find({}).sort('meta.updateAt').exec(cb);
	},
	findByID: function(id, cb) {
		return this.findOne({_id: id}).exec(cb);
	}
};

module.exports = mongoose.model('reply', ReplySchema);