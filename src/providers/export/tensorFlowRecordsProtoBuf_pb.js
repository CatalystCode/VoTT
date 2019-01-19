/* eslint-disable */
/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

goog.exportSymbol('proto.tfrecordsimagepackage.ObjectMessage', null, global);
goog.exportSymbol('proto.tfrecordsimagepackage.TFRecordsImageMessage', null, global);

/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.tfrecordsimagepackage.ObjectMessage = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.tfrecordsimagepackage.ObjectMessage, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.tfrecordsimagepackage.ObjectMessage.displayName = 'proto.tfrecordsimagepackage.ObjectMessage';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.tfrecordsimagepackage.ObjectMessage.prototype.toObject = function(opt_includeInstance) {
  return proto.tfrecordsimagepackage.ObjectMessage.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.tfrecordsimagepackage.ObjectMessage} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.tfrecordsimagepackage.ObjectMessage.toObject = function(includeInstance, msg) {
  var f, obj = {
    difficult: jspb.Message.getFieldWithDefault(msg, 1, 0),
    truncated: jspb.Message.getFieldWithDefault(msg, 2, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.tfrecordsimagepackage.ObjectMessage}
 */
proto.tfrecordsimagepackage.ObjectMessage.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.tfrecordsimagepackage.ObjectMessage;
  return proto.tfrecordsimagepackage.ObjectMessage.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.tfrecordsimagepackage.ObjectMessage} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.tfrecordsimagepackage.ObjectMessage}
 */
proto.tfrecordsimagepackage.ObjectMessage.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setDifficult(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setTruncated(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.tfrecordsimagepackage.ObjectMessage.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.tfrecordsimagepackage.ObjectMessage.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.tfrecordsimagepackage.ObjectMessage} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.tfrecordsimagepackage.ObjectMessage.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDifficult();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getTruncated();
  if (f !== 0) {
    writer.writeInt32(
      2,
      f
    );
  }
};


/**
 * optional int32 difficult = 1;
 * @return {number}
 */
proto.tfrecordsimagepackage.ObjectMessage.prototype.getDifficult = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.tfrecordsimagepackage.ObjectMessage.prototype.setDifficult = function(value) {
  jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional int32 truncated = 2;
 * @return {number}
 */
proto.tfrecordsimagepackage.ObjectMessage.prototype.getTruncated = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.tfrecordsimagepackage.ObjectMessage.prototype.setTruncated = function(value) {
  jspb.Message.setProto3IntField(this, 2, value);
};



/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.tfrecordsimagepackage.TFRecordsImageMessage = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.tfrecordsimagepackage.TFRecordsImageMessage, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.tfrecordsimagepackage.TFRecordsImageMessage.displayName = 'proto.tfrecordsimagepackage.TFRecordsImageMessage';
}


if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto suitable for use in Soy templates.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
 * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
 *     for transitional soy proto support: http://goto/soy-param-migration
 * @return {!Object}
 */
proto.tfrecordsimagepackage.TFRecordsImageMessage.prototype.toObject = function(opt_includeInstance) {
  return proto.tfrecordsimagepackage.TFRecordsImageMessage.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Whether to include the JSPB
 *     instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.tfrecordsimagepackage.TFRecordsImageMessage} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.tfrecordsimagepackage.TFRecordsImageMessage.toObject = function(includeInstance, msg) {
  var f, obj = {
    height: jspb.Message.getFieldWithDefault(msg, 1, 0),
    width: jspb.Message.getFieldWithDefault(msg, 2, 0),
    filename: jspb.Message.getFieldWithDefault(msg, 3, ""),
    sourceId: jspb.Message.getFieldWithDefault(msg, 4, ""),
    object: (f = msg.getObject()) && proto.tfrecordsimagepackage.ObjectMessage.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.tfrecordsimagepackage.TFRecordsImageMessage}
 */
proto.tfrecordsimagepackage.TFRecordsImageMessage.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.tfrecordsimagepackage.TFRecordsImageMessage;
  return proto.tfrecordsimagepackage.TFRecordsImageMessage.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.tfrecordsimagepackage.TFRecordsImageMessage} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.tfrecordsimagepackage.TFRecordsImageMessage}
 */
