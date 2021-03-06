(function ($, window, oFest) {
	var oPortalMenu = window.__PM;
	if (!oPortalMenu) {
		return;
	}
	var sBaseUrl = '/ext/suggest/';
	var sCounterUrl = '//rs.mail.ru/sb5401552.gif';
	var fTemplate = oFest['search_suggest'];
	var oDataCahce = {};
	function prepareItem(oItem) {
		return {
			html: fTemplate(oItem),
			text: oItem.name,
			caption: oItem.temp || '',
			data: {
				url: oItem.url
			}
		};
	}
	function prepareSuggestData(sSearchVal, aData) {
		aData.splice(15);
		return {
			searchText: sSearchVal,
			items: [{
				items: aData.map(prepareItem)
			}]
		};
	}
	function processSuggestData(oOnDataReady, sSearchVal, mResult) {
		var oData;
		if (mResult === false) {
			delete oDataCahce[sSearchVal];
			oOnDataReady.reject();
		} else {
			oDataCahce[sSearchVal] = oData = prepareSuggestData(sSearchVal, mResult);
			oOnDataReady.resolve(oData);
		}
	}
	function getSuggestData(sSearchVal) {
		var oOnDataReady = $.Deferred();
		if (sSearchVal in oDataCahce) {
			oOnDataReady.resolve(oDataCahce[sSearchVal]);
		} else {
			$.getJSON(sBaseUrl, {q: sSearchVal})
				.done(processSuggestData.bind(null, oOnDataReady, sSearchVal))
				.fail(processSuggestData.bind(null, oOnDataReady, sSearchVal, false));
			oDataCahce[sSearchVal] = oOnDataReady;
		}
		return oOnDataReady;
	}
	oPortalMenu.getItems(function (oItems) {
		var oSearch = oItems.toolbar.items[0].itemsByName.search;
		var mSuggested = null, bSelected = false;
		function goToItem(oItem) {
			setTimeout(function () {
				window.location.assign(oItem.data.url);
			}, 100);
		}
		function drawSuggest(oData) {
			oSearch.suggests.list(oData);
		}
		oSearch.on('submit', function (oEvt) {
			var mSuggestedGroup = mSuggested !== null && mSuggested.length === 1 && mSuggested[0].items;
			var bIsOneSuggest = mSuggestedGroup.length === 1;
			if (bIsOneSuggest) {
				goToItem(mSuggestedGroup[0]);
			}
			if (bSelected || bIsOneSuggest) {
				oEvt.preventDefault();
			}
			if (!bSelected) {
				(new Image).src = sCounterUrl;
			}
		}).input.on('input keyup', function (oEvt) {
			var sSearchVal = oEvt.target.value;
			mSuggested = null;
			if (sSearchVal.length > 0) {
				getSuggestData(sSearchVal).done(drawSuggest).done(function (oData) {
					mSuggested = oData.items;
				});
			}
		});
		oSearch.suggests.on('select', function(oEvt, oItem) {
			(new Image).src = sCounterUrl;
			bSelected = true;
			setTimeout(function () {bSelected = false}, 100);
			goToItem(oItem);
		});
	});
	
}(this.jQuery, this, this.fest));
