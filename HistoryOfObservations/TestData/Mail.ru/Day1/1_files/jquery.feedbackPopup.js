(function (window, $, oNS) {
	var typeOf = oNS.Basic.typeOf;
	var jPopup = $('#box-feedback');
	if (!jPopup.length) {
		return;
	}
	var sPpDataPrm = '_showOpts';
	var reqUrl = '/ext/feedback/';
	var jForm = jPopup.find('#feedback-form');
	var jValidateFields = jForm.find('.js-field_to_validate');
	var sErrorFieldClss = 'g-form__field_error';
	var sMessageSel = '.js-message-container:visible';
	var aStatusClss = ['g-submit-to_done', 'g-submit-to_error'];
	var oScrn = window.screen;
	var oFrmFlds = {
		'feedback_text': '',
		'feedback_from_url': window.location.href,
		'feedback_user_agent': window.navigator.userAgent,
		'feedback_screen_size': oScrn ? oScrn.width + "x" + oScrn.height : '',
		'feedback_rb_region': function () {
			return $.mrcookie('s', 'georb');
		}
	};
	var fSetState = function (mStatus, sMessage) {
		var bCertain = typeOf(mStatus, 'boolean');
		var bError = bCertain ? mStatus : false;
		if (sMessage) {
			jForm.find(sMessageSel).html(sMessage);
		}
		jForm.removeClass(aStatusClss.slice(0, 2).join(' '));
		if (bCertain) {
			jForm.addClass(aStatusClss[bError * 1]);
		}
	};
	var hOnResponse = function (oRes) {
		var bSuccess = false;
		var sMessage;
		if (typeOf(oRes, 'object')) {
			bSuccess = oRes.status == 'OK';
			sMessage = oRes.message;
		}
		fSetState(!bSuccess, sMessage);
	};
	var hOnRequestFail = function () {
		fSetState(true);
	};
	var fValidate = function () {
		var bOk = true;
		jValidateFields.each(function () {
			var jField = $(this);
			var bEmpty = !jField.val();
			if (bEmpty) {
				bOk = false;
			}
			jField.toggleClass(sErrorFieldClss, bEmpty);
		});
		return bOk;
	};
	jForm.bind('submit', function (e) {
		e.preventDefault();
		if (fValidate()) {
			$.ajax({
				url: reqUrl,
				type: 'POST',
				data: jForm.serialize(),
				dataType: 'json'
			}).done(hOnResponse).fail(hOnRequestFail);
		} else {
			fSetState(true);
		}
	});
	jPopup.data(sPpDataPrm, {
		beforeShow: function () {
			var jFld, mfldVal;
			for (var fldName in oFrmFlds) {
				if (oFrmFlds.hasOwnProperty(fldName) && (jFld = jForm.find(':input[name="' + fldName + '"]')).length) {
					jFld.val(typeOf(mfldVal = oFrmFlds[fldName], 'function') ? mfldVal() : mfldVal);
				}
			}
			fSetState();
		}
	});
})(window, jQuery, this.ru.mail.cpf);