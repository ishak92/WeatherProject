(function (window, oNS) {
	var typeOf = oNS.Basic.typeOf;
	var oArrayProto = Array.prototype;

	if (!oArrayProto.map) {
		oArrayProto.map = function(fCallback, oContext) {
			if (this == null) {
				throw new TypeError(" this is null or not defined");
			}
			if (!typeOf(fCallback, 'function')) {
				throw new TypeError(fCallback + " is not a function");
			}
			var oObjectRep = Object(this);
			var iLength = oObjectRep.length >>> 0;
			var oApplyingContext, aResult, iterationIndex = 0;
			var mValue, mappedValue;
			if (arguments.length > 1) {
				oApplyingContext = oContext;
			}
			aResult = new Array(iLength);

			while(iterationIndex < iLength) {
				if (iterationIndex in oObjectRep) {
					mValue = oObjectRep[iterationIndex];
					mappedValue = fCallback.call(oApplyingContext, mValue, iterationIndex, oObjectRep);
					aResult[iterationIndex] = mappedValue;
				}
				iterationIndex++;
			}
			return aResult;
		};
	}
	
	if (!oArrayProto.forEach) {
		oArrayProto.forEach = function (fCallback, oContext) {
		'use strict';
			for (var i = 0, iLen = this.length; i < iLen; i++) {
				if (i in this) {
					fCallback.call(oContext, this[i], i, this);
				}
			}
		};
	}
}(this, this.ru.mail.cpf));