proto.tfrecordsimagepackage.TFRecordsImageMessage.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setHeight(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setWidth(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setFilename(value);
      break;
    case 4:
      var value = /** @type {string} */ (reader.readString());
      msg.setSourceId(value);
      break;
    case 5:
      var value = new proto.tfrecordsimagepackage.ObjectMessage;
      reader.readMessage(value,proto.tfrecordsimagepackage.ObjectMessage.deserializeBinaryFromReader);
      msg.setObject(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.tfrecordsimagepackage.TFRecordsImageMessage.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.tfrecordsimagepackage.TFRecordsImageMessage.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.tfrecordsimagepackage.TFRecordsImageMessage} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.tfrecordsimagepackage.TFRecordsImageMessage.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getHeight();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getWidth();
  if (f !== 0) {
    writer.writeInt32(
      2,
      f
    );
  }
  f = message.getFilename();
  if (f.length > 0) {
    writer.writeString(
      3,
      f
    );
  }
  f = message.getSourceId();
  if (f.length > 0) {
    writer.writeString(
      4,
      f
    );
  }
  f = message.getObject();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      proto.tfrecordsimagepackage.ObjectMessage.serializeBinaryToWriter
    );
  }
};


/**
 * optional int32 height = 1;
 * @return {number}
 */
proto.tfrecordsimagepackage.TFRecordsImageMessage.prototype.getHeight = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/** @param {number} value */
proto.tfrecordsimagepackage.TFRecordsImageMessage.prototype.setHeight = function(value) {
  jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional int32 width = 2;
 * @return {number}
 */
proto.tfrecordsimagepackage.TFRecordsImageMessage.prototype.getWidth = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/** @param {number} value */
proto.tfrecordsimagepackage.TFRecordsImageMessage.prototype.setWidth = function(value) {
  jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional string filename = 3;
 * @return {string}
 */
proto.tfrecordsimagepackage.TFRecordsImageMessage.prototype.getFilename = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};


/** @param {string} value */
proto.tfrecordsimagepackage.TFRecordsImageMessage.prototype.setFilename = function(value) {
  jspb.Message.setProto3StringField(this, 3, value);
};


/**
 * optional string source_id = 4;
 * @return {string}
 */
proto.tfrecordsimagepackage.TFRecordsImageMessage.prototype.getSourceId = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 4, ""));
};


/** @param {string} value */
proto.tfrecordsimagepackage.TFRecordsImageMessage.prototype.setSourceId = function(value) {
  jspb.Message.setProto3StringField(this, 4, value);
};


/**
 * optional ObjectMessage object = 5;
 * @return {?proto.tfrecordsimagepackage.ObjectMessage}
 */
proto.tfrecordsimagepackage.TFRecordsImageMessage.prototype.getObject = function() {
  return /** @type{?proto.tfrecordsimagepackage.ObjectMessage} */ (
    jspb.Message.getWrapperField(this, proto.tfrecordsimagepackage.ObjectMessage, 5));
};


/** @param {?proto.tfrecordsimagepackage.ObjectMessage|undefined} value */
proto.tfrecordsimagepackage.TFRecordsImageMessage.prototype.setObject = function(value) {
  jspb.Message.setWrapperField(this, 5, value);
};


proto.tfrecordsimagepackage.TFRecordsImageMessage.prototype.clearObject = function() {
  this.setObject(undefined);
};


/**
 * Returns whether this field is set.
 * @return {!boolean}
 */
proto.tfrecordsimagepackage.TFRecordsImageMessage.prototype.hasObject = function() {
  return jspb.Message.getField(this, 5) != null;
};


goog.object.extend(exports, proto.tfrecordsimagepackage);
