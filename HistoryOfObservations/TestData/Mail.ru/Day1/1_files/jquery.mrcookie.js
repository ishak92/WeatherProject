/**
 * Mail.Ru cookie parser plugin
 * Copyright (c) 2012 Mail.Ru
 */
(function($) {
	var reObj = /Object/;
	var isObject = function (value) {
		return reObj.test(Object.prototype.toString.call(value));
	};
	var cookie = $.cookie = function(key, value, options) {
		var mExpires, exprsIsNum, dExprs, pairNo, aPairs, aPair, ckeVal;
		if (arguments.length > 1 && !isObject(value)) {
			options = $.extend({}, options);
			if (value === null || value === undefined) {
				options.expires = -1;
			}
			if ((exprsIsNum = !isNaN(mExpires = options.expires)) || mExpires instanceof Date) {
				mExpires = (exprsIsNum ? ((dExprs = new Date()).setDate(dExprs.getDate() + mExpires), dExprs) : mExpires).toUTCString();
			} else {
				mExpires = null;
			}
			value += '';
			return (document.cookie = [
				encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value),
				mExpires ? '; expires=' + mExpires : '',
				options.path ? '; path=' + options.path : '',
				options.domain ? '; domain=' + options.domain : '',
				options.secure ? '; secure' : ''
			].join(''));
		}
		options = value || {};
		aPairs = document.cookie.split('; ');
		pairNo = -1;
		while ((aPair = aPairs[++pairNo]) && (aPair = aPair.split('='))) {
			if (decodeURIComponent(aPair[0]) === key) {
				while (aPair.length > 2) {
					aPair[aPair.length - 2] += '=' + aPair.pop();
				}
				ckeVal = aPair[1] || '';
				return options.raw ? ckeVal : decodeURIComponent(ckeVal);
			}
		}
		return null;
	};
	
	var PRIMARY_LIST = ['s']; //список кук, для записи в домен 2-го уровня
	var rePairs = /(\w+)\=(.*?)(\||$)/g;
	var reDomain = /(?:[^\.]+\.)?([^\.]+\.\w+)$/;
	
	$.mrcookie = function(name, field, value, options) {
		var oFldVals = {};
		var mDomain = window.location.hostname;
		var mCkeVals, aPair, mFldVal;
		if (isObject(value)) {
			options = value;
			value = undefined;
		}
		options = options || {};
		if (name && field) {
			mCkeVals = cookie(name, options) || '';
			rePairs.lastIndex = 0;
			while (aPair = rePairs.exec(mCkeVals)) {
				oFldVals[aPair[1]] = aPair[2];
			}
			if (typeof value != 'undefined') {
				if (mDomain && (mDomain = mDomain.match(reDomain))) {
					//если имя куки есть в списке - пишем в домен 2-го уровня
					mDomain = mDomain[($.inArray(name, PRIMARY_LIST) == -1) ? 0 : 1];
					oFldVals[field] = value;
					mCkeVals = [];
					for (var fldName in oFldVals) {
						if (oFldVals.hasOwnProperty(fldName) && (mFldVal = oFldVals[fldName]) != null && mFldVal !== false) {
							mCkeVals.push(fldName + '=' + mFldVal);
						}
					}
					cookie(
						name,
						mCkeVals.join('|'),
						{
							domain : mDomain,
							expires : 365,
							path: options.path || '/',
							raw: options.raw
						}
					);
				}
			}
			return oFldVals[field];
		}
		return undefined;
	}
})(jQuery);